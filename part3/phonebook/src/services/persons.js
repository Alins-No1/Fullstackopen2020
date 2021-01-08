import axios from 'axios'

var baseUrl
if (process.env.NODE_ENV === 'development') {
	const serverPort = 3101
	baseUrl = `http://localhost:${serverPort}`
} else
	baseUrl = ''
const API = `${baseUrl}/api/persons`
const generalInfoUrl = `${baseUrl}/info`

const services = {
	readAll: () => axios.get(API),
	readGeneralInfo: () => axios.get(generalInfoUrl),
	readItem: (id) => axios.get(`${API}/${id}`),
	create: (newPerson) => axios.post(API, newPerson),
	update: (id, number) => axios.put(`${API}/${id}`, {number: number}),
	erase: (id) => axios.delete(`${API}/${id}`)
}

export default services

