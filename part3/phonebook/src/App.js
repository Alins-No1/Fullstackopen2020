import React, { useState, useEffect } from 'react'
import './App.css'
import personCRUD from './services/persons'

const Notification = ({ message, type }) =>
  message ? 
  <div className={type}>
    {message}
  </div>
  : null

const PersonForm = (props) =>
  <form onSubmit={props.addNew}>
    <div>
      name: <input id="nameBox" onChange={props.nameChangeHandler} />
    </div>
    <div>
      number: <input id="numberBox" onChange={props.numberChangeHandler} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
 
const ShownPersons = ({ shownPersons, deleteHandler }) =>
  <div>  
    {shownPersons.map(
      (person, id) => <p key={id}>
        {person.name} {person.number}
        <button onClick={deleteHandler(person)}>
          delete
        </button>
      </p>
    )}
  </div>
 
const Filter = ({ changeHandler }) =>
  <p>filter shown with <input onChange={changeHandler} /> </p>

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filterPattern, setFilterPattern ] = useState('')
  const [ notificationMessage, setNotificationMessage ] = useState(null)
  const [ notificationType, setNotificationType ] = useState('success')

  useEffect( () => {
      personCRUD
        .readAll()
        .then(response => {
          setPersons(response.data)
        })
  }, [])
  
  const addNew = (event) => {
    event.preventDefault()
    const savedPerson = persons.find(
      person => person.name === newName
    )
    if (savedPerson) {
      if (window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`)
      ) {
        personCRUD
          .update(savedPerson.id, newNumber)
          .then( () => {
            savedPerson.number = newNumber
            setNewName('')
            setNewNumber('')
          })
          .then( () => {
            document.getElementById('nameBox').value = ''
            document.getElementById('numberBox').value = ''
            setNotificationMessage(`Updated ${savedPerson.name}`)
            setNotificationType('success')
            setTimeout( () => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch(err => {
            if (err.response.status === 400)
              setNotificationMessage(err.response.data.error)
            else
              setNotificationMessage(`Information of ${savedPerson.name} has already been removed from server`)
            setNotificationType('error')
            setTimeout( () => {
              setNotificationMessage(null)
            }, 5000)
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      personCRUD
        .create(newPerson)
        .then(person => {
          newPerson.id = person.data.id
          setPersons(persons.concat(newPerson))
          setNewName('')
          setNewNumber('')
        })
        .then( () => {
          //alert(`${newPerson.name} is already added to phonebook`)
          document.getElementById('nameBox').value = ''
          document.getElementById('numberBox').value = ''
          setNotificationMessage(`Added ${newPerson.name}`)
          setNotificationType('success')
          setTimeout( () => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(err => {
          setNotificationMessage(err.response.data.error)
          setNotificationType('error')
          setTimeout( () => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterPatternChange = (event) => {
    setFilterPattern(event.target.value)
  }

  const deleteHandler = (person) => () => {
    const name = person.name
    const confirmed = window.confirm(`Delete ${name} ?`)
    if (confirmed) {
      personCRUD
        .erase(person.id)
        .then( () => {
          setPersons(persons.filter(
            (p) => p !== person
          ))
        })
        .then( () => {
          setNotificationMessage(`Deleted ${name}`)
          setNotificationType('success')
          setTimeout( () => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  var shownPersons =
    filterPattern === ''
    ? persons
    : persons.filter(
        person => person.name.indexOf(filterPattern) >= 0
    )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} type={notificationType} />
      <Filter changeHandler={handleFilterPatternChange} />
      <h3>add a new</h3>
      <PersonForm nameChangeHandler={handleNameChange} numberChangeHandler={handleNumberChange} addNew={addNew} />
      <h2>Numbers</h2>
      <ShownPersons shownPersons={shownPersons} deleteHandler={deleteHandler} />
    </div>
  )
}

export default App

