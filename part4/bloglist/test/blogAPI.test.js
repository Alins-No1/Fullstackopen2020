const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')

const api = supertest(app)

const existedBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    user: "617462b0be86e73ec61e7e87",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    user: "617462b4be86e73ec61e7e88",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    user: "617462b6be86e73ec61e7e89",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    user: "617462b4be86e73ec61e7e88",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    user: "617462b0be86e73ec61e7e87",
    likes: 2,
    __v: 0
  }
]

const existedUsers = [
  {
    _id: "617462b0be86e73ec61e7e87",
    username: "foo",
    name: "foo dux",
    password: "1234567890"
  },
  {
    _id: "617462b4be86e73ec61e7e88",
    username: "bar",
    name: "bar lyk",
    password: "0987654321"
  },
  {
    _id: "617462b6be86e73ec61e7e89",
    username: "baz",
    name: "baz izz",
    password: "nopassword"
  }
]

var token = null

describe('blog API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    for (var userMeta of existedUsers) {
      const saltRounds = 10
      userMeta.blogs = []
      userMeta.passwordHash = await bcrypt.hash(userMeta.password, saltRounds)

      const user = new User(userMeta);
      await user.save()
    }

    await Blog.deleteMany({})
    for (var blogMeta of existedBlogs) {
      const newBlog = new Blog(blogMeta)
      const result = await newBlog.save()
      const user = await User.findById(blogMeta.user)
      user.blogs = user.blogs.concat(result._id)
      await user.save()
    }

    const loggedIn =
      await api
        .post('/api/')
        .send({
          username: existedUsers[1].username,
          password: existedUsers[1].password
        })
    expect(loggedIn.status).toBe(200)
    
    token = loggedIn.body.token
  })

  test('returned blogs with the correct amount', async () => {
    const response = await api.get('/api/blogs')
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(existedBlogs.length)
  }, 1000000)

  test('returned blogs have \'id\' as identifiers', async () => {
    const response = await api.get('/api/blogs')
    expect(response.status).toBe(200)
  
    const returnedBlogs = response.body;
    expect(returnedBlogs.length).toBeGreaterThan(0)
    expect(returnedBlogs[0].id).toBeDefined()
  }, 1000000)

  test('posting a new blog', async () => {
    const newBlog = {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token.toString())
      .send(newBlog)
      .expect(201)
    await (async () => {
      const oneMoreBlogs = await Blog.find({})
      expect(oneMoreBlogs).toHaveLength(existedBlogs.length + 1)
    })()
  }, 1000000)

  test ('attempting to post a new blog without token', async() => {
    const newBlog = {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  }, 1000000)

  test('new blog\'s \'likes\' set default 0 if missing', async () => {
    const newBlog = {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token.toString())
      .send(newBlog)
      .expect(201)
    await (async () => {
      const newBlogFromDB = await Blog.findById(newBlog._id)
      expect(newBlogFromDB.likes).toBe(0)
    })()
  }, 1000000)

  test('new blog should have either title or url', async () => {
    const newBlog = {
      _id: "5a422aa71b54a676234d17f8",
      author: "Edsger W. Dijkstra",
      likes: 5,
      __v: 0
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token.toString())
      .send(newBlog)
      .expect(400)
  }, 1000000)

  test('deleting blogs manually', async () => {
    await api
      .delete(`/api/blogs/${existedBlogs[1]._id}`)
      .set('Authorization', 'Bearer ' + token.toString())
      .expect(204)
    await api
      .delete(`/api/blogs/${existedBlogs[3]._id}`)
      .set('Authorization', 'Bearer ' + token.toString())
      .expect(204)
  }, 1000000)

  test('deleting other user\'s blog forbidden', async () => {
    await api
      .delete(`/api/blogs/${existedBlogs[2]._id}`)
      .set('Authorization', 'Bearer ' + token.toString())
      .expect(403)
  }, 1000000)

  test('one more like added to an existed blog', async () => {
    const response =
      await api
        .put(`/api/blogs/${existedBlogs[1]._id}`)
        .set('Authorization', 'Bearer ' + token.toString())
        .send({"likes": existedBlogs[1].likes + 1})
    expect(response.status).toBe(201)
    expect(response.body.likes).toBe(existedBlogs[1].likes + 1)
  }, 1000000)

  test('attempting to update an unexisted blog', async () => {
    await api
      .put('/api/blogs/5a422aa71b54a676234d17f8')
      .send({"likes": 1})
      .expect(404)
  }, 1000000)
 
  afterAll(() => {
    mongoose.connection.close()
  })
})

