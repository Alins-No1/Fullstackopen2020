if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == 'test')
  require('dotenv').config()

const PORT = 3003
const PASSWORD = process.env.PASSWORD || process.argv[2]
const MONGODB_URI = `mongodb+srv://fullstack0:${PASSWORD}@cluster0.kose3.mongodb.net/test?retryWrites=true&w=majority`
const SECRET = process.env.SECRET || process.argv[3]

module.exports = {
    PORT,
    MONGODB_URI,
    SECRET
}
