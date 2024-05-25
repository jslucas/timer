import React, { useEffect, useReducer } from 'react'
import { MDigit } from './timer/digit.js'

export default function Timer() {
  const SET_TIME = 'set-time';
  const SET_RUNNING = 'set-running';

  const firstM = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return Math.floor(mins / 10);
  };

  const secondM = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return Math.floor(mins % 10);
  };

  const firstS = (seconds) => {
    return Math.floor(seconds % 60 / 10);
  };

  const secondS = (seconds) => {
    return Math.floor(seconds % 60 % 10);
  };

  const reduce = (state, action) => {
    switch (action.type) {
      case SET_TIME: 
        let updatedTime = action.payload(state.time);
        return {
          ...state,
          time: updatedTime,
          firstM: firstM(updatedTime),
          secondM: secondM(updatedTime),
          firstS: firstS(updatedTime),
          secondS: secondS(updatedTime)
        };
      case SET_RUNNING: 
        return { ...state, running: action.payload };
      default:
        return state;
    }
  };

  const initialState = {
    time: 765,
    running: false,
    firstM: 1,
    secondM: 2,
    firstS: 4,
    secondS: 5,
  };
  const [state, dispatch] = useReducer(reduce, initialState);

  useEffect(() => {
    let intervalId;

    if (state.running) {
      intervalId = setInterval(() => {
        dispatch({type: SET_TIME, payload: prevTime => { 
          if (prevTime > 0) {
            return prevTime - 1
          } else {
            dispatch({type: SET_RUNNING, payload: false});
            return 0
          }
        }}); 
      }, 1000);

      console.log(`started interval: ${intervalId}`);
    } 

    return () => {
      if (intervalId) {
        console.log(`Clearing interval: ${intervalId}`);
        clearInterval(intervalId);
        return null
      };
    };
        
  }, [state.running]);

  const handleClick = (e) => {
    e.preventDefault();
    if (state.time === 0) {
      dispatch({type: SET_TIME, payload: 4});
    } else {
      dispatch({type: SET_RUNNING, payload: !state.running});
    }
  };
  

  return (
    <div id="timer" onClick={handleClick}>
      <MDigit num={state.firstM} /><MDigit num={state.secondM} />:<MDigit num={state.firstS} /><MDigit num={state.secondS} />
    </div>
  )
}
