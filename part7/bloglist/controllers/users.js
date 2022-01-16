const usersRouter = require('express').Router()
const User = require('../models/user')
const os = require('os')
const bcrypt = require('bcrypt')

usersRouter.get('/users', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, author: 1 })
  await response.json(users)
})

usersRouter.get('/users/:id', async (request, response) => {
  const id = request.params.id

  const user = await User.findById(id).populate('blogs', { title: 1, url: 1, author: 1 })
  if (user)
    await response.status(200).json(user)
  else
    await response.status(404).end()
})

usersRouter.post('/users', async (request, response) => {
  const userMeta = request.body
  const saltRounds = 10
  userMeta.passwordHash = await bcrypt.hash(userMeta.password, saltRounds)

  try {
    const user = new User(userMeta)
    let newUser = await user.save()
    newUser = await newUser.populate('blogs', { title: 1, url: 1, author: 1 }).execPopulate()
    await response.status(201).json(newUser)
  } catch (e) {
    const errors = e.errors;
    var result = "";
    if (errors.username)
      result += errors.username.message + os.EOL
    if (errors.name)
      result += errors.name.message + os.EOL
    await response.status(400).json(result)
  }
})

module.exports = usersRouter
