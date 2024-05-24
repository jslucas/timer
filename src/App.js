// import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'

function Timer() {
  const [time, setTime] = useState(4);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let intervalId;

    if (running) {
      intervalId = setInterval(() => {
        setTime(prevTime => { 
          if (prevTime > 0) {
            return prevTime - 1
          } else {
            setRunning(false);
            return 0
          }
        }); 
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
        
  }, [running]);

  const handleClick = (e) => {
    e.preventDefault();
    setRunning(!running)
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div id="timer" onClick={handleClick}>
      {formatTime(time)}
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <Timer />
      </div>
    </div>
  );
}

export default App;
