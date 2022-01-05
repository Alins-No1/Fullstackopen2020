import blogService from '../services/blogs'

const emptyState = {
  'blogs': [],
  'success': '',
  'error': ''
}

const reducer = (state = emptyState, action) => {
  const sortByLikes = blogs => {
    blogs.sort((first, second) => second.likes - first.likes)
    return blogs
  }

  switch(action.type) {
  case 'INIT_BLOGS':
    return {
      'blogs': sortByLikes(action.blogs),
      'success': '',
      'error': ''
    }
  case 'CREATE_A_BLOG':
    return {
      'blogs': sortByLikes([...state.blogs, action.blog]),
      'success': `a new blog ${action.blog.title} by ${action.blog.author} added`,
      'error': ''
    }
  case 'LIKE_A_BLOG':
    return {
      'blogs': sortByLikes(
        state.blogs.map(blog =>
          blog.id === action.id ? { ...blog, likes: blog.likes + 1 } : blog
        )
      ),
      'success': '',
      'error': ''
    }
  case 'REMOVE_A_BLOG':
    return {
      'blogs': state.blogs.filter(blog => blog.id !== action.id),
      'success': '',
      'error': ''
    }
  case 'CLEAR_BLOGS':
    return emptyState
  case 'BLOGS_ERROR':
    return {
      'blogs': state.blogs,
      'success': '',
      'error': action.error
    }
  case 'CLEAR_BLOGS_MESSAGE':
    return {
      'blogs': state.blogs,
      'success': '',
      'error': ''
    }
  default: return state
  }
}

export const initialize = (userId) => {
  return async (dispatch) => {
    const blogs = await blogService.getOwn(userId)
    dispatch({
      'type': 'INIT_BLOGS',
      'blogs': blogs
    })
  }
}

export const createNew = (newBlogMeta, token) => {
  return async (dispatch) => {
    const createdBlog = await blogService.createNew(newBlogMeta, token)
    if (createdBlog.error)
      dispatch({
        'type': 'BLOGS_ERROR',
        'error': createdBlog.error
      })
    else
      dispatch({
        'type': 'CREATE_A_BLOG',
        'blog': createdBlog
      })
  }
}

export const like = (blog, token) => {
  return async (dispatch) => {
    const id = blog.id
    const updatedBlog = await blogService.addLike(id, { ...blog, likes: blog.likes + 1 }, token)
    if (updatedBlog.error)
      dispatch({
        'type': 'BLOGS_ERROR',
        'error': updatedBlog.error
      })
    else
      dispatch({
        'type': 'LIKE_A_BLOG',
        'id': updatedBlog.id
      })
  }
}

export const remove = (blog, token) => {
  return async (dispatch) => {
    const id = blog.id
    const removed = await blogService.remove(id, token)
    if (removed.error)
      dispatch({
        'type': 'BLOGS_ERROR',
        'error': removed.error
      })
    else
      dispatch({
        'type': 'REMOVE_A_BLOG',
        'id': id
      })
  }
}

export const clearBlogs = () => {
  return {
    'type': 'CLEAR_BLOGS'
  }
}

export const clearBlogsMessage = () => {
  return {
    'type': 'CLEAR_BLOGS_MESSAGE'
  }
}

export default reducer
