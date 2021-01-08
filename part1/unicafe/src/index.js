import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistic = (props) =>
//  <p> {props.text} {props.value} </p>
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = good / all

  if (all == 0)
    return <div>No feedback given</div>
  else
    return (
      /*
      <div>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={all} />
        <Statistic text="average" value={average} />
        <Statistic text="positive" value={String(positive * 100) + "%"} />
      </div>
      */
      <table>
        <Statistic text="good" value={good} />
        <Statistic text="neutral" value={neutral} />
        <Statistic text="bad" value={bad} />
        <Statistic text="all" value={all} />
        <Statistic text="average" value={average} />
        <Statistic text="positive" value={String(positive * 100) + "%"} />
      </table>
    )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const btnGood = <button onClick={()=>setGood(good+1)}>good</button>
  const btnNeutral = <button onClick={()=>setNeutral(neutral+1)}>neutral</button>
  const btnBad = <button onClick={()=>setBad(bad+1)}>bad</button>

  const statGood = <Statistic text="good" cnt={good} />
  return (
    <div>
      <h1>give feedback</h1>
      <p>{btnGood}{btnNeutral}{btnBad}</p>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)

