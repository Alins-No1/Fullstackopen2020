const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./lib/models/person')

const app = express()

morgan.token('data', (req, res) => 
  req.method === 'POST' ? JSON.stringify({
    'name': req.body.name,
    'number': req.body.number
  }) : ''
)

app.use(cors())
app.use(express.static('build'))
app.use(['/api/persons', '/api/persons/:id'], express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/info', (req, res, next) => {
  Person
    .count({})
    .then(cnt => {
      res
        .status(200)
        .send(`<p>Phonebook has info for ${cnt} people</p> \
           <p>${new Date()}</p>`)
        .end()
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.status(200).json(persons)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findById(id)
    .then(person => {
      if (person)
        res.status(200).json(person)
      else
        res.status(404).send(`Person with id ${id} not found`).end()
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findByIdAndRemove(id)
    .then(result => {
      res.status(204).send(`Person with id ${id} has been deleted`).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const newNumber = req.body.number
  if (!newNumber)
    res.status(400).json({ error: 'number required' })
  else
    Person
      .findByIdAndUpdate(id, { number: newNumber }, { new: true, runValidators: true })
      .then(result => {
        console.log(newNumber)
        res.status(201).send(`Person with id ${id} has been updated`).end()
      })
      .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const newPerson = req.body
  const newName = newPerson.name
  const newNumber = newPerson.number

  if (!newName)
    res.status(400).json({ error: 'name required' })
  else if (!newNumber)
    res.status(400).json({ error: 'number required' })
  else
    Person
      .create({
        name: newName,
        number: newNumber
      })
      .then(person => {
        res.status(201).json(person)
      })
      .catch(err => next(err))
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError')
    return res.status(400).json({ error: 'malformatted id' })
  else if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message })

  next(err)
}
app.use(errorHandler)

if (process.env.NODE_ENV === 'development')
  require('dotenv').config()

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

