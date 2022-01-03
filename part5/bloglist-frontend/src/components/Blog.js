import React, { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog, addLikeHandler, removeHandler }) => {
  const [ detailed, setDetailed ] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
          <button id='addLike' onClick={addLikeHandler}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          <button id='remove' onClick={removeHandler}>remove</button>
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

// For exercise 5.11
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikeHandler: PropTypes.func.isRequired,
  removeHandler: PropTypes.func.isRequired
}

export default Blog

