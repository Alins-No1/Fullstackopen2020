import React, { useEffect } from 'react'
// For Exercise 6.20, use the following

import { connect } from 'react-redux'
import { createNew } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  useEffect(() => {
    if (props.notification.message) {
      const timer = setTimeout(() => {
        props.clearNotification()
      }, props.notification.timeout)
      return () => clearTimeout(timer)
    }
  }, [ props.notification ])

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={
        event => {
          event.preventDefault()
          const content = event.target.anecdoteContent.value
          props.createNew(content)
          props.setNotification(`new anecdote '${content}'`, 5)
          event.target.reset()
          //setTimeout(() => {
          //  dispatch(clearNotification())
          //}, 5000)
        }
      }>
        <div><input name="anecdoteContent"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default connect(
  (state) => {
    return {
      notification: state.notification
    }
  },
  { createNew, setNotification, clearNotification }
)(AnecdoteForm)

// In other cases, use the following
/*
import { useSelector, useDispatch } from 'react-redux'
import { createNew } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification())
      }, notification.timeout)
      return () => clearTimeout(timer)
    }
  }, [ dispatch, notification ])

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={
        event => {
          event.preventDefault()
          const content = event.target.anecdoteContent.value
          dispatch(createNew(content))
          dispatch(setNotification(`new anecdote '${content}'`, 5))
          event.target.reset()
          //setTimeout(() => {
          //  dispatch(clearNotification())
          //}, 5000)
        }
      }>
        <div><input name="anecdoteContent"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
*/
