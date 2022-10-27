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
        console.error("Ausschalten nicht möglich");
      }
      return state;
    case "exelerate":
      if (state.turnedOn && state.tempo < 240) {
        state = {
          ...state,
          tempo: state.tempo + 5,
        };
      } else {
        if (state.tempo === 240) {
          console.log("Maximal Speed erreicht");
        } else {
          console.log("Auto nicht eingeschlatet");
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
        console.log("Auto steht");
      }
      return state;
    default:
      console.error("Unbekannte Action");
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
        <p>Ausgeschaltet</p>
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
          {state.turnedOn ? "Ausschalten" : "Anschalten"}
        </button>
        <button
          onMouseDown={() => startAction("exelerate")}
          onMouseUp={() => stopAction()}
          onMouseLeave={() => stopAction()}
        >
          Gas geben
        </button>
        <button
          onMouseDown={() => startAction("break")}
          onMouseUp={() => stopAction()}
          onMouseLeave={() => stopAction()}
        >
          Bremsen
        </button>
      </div>
    </div>
  );
}
