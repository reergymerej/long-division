import React, { useState } from 'react'
import './App.css'

const Row = (props) => {
  const withOffset = [...props.values]
  let {offset} = props
  const cellClassesWithOffset = [...props.cellClasses || []]
  while (offset > 0 && offset--) {
    withOffset.unshift(null)
    cellClassesWithOffset.unshift(null)
  }
  return (
    <tr className={props.className || ''}>
      {withOffset.map((x, i) => {
        return (
          <td
            key={i}
            className={(cellClassesWithOffset)[i] || ''}
          >
            {x}
          </td>
        )
      })}
    </tr>
  )
}

const Product = (props) => {
  const values = digits(props.value)
  values[0] = '-' + values[0]
  const offset = 2 - digits(props.value).length
  return (
    <Row
      className="blue"
      offset={offset}
      values={values}
      cellClasses={values.map(_ => 'border-bottom')}
    />
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
      cellClasses={[
        'orange',
      ]}
    />
  )
}

const Main = (props) => {
  const values = [
    ...digits(props.divisor),
    ...digits(props.denominator),
  ]
  const focus = 0
  const cellClasses = [
    ...digits(props.divisor).map(_ => 'green'),
    ...digits(props.denominator).map((_, i) => {
      const dimClass = i !== focus
        ? 'dim '
        : 'bold '
      const borderClasses = i === 0
        ? 'border-left border-top'
        : 'border-top'
      return dimClass + borderClasses
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

  const handleOk = () => {
  }

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
          <Product
            value={product}
          />
          <Row
            offset={1}
            values={[remainder]}
            className={remainder < 0 ? 'red' : ''}
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
        How many times does <span className="green">{divisor}</span>
        &nbsp;go into <span className="bold">{nextLittleDenominator}</span>?
      </p>
      <p>
        <span className="green">{divisor}</span>
        &nbsp;x <span className="orange">{proposedLittleNumerator}</span> =
        &nbsp;<span className="blue">{divisor * proposedLittleNumerator}</span>
      </p>
      <form onSubmit={handleOk}>
        <input
          value={isNaN(proposedLittleNumerator) ? '' : proposedLittleNumerator}
          onChange={x => setProposedLittleNumerator(parseInt(x.target.value))}
          type="number"
          min="1"
          max="9"
        />
        <button>OK</button>
      </form>
    </div>
  )
}

export default App
