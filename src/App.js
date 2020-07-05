import React, { useState } from 'react'
import './App.css'
import Problem from './Problem'

function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function App() {
  const [divisor, setDivisor] = useState(rand(2, 9))
  const [denominator, setDenominator] = useState(rand(10, 99999))
  const [show, setShow] = useState(true)
  const handleNew = () => {
    setShow(false)
    setDivisor(rand(2, 9))
    setDenominator(rand(10, 99999))
    setTimeout(() => {
      setShow(true)
    }, 0)
  }
  return (
    <div>
      {show &&
      <Problem
        divisor={divisor}
        denominator={denominator}
      />
      }
      <button onClick={handleNew}>
        New
      </button>
      <p className="footer">
        <a href="https://github.com/reergymerej/long-division">source</a>
      </p>
    </div>
  )
}

export default App
