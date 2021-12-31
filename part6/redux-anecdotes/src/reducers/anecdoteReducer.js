import anecdoteService from '../services/anecdoteService'

/*const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]*/
const anecdotesAtStart = []

/*
const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)
*/
const initialState = []

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT':
      return action.anecdotes.sort((first, second) => second.votes - first.votes)
    case 'CREATE':
      return [...state, action.anecdote]
        .sort((first, second) => second.votes - first.votes)
    case 'VOTE':
      const id = action.id
      return state.map(anecdote =>
        anecdote.id == id ? {
          content: anecdote.content,
          id: id,
          votes: anecdote.votes + 1
        } : anecdote
      ).sort((first, second) => second.votes - first.votes)
    default: return state
  }
}

export const initialize = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      "type": 'INIT',
      anecdotes: anecdotes
    })
  }
}

export const createNew = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      "type": 'CREATE',
      "anecdote": newAnecdote
    })
  }
}

export const vote = (id) => {
  return async (dispatch) => {
    const oldAnecdote = await anecdoteService.find(id)
    const updatedAnecdote = await anecdoteService.update(id, {
      ...oldAnecdote,
      "votes": oldAnecdote.votes + 1
    })
    dispatch({
      "type": 'VOTE',
      "id": id
    })
  }
}

export default reducer
