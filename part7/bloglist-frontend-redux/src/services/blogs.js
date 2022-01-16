import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOwn = async userId => {
  const response = await axios.get(baseUrl)
  return response.data.filter(blog => blog.user.id === userId)
}

const createNew = async (newBlog, token) => {
  try {
    const response = await axios.post(
      baseUrl,
      newBlog,
      {
        'headers': { 'Authorization': token }
      }
    )
    return response.data
  } catch (e) {
    if (e.response)
      if (e.response.status === 400)
        return { 'error': 'both title and url were empty' }
      else
        return { 'error': e.response.data.error }
    else
      return { 'error': 'unknown error' }
  }
}

const addLike = async (blogId, newBlog, token) => {
  try {
    const response = await axios.put(
      `${baseUrl}/${blogId}`,
      newBlog,
      {
        'headers': { 'Authorization': token }
      }
    )
    return response.data
  } catch (e) {
    if (e.response)
      if (e.response.status === 404)
        return { 'error': `blog id ${blogId} not found` }
      else if (e.response.status === 500)
        return { 'error': 'unknown internal server error' }
      else
        return { 'error': e.response.data.error }
    else
      return { 'error': 'unknown error' }
  }
}

const addComment = async (blogId, commentText) => {
  try {
    const response = await axios.post(
      `${baseUrl}/${blogId}/comments`,
      {
        'text': commentText
      }
    )
    return response.data
  } catch (e) {
    if (e.response)
      if (e.response.status === 404)
        return { 'error': `blog id ${blogId} not found` }
      else if (e.response.status === 500)
        return { 'error': 'unknown internal server error' }
      else
        return { 'error': e.response.data.error }
    else
      return { 'error': 'unknown error' }
  }
}

const remove = async (blogId, token) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/${blogId}`,
      {
        'headers': { 'Authorization': token }
      }
    )
    return response.data
  } catch (e) {
    if (e.response)
      if (e.response.status === 500)
        return { 'error': 'unknown internal server error' }
      else
        return { 'error': e.response.data.error }
    else
      return { 'error': 'unknown error' }
  }
}

export default { getAll, getOwn, createNew, addLike, addComment, remove }
