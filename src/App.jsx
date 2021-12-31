import { useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadSnowPreset } from 'tsparticles-preset-snow'
import './App.css'
import { formatTime, parseSecond } from './utils'

function App() {
  const [submissions, setSubmissions] = useState(() =>
    JSON.parse(sessionStorage.getItem('submissions') ?? `[]`)
  )
  const [comments, setComments] = useState(() =>
    JSON.parse(sessionStorage.getItem('comments') ?? `[]`)
  )

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('submissions', (submissions) => {
        console.log(`submissions updated`, submissions)
        sessionStorage.setItem('submissions', JSON.stringify(submissions))
        setSubmissions(submissions)
      })

      import.meta.hot.on('comments', (comments) => {
        console.log(`comments updated`, comments)
        sessionStorage.setItem('comments', JSON.stringify(comments))
        setComments(comments)
      })
    }
  }, [])

  const count = new Set(
    submissions
      .filter((submission) => submission.result === 'AC')
      .map((submission) => submission.problem_id)
  ).size

  return (
    <div className="app">
      <Particles
        className="particles"
        canvasClassName="particles-canvas"
        init={loadSnowPreset}
        options={{
          preset: 'snow',
          fullScreen: false
        }}
      />
      <div className="container">
        <div className="screen"></div>
        <div className="side">
          <div className="header">
            <span className="header-title">#除夜bf</span>
            <span className="header-description">除夜の鐘 Brainfuck 108問</span>
          </div>
          <div className="status">
            <div className="status-header">ただいま</div>
            <div className="status-main">
              <span className="status-count">{count}</span>
              <span className="status-suffix">問</span>
            </div>
          </div>
          <div className="submissions">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission">
                <span className="submission-datetime">
                  {formatTime(parseSecond(submission.epoch_second))}
                </span>
                <br />
                <span className="submission-problem-id">
                  {submission.problem_id}
                </span>
                <br />
                <span className="submission-result">
                  <span
                    className="result-badge"
                    data-result={submission.result}
                  >
                    {submission.result}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="footer">
          <div className="comments">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="comment"
                data-service={comment.service}
              >
                <img src={comment.userImage} />
                {comment.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
