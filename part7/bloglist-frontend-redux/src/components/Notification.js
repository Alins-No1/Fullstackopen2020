import React from 'react'
import { useSelector } from 'react-redux'
import './Notification.css'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  return (
    notification && notification.message && notification.message !== ' ' ?
      <div className={notification.type}>
        {notification.message}
      </div>
      : null
  )
}

export default Notification
