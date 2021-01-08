import React from 'react'

const Header = ({ course }) => {
  return (
    <h2>{course.name}</h2>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>    
  )
}

const Content = ({ course }) => course.parts.map(
  part => <Part key={part.id} part={part} />
)

const Total = ({ course }) => {
  var sum = course.parts.map(part => part.exercises)
            .reduce((val0, val1) => val0 + val1, 0)
  return(
    <p>total of {sum} exercises</p>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default Course
