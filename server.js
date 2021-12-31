require('dotenv').config()

const vite = require('vite')
const axios = require('axios').default
const { AtCoderProblemsClient } = require('./server/atcoder-problems')
const { TwitterClient } = require('./server/twitter')
const { YouTubeClient } = require('./server/youtube')

async function main() {
  const server = await vite.createServer()

  await server.listen()

  server.printUrls()

  axios.interceptors.request.use((request) => {
    console.log('Request: %s', request.url)
    return request
  })

  axios.interceptors.response.use((response) => {
    console.log('Response: %s (%s)', response.statusText, response.request.host)
    return response
  })

  const atcoder = new AtCoderProblemsClient()

  setInterval(async () => {
    const submissions = await atcoder
      .fetchSubmissions({
        user: `n4o847`,
        from: new Date(`2021-12-25T00:00+09:00`)
      })
      .catch((error) => {
        console.error(error)
        return []
      })

    server.ws.send({
      type: 'custom',
      event: 'submissions',
      data: submissions
    })
  }, 10 * 1000)

  const twitter = new TwitterClient({
    bearerToken: process.env.TWITTER_BEARER_TOKEN
  })

  const youtube = new YouTubeClient({
    apiKey: process.env.YOUTUBE_API_KEY
  })

  const [liveChatId] = await youtube.fetchChatIdList({
    videoId: process.env.YOUTUBE_VIDEO_ID
  })

  setInterval(async () => {
    const [tweets, messages] = await Promise.all([
      twitter
        .fetchTweets({
          q: `#除夜bf -filter:retweets -filter:replies`
        })
        .catch((error) => {
          console.error('Error: %s', error.message)
          return []
        }),
      youtube
        .fetchMessages({
          liveChatId
        })
        .catch((error) => {
          console.error('Error: %s', error.message)
          return []
        })
    ])

    const comments = [...tweets, ...messages].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    )

    server.ws.send({
      type: 'custom',
      event: 'comments',
      data: comments
    })
  }, 10 * 1000)
}

if (require.main === module) {
  main()
}
