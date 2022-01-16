import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { useField } from '../hooks'
import { like, remove, addComment } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'
import Notification from './Notification'

const SingleBlog = ({ blog }) => {
  if (!blog)
    return null

  const activeUser = useSelector(state => state.activeUser.user)
  const blogsSuccess = useSelector(state => state.blogs.success)
  const blogsError = useSelector(state => state.blogs.error)
  const dispatch = useDispatch()

  const blogComment = useField('text', 'blogCommentValue')

  useEffect(() => {
    if (blogsError)
      dispatch(setNotification(blogsError, 'danger', 3))
    else if (blogsSuccess)
      dispatch(setNotification(blogsSuccess, 'success', 3))
  }, [ blogsSuccess, blogsError ])

  const handleLike = async event => {
    event.preventDefault()

    if (activeUser)
      dispatch(like(activeUser.id, blog, activeUser.token))
    else
      dispatch(setNotification('not logged in', 'danger', 3))
  }

  const handleRemoveBlog = async event => {
    event.preventDefault()

    if (activeUser)
      if (activeUser.id === blog.user.id) {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`))
          dispatch(remove(activeUser.id, blog, activeUser.token))
      } else
        dispatch(setNotification('you have no access to this blog', 'danger', 3))
    else
      dispatch(setNotification('not logged in', 'danger', 3))
  }

  const handleAddComment = async event => {
    event.preventDefault()

    blogComment.onReset()
    if (activeUser)
      dispatch(addComment(activeUser.id, blog, blogComment.value))
    else
      dispatch(addComment('', blog, blogComment.value))
  }

  return (
    <div>
      <Notification />
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} {blog.likes > 1 ? 'likes' : 'like'}
        <Button id='addLike' variant='primary' onClick={handleLike}>like</Button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      <div>
        <Button id='remove' variant='primary' onClick={handleRemoveBlog}>remove</Button>
      </div>
      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input {...blogComment} />
        <Button variant='primary' type="submit">add comment</Button>
      </form>
      <ul>
        {blog.comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
    </div>
  )
}

export default SingleBlog
