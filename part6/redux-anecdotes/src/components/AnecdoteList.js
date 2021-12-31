import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { initialize, vote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const notification = useSelector(state => state.notification)
  const filterPattern = useSelector(state => state.filterPattern)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialize())
  }, [])

  
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification())
      }, notification.timeout)
      return () => clearTimeout(timer)
    }
  }, [ dispatch, notification ])

  const shownAnecdotes = anecdotes.filter(
    anecdote => anecdote.content.includes(filterPattern)
  )

  return (
    <div>
      {shownAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button
              onClick={
                () => {
                  dispatch(vote(anecdote.id))
                  dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
                  /*setTimeout(() => {
                    dispatch(clearNotification())
                  }, 5000)*/
                }
              }
            >vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
