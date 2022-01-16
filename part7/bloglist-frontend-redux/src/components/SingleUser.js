import React from 'react'

const BlogsView = ({ blogs }) => {
  return <ul>
    {blogs.map(blog => <li key={blog.id}>{blog.title}</li>)}
  </ul>
}

const SingleUser = ({ user }) => {
  if (user)
    return <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <BlogsView blogs={user.blogs} />
    </div>
  else
    return null
}

export default SingleUser
