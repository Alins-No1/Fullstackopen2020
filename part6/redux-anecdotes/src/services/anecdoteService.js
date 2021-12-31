import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const find = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const createNew = async (content) => {
  const response = await axios.post(baseUrl, {
    "content": content,
    "votes": 0
  })
  return response.data
}

const update = async (id, record) => {
  const response = await axios.put(`${baseUrl}/${id}`, record)
  return response.data
}

export default { getAll, find, createNew, update }
