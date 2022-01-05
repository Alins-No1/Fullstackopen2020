import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/activeUserReducer'
import { clearBlogs } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import Blog from './Blog'
import CreateNewBlogForm from './CreateNewBlogForm'
import Notification from './Notification'

const BlogsForm = () => {
  const activeUser = useSelector(state => state.activeUser.user)
  const blogs = useSelector(state => state.blogs.blogs)
  const dispatch = useDispatch()

  const handleLogout = event => {
    event.preventDefault()

    dispatch(setNotification(
      `${activeUser.name} logged out`,
      'success', 3
    ))
    dispatch(logout())
    dispatch(clearBlogs())
  }

  if (activeUser)
    return (
      <div>
        <h2>Blogs</h2>
        <Notification />
        <form onSubmit={handleLogout}>
          <div>
            {activeUser.name} logged in
            <button type='submit'>logout</button>
          </div>
        </form>

        <h2>create new</h2>
        <CreateNewBlogForm />

        {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
      </div>
    )
  else
    dispatch(setNotification('not logged in', 'error', 3))
}

export default BlogsForm
