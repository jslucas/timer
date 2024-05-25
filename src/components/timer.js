import { useEffect, useReducer } from 'react'

export default function Timer() {
  const SET_TIME = 'set-time';
  const SET_RUNNING = 'set-running';

  const reduce = (state, action) => {
    switch (action.type) {
      case SET_TIME: 
        return { ...state, time: action.payload(state.time) };
      case SET_RUNNING: 
        return { ...state, running: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reduce, { time: 4, running: false });


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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div id="timer" onClick={handleClick}>
      {formatTime(state.time)}
    </div>
  )
}
