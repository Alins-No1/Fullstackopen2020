const initialState = {
  "message": '',
  "timeout": 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MESSAGE_AND_TIMEOUT':
      return {
        "message": action.message,
        "timeout": action.timeout
      }
    case 'SET_MESSAGE':
      return {
        ...state,
        "message": action.message,
      }
    case 'SET_TIMEOUT':
      return {
        ...state,
        "timeout": action.timeout
      }
    case 'CLEAR_MESSAGE':
      return initialState
    default: return state
  }
}

export const setNotification = (message, timeoutInSecond = 5) => {
  return {
    "type": 'SET_MESSAGE_AND_TIMEOUT',
    "message": message,
    "timeout": timeoutInSecond * 1000
  }
}

export const clearNotification = () => {
  return {
    "type": 'CLEAR_MESSAGE'
  }
}

export default reducer
