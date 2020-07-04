import React, { useState } from 'react'
import './App.css'

const Row = (props) => {
  const withOffset = [...props.values]
  let {offset} = props
  while (offset > 0 && offset--) {
    withOffset.unshift(null)
  }
  return (
    <tr className={props.className || ''}>
      {withOffset.map((x, i) => {
        return (
          <td
            key={i}
            className={(props.cellClasses || [])[i] || ''}
          >
            {x}
          </td>
        )
      })}
    </tr>
  )
}

const digits = (x) => x.toString().split('').map(x => parseInt(x))

const Numerator = (props) => {
  const values = props.numerator
    ? [
      ...digits(props.numerator),
    ]
    : []
  return (
    <Row
      offset={digits(props.divisor).length}
      values={values}
    />
  )
}

const Main = (props) => {
  const values = [
    ...digits(props.divisor),
    ...digits(props.denominator),
  ]
  const cellClasses = [
    ...digits(props.divisor).map(_ => null),
    ...digits(props.denominator).map((_, i) => {
      return i === 0
        ? 'border-left border-top'
        : 'border-top'
    }),
  ]
  return (
    <Row
      className="Main"
      values={values}
      cellClasses={cellClasses}
    />
  )
}

function App() {
  const divisor = 2
  const denominator = 97104
  // const numerator = 48662
  const numerator = undefined
  const nextLittleDenominator = digits(denominator)[0]
  const [proposedLittleNumerator, setProposedLittleNumerator] = useState(4)
  const product = proposedLittleNumerator * divisor
  const remainder = nextLittleDenominator - (product)

  return (
    <div className="App">
      <table>
        <tbody>
          <Numerator
            divisor={divisor}
            numerator={proposedLittleNumerator}
          />
          <Main
            divisor={divisor}
            denominator={denominator}
          />
          <Row
            offset={2 - digits(product).length}
            values={digits(product)}
          />
          <Row
            offset={1}
            values={[remainder]}
          />
          {/*
          <Row
            offset={1}
            values={[1, 6]}
          />
          <Row
            offset={2}
            values={[1, 1]}
          />
          <Row
            offset={2}
            values={[1, 0]}
          />
          <Row
            offset={3}
            values={[1, 0]}
          />
          <Row
            offset={3}
            values={[1, 0]}
          />
          <Row
            offset={4}
            values={[0, 4]}
          />
          <Row
            offset={5}
            values={[4]}
          />
          */}
        </tbody>
      </table>

      <p>
        How many times does {divisor} go into {nextLittleDenominator}?
      </p>
      <input
        value={isNaN(proposedLittleNumerator) ? '' : proposedLittleNumerator}
        onChange={x => setProposedLittleNumerator(parseInt(x.target.value))}
        type="number"
        min="1"
        max="9"
      />
    </div>
  )
}

export default App
