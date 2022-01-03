import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import Blog from './components/Blog'
import CreateNewBlogForm from './components/CreateNewBlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import userService from './services/user'

const Notification = ({ message, type }) =>
  message && message !== ' ' ?
    <div className={type}>
      {message}
    </div>
    : null

const LoginForm = (props) => (
  <div>
    <form onSubmit={props.loginHandler}>
      <div>
        username <input id='usernameValue' type="text" onChange={props.usernameChangeHandler} />
      </div>
      <div>
        password <input id='passwordValue' type="password" onChange={props.passwordChangeHandler} />
      </div>
      <div>
        <button id='loginButton' type="submit">login</button>
      </div>
    </form>
  </div>
)

const BlogsForm = (props) => {
  props.blogs.sort((first, second) => second.likes - first.likes)
  return (
    <div>
      <form onSubmit={props.logoutHandler}>
        <div>
          {props.name} logged in
          <button type="submit">logout</button>
        </div>
      </form>

      <h2>{props.createNewHeading}</h2>
      <Togglable buttonLabel='create new blog' ref={props.createNewRef}>
        <CreateNewBlogForm
          blogTitleChangeHandler={props.blogTitleChangeHandler}
          blogAuthorChangeHandler={props.blogAuthorChangeHandler}
          blogURLChangeHandler={props.blogURLChangeHandler}
          createNewBlogHandler={props.createNewBlogHandler}
        />
      </Togglable>

      {props.blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLikeHandler={props.addLikeHandler.bind(null, blog)}
          removeHandler={props.removeHandler.bind(null, blog)}
        />
      )}
    </div>
  )
}

const App = () => {
  const [ blogs, setBlogs ] = useState([])
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ activeUser, setActiveUser ] = useState(null)
  const [ newBlogTitle, setNewBlogTitle ] = useState('')
  const [ newBlogAuthor, setNewBlogAuthor ] = useState('')
  const [ newBlogURL, setNewBlogURL ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ notificationType, setNotificationType ] = useState('success')
  const createNewBlogFormRef = useRef()

  useEffect(() => {
    const activeUserRawData = window.localStorage.getItem('BlogListActiveUser')
    if (activeUserRawData)
      setActiveUser(JSON.parse(activeUserRawData))
  }, [])

  useEffect(() => {
    if (activeUser) {
      blogService.getOwn(activeUser.id).then(blogs =>
        setBlogs( blogs )
      )
    } else
      setBlogs([])
  }, [ activeUser, notificationMessage ])

  useEffect(() => {
    if (notificationMessage) {
      const timer = setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [ notificationMessage ])

  const handleLogin = async event => {
    event.preventDefault()

    const user = await userService.login({ username, password })
    if (user) {
      const currentActiveUser = {
        'id': user.id,
        'name': user.name,
        'token': `bearer ${user.token}`
      }
      window.localStorage.setItem('BlogListActiveUser', JSON.stringify(currentActiveUser))
      setActiveUser(currentActiveUser)
      setUsername('')
      setPassword('')
    } else {
      setNotificationMessage('wrong username or password')
      setNotificationType('error')
    }
  }

  const handleCreateNewBlog = async event => {
    event.preventDefault()

    if (activeUser) {
      var newBlog = {}
      if (newBlogTitle)
        newBlog['title'] = newBlogTitle
      if (newBlogAuthor)
        newBlog['author'] = newBlogAuthor
      if (newBlogURL)
        newBlog['url'] = newBlogURL

      const createdBlog = await blogService.createNew(newBlog, activeUser.token)
      if (createdBlog.error) {
        setNotificationMessage(createdBlog.error)
        setNotificationType('error')
      } else {
        setNotificationMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} added`)
        setNotificationType('success')
        createNewBlogFormRef.current.toggleVisibility()
      }
    } else {
      setNotificationMessage('not logged in')
      setNotificationType('error')
    }
  }

  const handleLike = async (blog, event) => {
    event.preventDefault()

    if (activeUser) {
      var newBlog = {
        'user': activeUser.id,
        'likes': blog.likes + 1,
        'title': blog.title,
        'author': blog.author,
        'url': blog.url
      }

      const updatedBlog = await blogService.addLike(blog.id, newBlog, activeUser.token)
      if (updatedBlog.error) {
        setNotificationMessage(updatedBlog.error)
        setNotificationType('error')
      } else
        setNotificationMessage(' ')
    } else {
      setNotificationMessage('not logged in')
      setNotificationType('error')
    }
  }

  const handleRemoveBlog = async (blog, event) => {
    event.preventDefault()

    if (activeUser)
      if (activeUser.id === blog.user.id) {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
          const removed = await blogService.remove(blog.id, activeUser.token)
          if (removed.error) {
            setNotificationMessage(removed.error)
            setNotificationType('error')
          } else
            setNotificationMessage(' ')
        }
      } else {
        setNotificationMessage('you have no access to this blog')
        setNotificationType('error')
      }
    else {
      setNotificationMessage('not logged in')
      setNotificationType('error')
    }
  }

  const handleLogout = event => {
    event.preventDefault()

    setNotificationMessage(`${activeUser.name} logged out`)
    setNotificationType('success')

    window.localStorage.removeItem('BlogListActiveUser')
    setActiveUser(null)
  }

  if (activeUser)
    return <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <BlogsForm
        name={activeUser.name}
        blogs={blogs}
        logoutHandler={handleLogout}
        createNewHeading="create new"
        createNewRef={createNewBlogFormRef}
        blogTitleChangeHandler={({ target }) => setNewBlogTitle(target.value)}
        blogAuthorChangeHandler={({ target }) => setNewBlogAuthor(target.value)}
        blogURLChangeHandler={({ target }) => setNewBlogURL(target.value)}
        createNewBlogHandler={handleCreateNewBlog}
        addLikeHandler={handleLike}
        removeHandler={handleRemoveBlog}
      />
    </div>
  else
    return <div>
      <h2>log in to application</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <LoginForm
        usernameChangeHandler={({ target }) => setUsername(target.value)}
        passwordChangeHandler={({ target }) => setPassword(target.value)}
        loginHandler={handleLogin}
      />
    </div>
}

export default App
