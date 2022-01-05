import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { like, remove } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog }) => {
  const activeUser = useSelector(state => state.activeUser.user)
  const blogsSuccess = useSelector(state => state.blogs.success)
  const blogsError = useSelector(state => state.blogs.error)
  const dispatch = useDispatch()

  const [ detailed, setDetailed ] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  useEffect(() => {
    if (blogsError)
      dispatch(setNotification(blogsError, 'error', 3))
    else if (blogsSuccess)
      dispatch(setNotification(blogsSuccess, 'success', 3))
  }, [ blogsSuccess, blogsError ])

  const handleLike = async event => {
    event.preventDefault()

    if (activeUser)
      dispatch(like(blog, activeUser.token))
    else
      dispatch(setNotification('not logged in', 'error', 3))
  }

  const handleRemoveBlog = async event => {
    event.preventDefault()

    if (activeUser)
      if (activeUser.id === blog.user.id) {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
          dispatch(remove(blog, activeUser.token))
      } else
        dispatch(setNotification('you have no access to this blog', 'error', 3))
    else
      dispatch(setNotification('not logged in', 'error', 3))
  }

  if (detailed)
    return (
      <div className='detailedBlog' style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button id='hide' onClick={() => setDetailed(false)}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button id='addLike' onClick={handleLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          <button id='remove' onClick={handleRemoveBlog}>remove</button>
        </div>
      </div>
    )
  else
    return (
      <div className='undetailedBlog' style={blogStyle}>
        <div>
          {blog.title} {blog.author}
          <button id='view' onClick={() => setDetailed(true)}>view</button>
        </div>
      </div>
    )
}

export default Blog
