const reducer = (state = '', action) => {
  if (action.type == 'SET_PATTERN')
    return action.pattern
  else
    return state
}

export const updateFilterPattern = (pattern) => {
  return {
    "type": 'SET_PATTERN',
    "pattern": pattern
  }
}

export default reducer
