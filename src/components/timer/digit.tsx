import { memo } from 'react'

interface DigitProps {
  num: number,
  onWheel: (e: React.WheelEvent<HTMLElement>) => void
};

export default function Digit({ num, onWheel }: DigitProps) {
  return (<span id={Math.random().toString()} onWheel={onWheel}>{num}</span>)
}

function propsAreEqual({ num: prev }: DigitProps, { num: next }: DigitProps) {
  return prev === next
}

export const MDigit = memo(Digit, propsAreEqual);

