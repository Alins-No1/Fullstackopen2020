import blogService from '../services/blogs'

const emptyState = {
  'blogs': [],
  'ownBlogs': [],
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
      'ownBlogs': state.ownBlogs,
      'success': '',
      'error': ''
    }
  case 'SET_OWN_BLOGS':
    return {
      'blogs': state.blogs,
      'ownBlogs': sortByLikes(action.ownBlogs),
      'success': '',
      'error': ''
    }
  case 'CREATE_A_BLOG':
    return {
      'blogs': sortByLikes([...state.blogs, action.blog]),
      'ownBlogs': action.isOwnBlog ? sortByLikes([...state.ownBlogs, action.blog]) : state.ownBlogs,
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
      'ownBlogs': action.isOwnBlog ? sortByLikes(
        state.ownBlogs.map(blog =>
          blog.id === action.id ? { ...blog, likes: blog.likes + 1 } : blog
        )
      ) : state.ownBlogs,
      'success': '',
      'error': ''
    }
  case 'REMOVE_A_BLOG':
    return {
      'blogs': state.blogs.filter(blog => blog.id !== action.id),
      'ownBlogs': action.isOwnBlog ? state.ownBlogs.filter(blog => blog.id !== action.id) : state.ownBlogs,
      'success': '',
      'error': ''
    }
  case 'ADD_COMMENT':
    return {
      'blogs': sortByLikes(
        state.blogs.map(blog =>
          blog.id === action.id ? action.updatedBlog : blog
        )
      ),
      'ownBlogs': action.isOwnBlog ? sortByLikes(
        state.ownBlogs.map(blog =>
          blog.id === action.id ? action.updatedBlog : blog
        )
      ) : state.ownBlogs,
      'success': `a new comment ${action.comment} added`,
      'error': ''
    }
  case 'CLEAR_BLOGS':
    return emptyState
  case 'CLEAR_OWN_BLOGS':
    return {
      'blogs': state.blogs,
      'ownBlogs': [],
      'success': '',
      'error': ''
    }
  case 'BLOGS_ERROR':
    return {
      'blogs': state.blogs,
      'ownBlogs': state.ownBlogs,
      'success': '',
      'error': action.error
    }
  case 'CLEAR_BLOGS_MESSAGE':
    return {
      'blogs': state.blogs,
      'ownBlogs': state.ownBlogs,
      'success': '',
      'error': ''
    }
  default: return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch({
      'type': 'INIT_BLOGS',
      'blogs': blogs
    })
  }
}

export const setOwnBlogs = (userId) => {
  return async (dispatch) => {
    const ownBlogs = await blogService.getOwn(userId)
    dispatch({
      'type': 'SET_OWN_BLOGS',
      'ownBlogs': ownBlogs
    })
  }
}

export const createNew = (userId, newBlogMeta, token) => {
  return async (dispatch) => {
    const createdBlog = await blogService.createNew(newBlogMeta, token)
    if (createdBlog.error)
      dispatch({
        'type': 'BLOGS_ERROR',
        'error': createdBlog.error
      })
    else {
      createdBlog.comments = []
      dispatch({
        'type': 'CREATE_A_BLOG',
        'blog': createdBlog,
        'isOwnBlog': createdBlog.user.id === userId
      })
    }
  }
}

export const like = (userId, blog, token) => {
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
        'id': updatedBlog.id,
        'isOwnBlog': updatedBlog.user.id === userId
      })
  }
}

export const remove = (userId, blog, token) => {
  return async (dispatch) => {
    const id = blog.id
    const isOwnBlog = blog.user.id === userId
    const removed = await blogService.remove(id, token)
    if (removed.error)
      dispatch({
        'type': 'BLOGS_ERROR',
        'error': removed.error
      })
    else
      dispatch({
        'type': 'REMOVE_A_BLOG',
        'id': id,
        'isOwnBlog': isOwnBlog
      })
  }
}

export const addComment = (userId, blog, comment) => {
  return async (dispatch) => {
    const id = blog.id
    const updatedBlog = await blogService.addComment(id, comment)
    if (updatedBlog.error)
      dispatch({
        'type': 'BLOGS_ERROR',
        'error': updatedBlog.error
      })
    else
      dispatch({
        'type': 'ADD_COMMENT',
        'id': id,
        'comment': comment,
        'updatedBlog': updatedBlog,
        'isOwnBlog': updatedBlog.user.id === userId
      })
  }
}

export const clearBlogs = () => {
  return {
    'type': 'CLEAR_BLOGS'
  }
}

export const clearOwnBlogs = () => {
  return {
    'type': 'CLEAR_OWN_BLOGS'
  }
}

export const clearBlogsMessage = () => {
  return {
    'type': 'CLEAR_BLOGS_MESSAGE'
  }
}

export default reducer
