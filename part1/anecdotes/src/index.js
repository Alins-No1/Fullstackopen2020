import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const len = props.anecdotes.length
  const [votes, setVotes] = useState(Array(len).fill(0))
    
  const findMostVotes = () => {
    let i = 0
    votes.forEach((val, id) => {
      if (val > votes[i]) i = id
    })
    return (
      <div>
        <p>{props.anecdotes[i]}</p>
        <p>has {votes[i]} {votes[i] > 1 ? 'votes' : 'vote'}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{props.anecdotes[selected]}</p>
      <p>has {votes[selected]} {votes[selected] > 1 ? 'votes' : 'vote'}</p>
      <button onClick={() => {
        const copy = [...votes]
        copy[selected]++
        setVotes(copy)
      }}>vote</button>
      <button onClick={
        () => setSelected(Math.floor(Math.random() * len))
      }>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      {findMostVotes()}
   </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)

