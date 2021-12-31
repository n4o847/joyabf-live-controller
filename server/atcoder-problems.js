const axios = require('axios').default

class AtCoderProblemsClient {
  async fetchSubmissions({ user, from }) {
    const { data } = await axios(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions`,
      {
        headers: {
          'Accept-Encoding': `gzip`
        },
        params: {
          user,
          from_second: Math.floor(from.getTime() / 1000)
        }
      }
    )

    return data
      .filter((submission) => submission.language === `Brainfuck (bf 20041219)`)
      .sort((a, b) => b.epoch_second - a.epoch_second)
  }
}

module.exports.AtCoderProblemsClient = AtCoderProblemsClient
