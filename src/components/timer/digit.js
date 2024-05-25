import { memo } from 'react'

export default function Digit({ num }) {
  return (<span id={Math.random()}>{num}</span>)
}

function propsAreEqual({ num: prev }, { num: next }) {
  return prev === next
}

export const MDigit = memo(Digit, propsAreEqual);

