const configParams = require('../utils/config')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer '))
    req.token = authorization.substring(7)
  else
    req.token = null
  
  next()
}

const userExtractor = async (req, res, next) => {
  if (req.token) {
    try {
      const decodedToken = await jwt.verify(req.token, configParams.SECRET)
      if (decodedToken.id)
        req.user = await User.findById(decodedToken.id)
      else
        req.user = null
    } catch (e) {
      req.user = null
    }
  } else
    req.user = null

  next()
}

module.exports = {
  tokenExtractor,
  userExtractor
}

