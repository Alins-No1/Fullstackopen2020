const configParams = require('../utils/config')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('express-async-errors')

loginRouter.post('/', async (request, response) => {
  const userMeta = request.body
  const user = await User.findOne({ username: userMeta.username })
  if (user) {
    const verified = await bcrypt.compare(userMeta.password, user.passwordHash)
    if (verified) {
      const token = await jwt.sign({
        username: user.username,
        name: user.name,
        id: user._id
      }, configParams.SECRET)
      await response.status(200).send({
        id: user._id,
        name: user.name,
        token: token
      })
    } else
      await response.status(401).json({ error: 'Incorrect password' })
  } else
    await response.status(401).json({ error: `User ${userMeta.username} does not exist` })
})

module.exports = loginRouter
