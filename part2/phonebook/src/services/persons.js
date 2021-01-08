import axios from 'axios'

const serverPort = 3001
const url = `http://localhost:${serverPort}/persons`

const read = () => axios.get(url)
const create = (newPerson) => axios.post(url, newPerson)
const update = (id, newPerson) => axios.put(`${url}/${id}`, newPerson)
const erase = (id) => axios.delete(`${url}/${id}`)

export default {
  read: read,
  create: create,
  update: update,
  erase: erase
}

