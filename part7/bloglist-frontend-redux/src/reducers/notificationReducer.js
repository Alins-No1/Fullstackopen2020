const emptyState = {
  'message': '',
  'type': 'success',
  'timeout': 0
}

const reducer = (state = emptyState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.data
  case 'CLEAR_NOTIFICATION':
    return emptyState
  default: return state
  }
}

export const setNotification = (message, type, timeoutInSecond = 3) => {
  return {
    'type': 'SET_NOTIFICATION',
    'data': {
      'message': message,
      'type': type,
      'timeout': timeoutInSecond * 1000
    }
  }
}

export const clearNotification = () => {
  return {
    'type': 'CLEAR_NOTIFICATION'
  }
}

export default reducer
