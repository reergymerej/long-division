import React, { useState } from 'react'
import './App.css'
import Problem from './Problem'

const divisor = 7
const denominator = 3423

function App() {
  return (
    <Problem
      divisor={divisor}
      denominator={denominator}
    />
  )
}

export default App
