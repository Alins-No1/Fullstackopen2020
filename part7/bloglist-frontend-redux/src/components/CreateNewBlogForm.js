import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useField } from '../hooks'
import { createNew } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/notificationReducer'

const CreateNewBlogForm = () => {
  const activeUser = useSelector(state => state.activeUser.user)
  const blogsSuccess = useSelector(state => state.blogs.success)
  const blogsError = useSelector(state => state.blogs.error)
  const dispatch = useDispatch()

  const [ visible, setVisible ] = useState(false)
  const newBlogTitle = useField('text', 'titleValue')
  const newBlogAuthor = useField('text', 'authorValue')
  const newBlogURL = useField('text', 'urlValue')

  useEffect(() => {
    if (blogsError)
      dispatch(setNotification(blogsError, 'error', 3))
    else if (blogsSuccess) {
      dispatch(setNotification(blogsSuccess, 'success', 3))
      newBlogTitle.onReset()
      newBlogAuthor.onReset()
      newBlogURL.onReset()
      setVisible(false)
    }
  }, [ blogsSuccess, blogsError ])

  const handleCreateNewBlog = async event => {
    event.preventDefault()

    if (activeUser) {
      var newBlogMeta = {}
      if (newBlogTitle.value)
        newBlogMeta['title'] = newBlogTitle.value
      if (newBlogAuthor.value)
        newBlogMeta['author'] = newBlogAuthor.value
      if (newBlogURL.value)
        newBlogMeta['url'] = newBlogURL.value

      dispatch(createNew(newBlogMeta, activeUser.token))
    } else
      dispatch(setNotification('not logged in', 'error', 3))
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button id='buttonOfTogglable' onClick={() => setVisible(true)}>create new blog</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleCreateNewBlog}>
          <div>
            title:<input {...newBlogTitle} />
          </div>
          <div>
            author:<input {...newBlogAuthor} />
          </div>
          <div>
            url:<input {...newBlogURL} />
          </div>
          <div>
            <button id='createNewBlogButton' type='submit'>create</button>
            <button id='cancelButtonOfTogglable' type='button' onClick={() => setVisible(false)}>cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateNewBlogForm
