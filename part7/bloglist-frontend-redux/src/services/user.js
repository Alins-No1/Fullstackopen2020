import axios from 'axios'
const baseUrl = '/api'

const login = async credentials => {
  try {
    const response = await axios.post(`${baseUrl}/`, credentials)
    return response.data
  } catch (e) {
    return null
  }
}

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/users`)
  return response.data
}

export default { login, getAll }
