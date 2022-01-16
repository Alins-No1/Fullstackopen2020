import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  return (
    notification && notification.message && notification.message !== ' ' ?
      <Alert variant={notification.type}>
        {notification.message}
      </Alert>
      : null
  )
}

export default Notification
