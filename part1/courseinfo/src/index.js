import React from 'react'
import ReactDOM from 'react-dom'

const Header = (prop) => <h1> {prop.course} </h1>

const Part = (prop) => <p> {prop.name} {prop.exercise} </p>

const Content = (prop) => prop.parts.map(
  part => <Part name={part.name} exercise={part.exercises} />
)

const Total = (prop) => {
  var total = 0
  prop.parts.forEach(part => total += part.exercises)
  return <p>Number of exercises {total}</p>
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
