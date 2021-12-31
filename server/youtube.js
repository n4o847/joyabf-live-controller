require('dotenv').config()

const axios = require('axios').default

class YouTubeClient {
  constructor({ apiKey }) {
    this.apiKey = apiKey
  }

  async fetchLiveIdList({ channelId }) {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: `id`,
          channelId,
          eventType: `live`,
          type: `video`,
          key: this.apiKey
        }
      }
    )

    return data.items.map((item) => item.id.videoId)
  }

  async fetchChatIdList({ videoId }) {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: `liveStreamingDetails`,
          id: videoId,
          key: this.apiKey
        }
      }
    )

    return data.items.map((item) => item.liveStreamingDetails.activeLiveChatId)
  }

  async fetchMessages({ liveChatId }) {
    const { data } = await axios.get(
      `https://www.googleapis.com/youtube/v3/liveChat/messages`,
      {
        params: {
          liveChatId,
          part: `authorDetails,snippet`,
          hl: `ja`,
          maxResults: 10,
          key: this.apiKey
        }
      }
    )

    return data.items.map((item) => {
      return {
        service: `youtube`,
        id: item.id,
        userName: item.authorDetails.displayName,
        userId: item.authorDetails.channelId,
        userImage: item.authorDetails.profileImageUrl,
        text: item.snippet.displayMessage,
        createdAt: new Date(item.snippet.publishedAt)
      }
    })
  }
}

module.exports.YouTubeClient = YouTubeClient
