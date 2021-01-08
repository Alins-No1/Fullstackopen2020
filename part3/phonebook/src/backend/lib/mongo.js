const mongoose = require('mongoose')

function main(url, Person) {
  console.log('connecting to MongoDB')
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(result => {
      console.log('connected to MongoDB')
      if (process.argv.length > 4) {
        const newName = process.argv[3]
        const newNumber = process.argv[4]
  
        Person
          .create([{
            name: newName,
            number: newNumber
          }])
          .then(result => {
            console.log(`added ${newName} number ${newNumber} to phonebook`)
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            mongoose.connection.close()
          })
      } else {
        console.log('phonebook:')
        Person
          .find({})
          .then(result => {
            result.forEach(person => {
              console.log(person.name, person.number)
            })
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => {
            mongoose.connection.close()
          })
      }
    })
    .catch(err => {
      console.log('error connecting to MongoDB') 
      console.log(err)
    })
}

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument" node mongo.js <password>')
  process.exit(1)
}

const pswd = process.argv[2]
const dbUrl = `mongodb+srv://fullstack0:${pswd}@cluster0.kose3.mongodb.net/<dbname>?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

main(dbUrl, mongoose.model('Person', personSchema))

