import React, { useEffect, useReducer } from 'react'
import { MDigit } from './timer/digit.js'
import tick from '../assets/384187__malle99__click-tick.wav'

export default function Timer() {
  const SET_TIME = 'set-time';
  const SET_RUNNING = 'set-running';
  const tickAudio = new Audio(tick);

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
  
  const handleWheel = ({ deltaY }, digitName) => {
    let how_to_change;
    
    if (deltaY === 0) {
      return
    } else if(deltaY > 0) {
      how_to_change = "increase"
    } else {
      how_to_change = "decrease"
    }
    
    let how_much_to_change;

    switch(digitName) {
      case "firstM":
        how_much_to_change = 10 * 60
        break;
      case "secondM":
        how_much_to_change = 60
        break;
      case "firstS":
        how_much_to_change = 10
        break;
      case "secondS":
        how_much_to_change = 1
        break;
      default:
        return
    };

    if (how_to_change === 'increase') {
      how_much_to_change *= -1;
    };

    dispatch({
      type: SET_TIME,
      payload: (prevTime) => {
        let newTime = prevTime + how_much_to_change; 

        if (newTime <= 0) {
          return 0
        } else if (newTime >= 3600) {
          return 3600
        } else {
          return newTime
        }
      }
    });

    tickAudio.play();
  }

  return (
    <div id="timer" className={state.running ? '' : 'paused'} onClick={handleClick}>
      <MDigit num={state.firstM} onWheel={(e) => { handleWheel(e, "firstM"); }} />
      <MDigit num={state.secondM} onWheel={(e) => { handleWheel(e, "secondM"); }} />
      :
      <MDigit num={state.firstS} onWheel={(e) => { handleWheel(e, "firstS"); }} />
      <MDigit num={state.secondS} onWheel={(e) => { handleWheel(e, "secondS"); }} />
    </div>
  )
}
