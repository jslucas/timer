import { memo } from 'react'

export default function Digit({ num, onWheel }) {
  return (<span id={Math.random()} onWheel={onWheel}>{num}</span>)
}

function propsAreEqual({ num: prev }, { num: next }) {
  return prev === next
}

export const MDigit = memo(Digit, propsAreEqual);

