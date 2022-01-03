describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      'username': 'Guest',
      'name': 'Noname',
      'password': 'qwertyuiop'
    })
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
    cy.get('#usernameValue')
    cy.get('#passwordValue')
    cy.get('#loginButton')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#usernameValue').clear().type('Guest')
      cy.get('#passwordValue').clear().type('qwertyuiop')
      cy.get('#loginButton').click()

      cy.contains('Noname logged in')
    })

    it('fails with wrong credentials', function() {
      // wrong username
      cy.get('#usernameValue').clear().type('Noname')
      cy.get('#passwordValue').clear().type('qwertyuiop')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      // wrong password
      cy.get('#usernameValue').clear().type('Guest')
      cy.get('#passwordValue').clear().type('asdfghjkl')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      // log in
      cy.get('#usernameValue').clear().type('Guest')
      cy.get('#passwordValue').clear().type('qwertyuiop')
      cy.get('#loginButton').click()
      // create a blog
      cy.get('#buttonOfTogglable').click()
      cy.get('#titleValue').clear().type('This blog is for test')
      cy.get('#authorValue').clear().type('Noname')
      cy.get('#urlValue').clear().type('http://example.com')
      cy.get('#createNewBlogButton').click()
    })

    it('A blog can be created', function() {
      cy.get('.success')
        .should('contain', 'a new blog This blog is for test by Noname added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.get('.undetailedBlog')
        .should('contain', 'This blog is for test')
        .and('contain', 'Noname')
    })

    it('User can like a blog', function() {
      cy.get('#view').click()
      cy.get('.detailedBlog')
        .should('contain', 'likes 0')
      cy.get('#addLike').click()
      cy.get('.detailedBlog')
        .should('contain', 'likes 1')
    })

    it('The user can delete its own blog', function() {
      cy.get('#view').click()
      cy.get('#remove').click()
      cy.contains('This blog is for test')
        .should('not.exist')
    })

    it.only('Multiple blogs are sorted descendingly by likes', function() {
      // create the second blog
      cy.get('#buttonOfTogglable').click()
      cy.get('#titleValue').clear().type('2nd blog')
      cy.get('#authorValue').clear().type('Noname')
      cy.get('#urlValue').clear().type('http://example.com')
      cy.get('#createNewBlogButton').click()
      // create the third blog
      cy.get('#buttonOfTogglable').click()
      cy.get('#titleValue').clear().type('3rd blog')
      cy.get('#authorValue').clear().type('Noname')
      cy.get('#urlValue').clear().type('http://example.com')
      cy.get('#createNewBlogButton').click()

      const like = (blogContent) => {
        cy.contains(blogContent).parent().find('#addLike').click()
        cy.wait(2000)
      }

      // Add 2 likes to the first blog
      cy.contains('This blog is for test').parent().find('#view').click()
      for (var i=0; i<2; ++i)
        like('This blog is for test')

      // Add 4 likes to the second blog
      cy.contains('2nd blog').parent().find('#view').click()
      for (i=0; i<4; ++i)
        like('2nd blog')

      // Add 3 likes to the third blog
      cy.contains('3rd blog').parent().find('#view').click()
      for (i=0; i<3; ++i)
        like('3rd blog')

      // Assertions
      cy.get('.detailedBlog')
        .then(blogs => {
          expect(blogs[0]).to.contain.text('2nd blog')
          expect(blogs[0]).to.contain.text('likes 4')
          expect(blogs[1]).to.contain.text('3rd blog')
          expect(blogs[1]).to.contain.text('likes 3')
          expect(blogs[2]).to.contain.text('This blog is for test')
          expect(blogs[2]).to.contain.text('likes 2')
        })
    })
  })
})
