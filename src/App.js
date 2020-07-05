import React, { useState } from 'react'
import './App.css'

const Equation = ({x, y, z}) => {
  return (
      <p>
        <span className="orange">{x}</span>
        x
        <span className="green">{y}</span>
        =
        <span className="blue">{z}</span>
      </p>
  )
}

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
  const offset = props.offset + 2 - digits(props.value).length
  const className = props.hasFocus ? 'blue' : 'dim'
  return (
    <Row
      className={className}
      offset={offset}
      values={values}
      cellClasses={values.map(_ => 'border-bottom')}
    />
  )
}

const digits = (x) => x.toString().split('').map(x => parseInt(x))

const Numerator = (props) => {
  const values = [
    ...(props.value || []),
  ]
  if (props.proposed !== undefined) {
    values.push(props.proposed)
  }

  return (
    <Row
      offset={digits(props.divisor).length}
      values={values}
      cellClasses={values.map((_, i) => {
        return i === values.length - 1
          ? 'orange'
          : 'dim'
      })}
    />
  )
}

const Main = (props) => {
  const values = [
    ...digits(props.divisor),
    ...digits(props.denominator),
  ]
  const {focus} = props
  const cellClasses = [
    ...digits(props.divisor).map(_ => 'green'),
    ...digits(props.denominator).map((_, i) => {
      const dimClass = focus === 0 && i === 0
        ? 'bold '
        : 'dim '
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
  const [index, setIndex] = useState(0)
  const [numerator, setNumerator] = useState()
  const [proposedLittleNumerator, setProposedLittleNumerator] = useState(4)
  const product = proposedLittleNumerator * divisor
  const [pairs, setPairs] = useState([])
  const nextLittleDenominator = pairs.length
    ? pairs[index - 1].remainder
    : digits(denominator)[index]

  const remainder = nextLittleDenominator - product

  const handleOk = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const nextNumerator = numerator === undefined
      ? proposedLittleNumerator + ''
      : numerator + proposedLittleNumerator + ''

    setNumerator(nextNumerator)

    const nextPairs = pairs
    pairs[index] = {
      product,
      remainder: parseInt([remainder, digits(denominator)[index + 1]].join('')),
    }
    setPairs(nextPairs)

    setProposedLittleNumerator(1)
    setIndex(index + 1)
  }


  const difference = remainder

  return (
    <div className="App">
      <table>
        <tbody>
          <Numerator
            divisor={divisor}
            proposed={proposedLittleNumerator}
            value={numerator}
          />
          <Main
            focus={index}
            divisor={divisor}
            denominator={denominator}
          />
          {
            pairs.map(x => {
              return (
                <>
                  <Product
                    offset={0}
                    value={x.product}
                  />
                  <Row
                    offset={1}
                    values={digits(x.remainder)}
                    className={x.remainder}
                  />
                </>
              )
            })
          }

          <Product
            offset={index}
            value={product}
            hasFocus
          />
          <Row
            offset={index + 2 - (digits.length)}
            values={digits(Math.abs(difference))}
            className={difference < 0 ? 'red' : ''}
          />
        </tbody>
      </table>

      <p>
        How many times does <span className="green">{divisor}</span>
        &nbsp;go into <span className="bold">{nextLittleDenominator}</span>?
      </p>
      <Equation
        x={proposedLittleNumerator}
        y={divisor}
        z={divisor * proposedLittleNumerator}
      />
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
