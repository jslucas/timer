import React, { useEffect, useReducer } from "react";
import { MDigit } from "./timer/digit";
import tick from "../assets/384187__malle99__click-tick.wav";

export default function Timer() {
  const SET_TIME = "set-time";
  const SET_RUNNING = "set-running";
  const tickAudio = new Audio(tick);

  const firstM = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return Math.floor(mins / 10);
  };

  const secondM = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return Math.floor(mins % 10);
  };

  const firstS = (seconds: number) => {
    return Math.floor((seconds % 60) / 10);
  };

  const secondS = (seconds: number) => {
    return Math.floor((seconds % 60) % 10);
  };

  interface State {
    time: number;
    running: boolean;
    firstM: number;
    secondM: number;
    firstS: number;
    secondS: number;
  }

  type TimeUpdater = (time: number) => number;

  interface SET_TIME_ACTION {
    type: typeof SET_TIME;
    payload: TimeUpdater;
  }

  interface SET_RUNNING_ACTION {
    type: typeof SET_RUNNING;
    payload: boolean;
  }

  type Action = SET_TIME_ACTION | SET_RUNNING_ACTION;

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case SET_TIME:
        const updatedTime = action.payload(state.time);
        return {
          ...state,
          time: updatedTime,
          firstM: firstM(updatedTime),
          secondM: secondM(updatedTime),
          firstS: firstS(updatedTime),
          secondS: secondS(updatedTime),
        };
      case SET_RUNNING:
        return { ...state, running: action.payload };
      default:
        return state;
    }
  };

  const initialState: State = {
    time: 765,
    running: false,
    firstM: 1,
    secondM: 2,
    firstS: 4,
    secondS: 5,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (state.running) {
      intervalId = setInterval(() => {
        dispatch({
          type: SET_TIME,
          payload: (prevTime) => {
            if (prevTime > 0) {
              return prevTime - 1;
            } else {
              dispatch({ type: SET_RUNNING, payload: false });
              return 0;
            }
          },
        });
      }, 1000);

      console.log(`started interval: ${intervalId}`);
    }

    return () => {
      if (intervalId) {
        console.log(`Clearing interval: ${intervalId}`);
        clearInterval(intervalId);
      }
    };
  }, [state.running]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (state.time === 0) {
      return;
    } else {
      dispatch({ type: SET_RUNNING, payload: !state.running });
    }
  };

  const handleWheel = (
    { deltaY }: React.WheelEvent<HTMLElement>,
    digitName: string,
  ) => {
    let how_to_change: string;

    if (deltaY === 0) {
      return;
    } else if (deltaY > 0) {
      how_to_change = "increase";
    } else {
      how_to_change = "decrease";
    }

    let how_much_to_change;

    switch (digitName) {
      case "firstM":
        how_much_to_change = 10 * 60;
        break;
      case "secondM":
        how_much_to_change = 60;
        break;
      case "firstS":
        how_much_to_change = 10;
        break;
      case "secondS":
        how_much_to_change = 1;
        break;
      default:
        return;
    }

    if (how_to_change === "increase") {
      how_much_to_change *= -1;
    }

    dispatch({
      type: SET_TIME,
      payload: (prevTime) => {
        const newTime = prevTime + how_much_to_change;

        if (newTime <= 0) {
          return 0;
        } else if (newTime >= 3600) {
          return 3600;
        } else {
          tickAudio.play();
          return newTime;
        }
      },
    });
  };

  return (
    <div
      id="timer"
      className={state.running ? "" : "paused"}
      onClick={handleClick}
    >
      <MDigit
        num={state.firstM}
        onWheel={(e: React.WheelEvent<HTMLElement>) => {
          handleWheel(e, "firstM");
        }}
      />
      <MDigit
        num={state.secondM}
        onWheel={(e: React.WheelEvent<HTMLElement>) => {
          handleWheel(e, "secondM");
        }}
      />
      :
      <MDigit
        num={state.firstS}
        onWheel={(e: React.WheelEvent<HTMLElement>) => {
          handleWheel(e, "firstS");
        }}
      />
      <MDigit
        num={state.secondS}
        onWheel={(e: React.WheelEvent<HTMLElement>) => {
          handleWheel(e, "secondS");
        }}
      />
    </div>
  );
}
