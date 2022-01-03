const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  await response.json(blogs)
})

blogsRouter.get('/blogs/:id', async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 })
  if (blog)
    await response.status(200).json(blog)
  else
    await response.status(404).end()
})

blogsRouter.post('/blogs', async (request, response) => {
  const blogMeta = request.body

  if (blogMeta.title === undefined && blogMeta.url === undefined)
    await response.status(400).end()
  else if (request.token)
    try {
      if (request.user) {
        blogMeta.user = request.user
        if (blogMeta.likes === undefined)
          blogMeta.likes = 0

        const blog = await new Blog(blogMeta)
        const result = await blog.save()
        blogMeta.user.blogs = blogMeta.user.blogs.concat(result._id)
        await blogMeta.user.save()
        await response.status(201).json(result)
      } else
        await response.status(401).json({ error: 'token invalid' })
    } catch (e) {
      await response.status(403).json({ error: 'authentication error' })
    }
  else
    await response.status(401).json({ error: 'token missing' })
})

blogsRouter.put('/blogs/:id', async (request, response) => {
  const id = request.params.id
  const oldBlog = await Blog.findById(id)

  if (oldBlog)
    if (request.token)
      if (request.user)
        if (oldBlog.user.toString() === request.user._id.toString())
          try {
            const blogMeta = request.body
            await Blog.findByIdAndUpdate(id, {
              title: blogMeta.title ? blogMeta.title : oldBlog.title,
              author: blogMeta.author ? blogMeta.author : oldBlog.author,
              url: blogMeta.url ? blogMeta.url : oldBlog.url,
              likes: blogMeta.likes ? blogMeta.likes : oldBlog.likes
            })
    
            const newBlog = await Blog.findById(id)
            await response.status(201).json(newBlog)
          } catch (e) {
            await response.status(500).end()
            throw e
          }
        else
          await response.status(403).json({ error: `no access to blog id ${id}` })
      else
        await response.status(401).json({ error: 'token invalid' })
    else
      await response.status(401).json({ error: 'token missing' })
  else
    await response.status(404).end()
})

blogsRouter.delete('/blogs/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (blog)
    if (request.token)
      if (request.user)
        if (blog.user.toString() === request.user._id.toString())
          try {
            const result = await blog.remove()
            await response.status(204).json(result)
          } catch (e) {
            await response.status(500).end()
            throw e
          }
        else
          await response.status(403).json({ error: `no access to blog id ${id}` })
      else
        await response.status(401).json({ error: 'token invalid' })
    else
      await response.status(401).json({ error: 'token missing' })
  else
    await response.status(204).end()
})

blogsRouter.post('/testing/reset', async (request, response) => {
  if (process.env.NODE_ENV === 'test') {
    await Blog.deleteMany({})
    await User.deleteMany({})
    await response.status(204).end()
  } else
    await response.status(403).json({ error: 'database reset only allowed in test mone' })
})

module.exports = blogsRouter
