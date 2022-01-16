import userService from '../services/user'

const emptyState = {
  'user': null,
  'error': ''
}

const reducer = (state = emptyState, action) => {
  switch (action.type) {
  case 'SET_ACTIVE_USER':
    return {
      'user': action.user,
      'error': ''
    }
  case 'CLEAR_ACTIVE_USER':
    return emptyState
  case 'ACTIVE_USER_ERROR':
    return {
      'user': null,
      'error': action.error
    }
  case 'CLEAR_ACTIVE_USER_MESSAGE':
    return {
      'user': state.user,
      'error': ''
    }
  default: return state
  }
}

export const recoverActiveUser = () => {
  const activeUserRawData = window.localStorage.getItem('BlogListActiveUser')
  if (activeUserRawData)
    return {
      'type': 'SET_ACTIVE_USER',
      'user': JSON.parse(activeUserRawData)
    }
  else
    return {
      'type': 'CLEAR_ACTIVE_USER'
    }
}

export const login = (username, password) => {
  return async (dispatch) => {
    const user = await userService.login({ username, password })
    if (user) {
      const activeUser = {
        'id': user.id,
        'name': user.name,
        'token': `bearer ${user.token}`
      }
      window.localStorage.setItem('BlogListActiveUser', JSON.stringify(activeUser))
      dispatch({
        'type': 'SET_ACTIVE_USER',
        'user': activeUser
      })
    } else
      dispatch({
        'type': 'ACTIVE_USER_ERROR',
        'error': 'wrong username or password'
      })
  }
}

export const logout = () => {
  window.localStorage.removeItem('BlogListActiveUser')
  return {
    'type': 'CLEAR_ACTIVE_USER'
  }
}

export const clearActiveUserMessage = () => {
  return {
    'type': 'CLEAR_ACTIVE_USER_MESSAGE'
  }
}

export default reducer
