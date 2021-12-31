const express = require('express')
const app = express()
const configParams = require('./utils/config')
const cors = require('cors')

const mongoose = require('mongoose')
mongoose
  .connect(configParams.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.use(cors())
app.use(express.json())

const middleware = require('./utils/middleware')
app.use(middleware.tokenExtractor)

const blogsRouter = require('./controllers/blogs')
app.use('/api', middleware.userExtractor, blogsRouter)
const usersRouter = require('./controllers/users')
app.use('/api', usersRouter)
const loginRouter = require('./controllers/login')
app.use('/api', loginRouter)

module.exports = app
