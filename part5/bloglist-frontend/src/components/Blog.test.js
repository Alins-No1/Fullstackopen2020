import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('single blog', () => {
  let sampleBlog, container, addLikeMockHandler
  beforeEach(() => {
    sampleBlog = {
      'title': 'This blog is for test',
      'author': 'Noname',
      'url': 'http://example.com',
      'likes': 0,
      'user': {
        'name': 'Noname',
        'username': 'Guest'
      }
    }
    addLikeMockHandler = jest.fn()
    const removeMockHandler = jest.fn()

    const singleBlog = render(
      <Blog blog={sampleBlog} addLikeHandler={addLikeMockHandler} removeHandler={removeMockHandler} />
    )
    container = singleBlog.container
  })

  test('initially the single blog contains title and author, but not url or likes', () => {
    expect(container).toHaveTextContent(sampleBlog.title)
    expect(container).toHaveTextContent(sampleBlog.author)
    expect(container).not.toHaveTextContent(sampleBlog.url)
    expect(container).not.toHaveTextContent('likes')
  })

  test('after the button of showing details has been clicked, it cointains url and likes', () => {
    const viewButton = container.querySelector('#view')
    fireEvent.click(viewButton)
    expect(container).toHaveTextContent(sampleBlog.url)
    expect(container).toHaveTextContent('likes')
  })

  test('if the \'like\' button clicked twice, the \'addLike\' event handler called twice', () => {
    const viewButton = container.querySelector('#view')
    fireEvent.click(viewButton)
    const addLikeButton = container.querySelector('#addLike')
    fireEvent.click(addLikeButton)
    fireEvent.click(addLikeButton)
    expect(addLikeMockHandler.mock.calls).toHaveLength(2)
  })
})
