require('dotenv').config()

const axios = require('axios').default

class TwitterClient {
  constructor({ bearerToken }) {
    this.bearerToken = bearerToken
  }

  async fetchTweets({ q }) {
    const { data } = await axios(
      `https://api.twitter.com/1.1/search/tweets.json`,
      {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`
        },
        params: {
          q,
          result_type: `recent`,
          count: 10
        }
      }
    )

    return data.statuses.map((tweet) => {
      const chars = Array.from(tweet.text)

      const entities = Object.values(tweet.entities).flat()

      for (const entity of entities) {
        const [from, to] = entity.indices
        for (let index = from; index < to; index++) {
          chars[index] = ''
        }
      }

      const text = chars.join('').replace(/\s+/g, ' ').trim()

      return {
        service: `twitter`,
        id: tweet.id_str,
        userName: tweet.user.name,
        userId: tweet.user.screen_name,
        userImage: tweet.user.profile_image_url_https,
        text,
        createdAt: new Date(tweet.created_at)
      }
    })
  }
}

module.exports.TwitterClient = TwitterClient
