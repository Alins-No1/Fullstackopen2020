import React, { useState } from 'react'

const Search = ({ changeHandler }) =>
  <div>
    find countries
    <input onChange={changeHandler} />
  </div>

const Result = ({ searchResult, onShowClicked }) => {
  const len = searchResult.length
  if (len == 1) {
    const country = searchResult[0]
   
    return <div>
      <h1>{country.name}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {country.languages.map(
          (language, id) => <li key={id}>{language.name}</li>
        )}
      </ul>
      <img src={country.flag} height="100" />
    </div>
  } else if (len <= 10)
    return <div>
      {searchResult.map((country, id) => 
        <p key={id}>
          {country.name}
          <button onClick={onShowClicked(country.name)}>show</button>
        </p>
      )}
    </div>
  else
    return <p>Too many matches, specify another filter</p>
}

function App({ countries }) {
  const [ pattern, setPattern ] = useState('')
  const onChangeHandler = (event) => {
    setPattern(event.target.value.toLowerCase())
  }

  const onShowClicked = (name) => () => {
    setPattern(name.toLowerCase())
  }

  var searchResult =
    pattern === ''
    ? countries
    : countries.filter(
        country => country.name.toLowerCase().indexOf(pattern) >= 0
    )
  
  return <div>
    <Search changeHandler={onChangeHandler} />
    <Result searchResult={searchResult} onShowClicked={onShowClicked}/>
  </div>
}

export default App;
