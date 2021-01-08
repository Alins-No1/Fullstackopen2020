import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios'

axios
  .get('https://restcountries.eu/rest/v2/all')
  .then(response => {
    const countries = response.data
    ReactDOM.render(
      <React.StrictMode>
        <App countries={countries} />
      </React.StrictMode>,
      document.getElementById('root')
    );
  })

