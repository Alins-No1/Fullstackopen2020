import React from 'react'
// For Exercise 6.20, use the following

import { connect } from 'react-redux'
import { updateFilterPattern } from '../reducers/filterReducer'

const Filter = (props) => {
  const handleChange = (event) => {
    event.preventDefault()
    props.updateFilterPattern(event.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default connect(
  null,
  { updateFilterPattern }
)(Filter)

// In other cases, use the following
/*
import { useDispatch } from 'react-redux'
import { updateFilterPattern } from '../reducers/filterReducer'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    event.preventDefault()
    dispatch(updateFilterPattern(event.target.value))
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
*/
