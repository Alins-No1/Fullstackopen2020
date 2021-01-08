const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

if (process.env.NODE_ENV === 'development')
  require('dotenv').config()

console.log('connecting to MongoDB')
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(err => {
    console.log('error connecting to MongoDB: ', err)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  number: {
    type: String,
    required: true,
    validate: [
      s => {
        const digits = s.match(/[0-9]/g)
        return digits && digits.length >= 8
      },
      `Path \`{PATH}\` (\`{VALUE}\`) contains less than 8 digits`
    ]
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})
personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)

