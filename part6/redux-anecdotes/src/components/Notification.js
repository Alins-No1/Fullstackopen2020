import React from 'react'
// For Exercise 6.19, use the following

import { connect } from 'react-redux'

const Notification = (props) => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
 
  return (
    props.notificationMessage && props.notificationMessage != ' ' ?
      <div style={style}>
        {props.notificationMessage}
      </div>
    : null
  )
}

export default connect(
  (state) => {
    return {
      notificationMessage: state.notification.message
    }
  }
)(Notification)

// In other cases, use the following
/*
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    notification && notification.message && notification.message != ' ' ?
      <div style={style}>
        {notification.message}
      </div>
    : null
  )
}

export default Notification
*/
