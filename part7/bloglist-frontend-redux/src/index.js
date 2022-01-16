import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Container } from 'react-bootstrap'
import store from './store'
import App from './App'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
      </head>
      <Container>
        <App />
      </Container>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
