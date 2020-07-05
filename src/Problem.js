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

const getDifferenceOffset = (index, difference) => {
  return digits(Math.abs(difference)).length === 2
    ? index
    : index + 1
}

const Problem = (props) => {
  const [done, setDone] = useState(false)
  const [index, setIndex] = useState(0)
  const [numerator, setNumerator] = useState()
  const [proposedLittleNumerator, setProposedLittleNumerator] = useState(1)
  const product = proposedLittleNumerator * props.divisor
  const [pairs, setPairs] = useState([])
  const nextLittleDenominator = pairs.length
    ? pairs[index - 1].remainder
    : digits(props.denominator)[index]

  const remainder = nextLittleDenominator - product

  const handleOk = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const nextPairs = pairs
    pairs[index] = {
      product,
      remainder: parseInt([remainder, digits(props.denominator)[index + 1]].join('')),
    }
    setPairs(nextPairs)

    setProposedLittleNumerator(1)
    setIndex(index + 1)
    const isDone = index + 1 >= digits(props.denominator).length
    setDone(isDone)

    const nextNumerator = numerator === undefined
      ? proposedLittleNumerator + ''
      : numerator + proposedLittleNumerator + ''

    setNumerator(nextNumerator)
  }

  const difference = remainder
  const differenceOffset = getDifferenceOffset(index, difference)

  return (
    <div className="App">
      <table>
        <tbody>
          <Numerator
            divisor={props.divisor}
            proposed={!done ? proposedLittleNumerator : ''}
            value={numerator}
            remainder={done
              ? pairs[pairs.length - 1].remainder
              : null
            }
          />
          <Main
            focus={index}
            divisor={props.divisor}
            denominator={props.denominator}
          />
          {
            pairs.map((x, i) => {
              return (
                <>
                  <Product
                    offset={i}
                    value={x.product}
                  />
                  <Row
                    offset={1 + getDifferenceOffset(i, x.remainder)}
                    values={digits(x.remainder)}
                    className={i === pairs.length - 1 ? 'bold': 'dim'}
                  />
                </>
              )
            })
          }
          {!done &&
          <>
            <Product
              offset={index}
              value={product}
              hasFocus
            />
            <Row
              offset={differenceOffset}
              values={digits(Math.abs(difference))}
              className={difference < 0 ? 'red' : ''}
            />
          </>
          }
        </tbody>
      </table>
      {!done &&
      <>
        <p>
          How many times does <span className="green">{props.divisor}</span>
          &nbsp;go into <span className="bold">{nextLittleDenominator}</span>?
        </p>
        <Equation
          x={proposedLittleNumerator}
          y={props.divisor}
          z={props.divisor * proposedLittleNumerator}
        />
        <form onSubmit={handleOk}>
          <input
            value={isNaN(proposedLittleNumerator) ? '' : proposedLittleNumerator}
            onChange={x => setProposedLittleNumerator(parseInt(x.target.value))}
            type="number"
            min="0"
            max="9"
          />
          <button>OK</button>
        </form>
      </>
      }
    </div>
  )
}

export default Problem
