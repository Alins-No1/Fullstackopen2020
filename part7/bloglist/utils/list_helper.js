const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var sum = 0
  blogs.forEach(element => {
    if ('likes' in element)
      sum += element.likes
  })
  return sum
}

const favoriteBlog = (blogs) => {
  var favorite = null, maxLikes = 0
  blogs.forEach(element => {
    if ('likes' in element && element.likes > maxLikes) {
      maxLikes = element.likes
      favorite = {
        title: element.title,
        author: element.author,
        likes: maxLikes
      }
    }
  })
  return favorite
}

const _ = require("lodash")

const mostBlogs = (blogs) => {
  const blogCount = _.countBy(blogs, 'author')

  const authorWithMostBlogs =
    _.reduce(blogCount, (result, value, key) => {
      if (value > _.values(result)[0]) {
        result = {}
        result[key] = value
      }
      return result
    }, {'': 0})

  return ({
    'author': _.keys(authorWithMostBlogs)[0],
    'blogs': _.values(authorWithMostBlogs)[0]
  })
}

const mostLikes = (blogs) => {
  const likeCount =
    _.reduce(blogs, (result, value) => {
      if (_.has(result, value.author))
        result[value.author] += value.likes
      else
        result[value.author] = value.likes
      return result
    }, {})

  const authorWithMostLikes =
    _.reduce(likeCount, (result, value, key) => {
      if (value > _.values(result)[0]) {
        result = {}
        result[key] = value
      }
      return result
    }, {'': 0})

  return ({
    'author': _.keys(authorWithMostLikes)[0],
    'likes': _.values(authorWithMostLikes)[0]
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

