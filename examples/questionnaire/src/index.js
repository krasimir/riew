import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { state, take, put, sput, sub, go } from "riew";
import riew from "riew/react";

const nextStepRoutine = function*({ render }) {
  yield take("NEXT_STEP_CLICK");
  yield put(RESET_ERROR);
  const question = yield take("CURRENT_QUESTION");
  if (question.answer === null) {
    yield put(SET_ERROR, `Ops, "${question.text}" has no answer.`);
  } else {
    if (yield take("IS_COMPLETED")) {
      render({ completed: true });
    } else {
      yield put(NEXT_STEP);
    }
  }
  return go;
};
const startOverRoutine = function*({ render }) {
  yield sub(START_OVER);
  render({ completed: false });
  return go;
};
const App = riew(
  ({ completed, questions, startOver }) => {
    if (completed) {
      return (
        <Fragment>
          <ul>
            {questions.map(({ text, answer }) => {
              return (
                <li key={text}>
                  {text}:{" "}
                  {typeof answer === "boolean"
                    ? answer
                      ? "yes"
                      : "no"
                    : answer}
                </li>
              );
            })}
          </ul>
          <button onClick={startOver}>start over</button>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Error />
        <Question />
        <button onClick={() => sput("NEXT_STEP_CLICK")}>Next question</button>
      </Fragment>
    );
  },
  nextStepRoutine,
  startOverRoutine
).with({
  startOver: () => sput(START_OVER),
  questions: questions
});

ReactDOM.render(<App />, document.querySelector("#container"));
