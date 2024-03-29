import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useField } from '../hooks'
import { login } from '../reducers/activeUserReducer'
import { setOwnBlogs } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import Notification from './Notification'

const LoginForm = () => {
  const activeUser = useSelector(state => state.activeUser.user)
  const activeUserError = useSelector(state => state.activeUser.error)
  const dispatch = useDispatch()

  const username = useField('text', 'usernameValue')
  const password = useField('password', 'passwordValue')

  useEffect(() => {
    if (activeUserError)
      dispatch(setNotification(activeUserError, 'danger', 3))
    else if (activeUser) {
      username.onReset()
      password.onReset()
      dispatch(setOwnBlogs(activeUser.id))
    }
  }, [ activeUser, activeUserError ])

  const handleLogin = async event => {
    event.preventDefault()

    await dispatch(login(username.value, password.value))
  }

  return (
    <div>
      <h2>log in to application</h2>
      <Notification />
      <form onSubmit={handleLogin}>
        <div>
          username <input {...username} />
        </div>
        <div>
          password <input {...password} />
        </div>
        <div>
          <Button id='loginButton' variant='primary' type='submit'>login</Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
