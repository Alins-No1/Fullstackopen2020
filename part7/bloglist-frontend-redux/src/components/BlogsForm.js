import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import CreateNewBlogForm from './CreateNewBlogForm'
import Notification from './Notification'

const BlogsForm = ({ blogs }) => {
  const activeUser = useSelector(state => state.activeUser.user)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (activeUser)
    return (
      <div>
        <Notification />
        <CreateNewBlogForm />
        {blogs.map(blog => <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </div>)}
      </div>
    )
  else
    dispatch(setNotification('not logged in', 'danger', 3))
}

export default BlogsForm
