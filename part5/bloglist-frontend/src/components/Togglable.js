import React, { useState, useImperativeHandle } from 'react'

// eslint-disable-next-line react/display-name
const Togglable = React.forwardRef((props, ref) => {
  const [ visible, setVisible ] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button id='buttonOfTogglable' onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button id='cancelButtonOfTogglable' onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable
