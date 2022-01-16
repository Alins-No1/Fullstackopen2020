import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { logout } from '../reducers/activeUserReducer'
import { clearOwnBlogs } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const NavigationBar = () => {
  const activeUser = useSelector(state => state.activeUser.user)
  const dispatch = useDispatch()

  const padding = {
    padding: 5
  }

  const handleLogout = event => {
    event.preventDefault()

    dispatch(setNotification(
      `${activeUser.name} logged out`,
      'success', 3
    ))
    dispatch(logout())
    dispatch(clearOwnBlogs())
    window.location = '/'
  }

  if (activeUser)
    return <div>
      <form onSubmit={handleLogout}>
        <Link to='/' style={padding}>blogs</Link>
        <Link to='/users' style={padding}>users</Link>
        {activeUser.name} logged in
        <Button variant='primary' type="submit">logout</Button>
      </form>
    </div>
  else
    return null
}

export default NavigationBar
