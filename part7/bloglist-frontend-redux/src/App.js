import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import LoginForm from './components/LoginForm'
import BlogsForm from './components/BlogsForm'
import { recoverActiveUser, clearActiveUserMessage } from './reducers/activeUserReducer'
import { initialize, clearBlogs, clearBlogsMessage } from './reducers/blogsReducer'
import { clearNotification } from './reducers/notificationReducer'

const App = () => {
  const activeUser = useSelector(state => state.activeUser.user)
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(recoverActiveUser())
  }, [])

  useEffect(async () => {
    if (activeUser)
      await dispatch(initialize(activeUser.id))
    else
      dispatch(clearBlogs())
  }, [ activeUser ])

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        dispatch(clearNotification())
        dispatch(clearActiveUserMessage())
        dispatch(clearBlogsMessage())
      }, notification.timeout)
      return () => clearTimeout(timer)
    }
  }, [ notification ])

  if (activeUser)
    return <BlogsForm />
  else
    return <LoginForm />
}

export default App
