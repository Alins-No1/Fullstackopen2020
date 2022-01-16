import React, { useEffect } from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import LoginForm from './components/LoginForm'
import BlogsForm from './components/BlogsForm'
import UsersForm from './components/UsersForm'
import SingleBlog from './components/SingleBlog'
import SingleUser from './components/SingleUser'
import NavigationBar from './components/NavigationBar'
import { recoverActiveUser, clearActiveUserMessage } from './reducers/activeUserReducer'
import { initializeBlogs, setOwnBlogs, clearOwnBlogs, clearBlogsMessage } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'
import { clearNotification } from './reducers/notificationReducer'

const App = () => {
  const activeUser = useSelector(state => state.activeUser.user)
  const notification = useSelector(state => state.notification)
  const allUsers = useSelector(state => state.users)
  const allBlogs = useSelector(state => state.blogs.blogs)
  const ownBlogs = useSelector(state => state.blogs.ownBlogs)
  const dispatch = useDispatch()

  const matchUserId = useRouteMatch('/users/:id')
  const userToShow = matchUserId ? allUsers.find(user => user.id === matchUserId.params.id) : null
  const matchBlogId = useRouteMatch('/blogs/:id')
  const blogToShow = matchBlogId ? allBlogs.find(blog => blog.id === matchBlogId.params.id) : null

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeBlogs())
    dispatch(recoverActiveUser())
  }, [])

  useEffect(() => {
    if (activeUser)
      dispatch(setOwnBlogs(activeUser.id))
    else
      dispatch(clearOwnBlogs())
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
    return <div>
      <NavigationBar />
      <h2>blog app</h2>

      <Switch>
        <Route path="/users/:id">
          <SingleUser user={userToShow} />
        </Route>
        <Route path="/users">
          <UsersForm />
        </Route>
        <Route path="/blogs/:id">
          <SingleBlog blog={blogToShow} />
        </Route>
        <Route path="/">
          <BlogsForm blogs={ownBlogs} />
        </Route>
      </Switch>
    </div>
  else
    return <LoginForm />
}

export default App
