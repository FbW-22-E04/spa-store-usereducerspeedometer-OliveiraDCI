import React, { useReducer } from "react";
import ReactSpeedometer from "react-d3-speedometer";

const initState = {
  turnedOn: false,
  tempo: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "toggleCar":
      if (state.tempo === 0) {
        state = {
          ...state,
          turnedOn: !state.turnedOn,
        };
      } else {
        console.error("Not possible to switch off");
      }
      return state;
    case "accelerate":
      if (state.turnedOn && state.tempo < 240) {
        state = {
          ...state,
          tempo: state.tempo + 5,
        };
      } else {
        if (state.tempo === 240) {
          console.log("Maximum speed reached");
        } else {
          console.log("Car is not on");
        }
      }
      return state;
    case "break":
      if (state.tempo > 0) {
        state = {
          ...state,
          tempo: state.tempo - 5,
        };
      } else {
        console.log("Car stops");
      }
      return state;
    default:
      console.error("Unknown action");
      return state;
  }
};

export default function Car() {
  const [state, dispatch] = useReducer(reducer, initState);
  const intervalRef = React.useRef(null);

  const startAction = (type) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => dispatch({ type }), 50);
  };

  const stopAction = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <div className="car">
      {!state.turnedOn ? (
        <p>Switched off</p>
      ) : (
        <ReactSpeedometer
          value={state.tempo}
          minValue={0}
          maxValue={240}
          currentValueText={`${state.tempo} km/h`}
          needleTransitionDuration={100}
        />
      )}
      <div>
        <button onClick={() => dispatch({ type: "toggleCar" })}>
          {state.turnedOn ? "Switch off" : "Switch on"}
        </button>
        <button
          onMouseDown={() => startAction("accelerate")}
          onMouseUp={() => stopAction()}
          onMouseLeave={() => stopAction()}
        >
          Speed Up
        </button>
        <button
          onMouseDown={() => startAction("break")}
          onMouseUp={() => stopAction()}
          onMouseLeave={() => stopAction()}
        >
          Brakes
        </button>
      </div>
    </div>
  );
}
