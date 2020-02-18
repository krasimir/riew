/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import riew from 'riew/react';
import { sput, listen } from 'riew';
import { nextStepRoutine, startOverRoutine, NEXT_STEP_CLICK } from './routines';
import { ANSWER, START_OVER } from './state';

function* progress({ state, render, step, questions }) {
  const progressValue = state(0);
  listen(
    [step, questions],
    ([currentStep, allQuestions]) => {
      const idx = allQuestions.findIndex(({ id }) => currentStep.id === id);
      sput(progressValue, Math.ceil((idx / allQuestions.length) * 100));
    },
    { initialCall: true }
  );
  render({ progressValue });
}

export const Question = riew(function Question({
  step: { type, text },
  giveAnswer,
  progressValue,
}) {
  if (type === 'input') {
    return (
      <Fragment>
        <p>
          <small>{progressValue}% done</small>
        </p>
        <div>
          {text}
          <input type="text" onChange={e => giveAnswer(e.target.value)} />
        </div>
      </Fragment>
    );
  }
  if (type === 'boolean') {
    return (
      <Fragment>
        <p>
          <small>{progressValue}% done</small>
        </p>
        <div>{text}</div>
        <div>
          <input
            type="radio"
            key={text + 1}
            name={text}
            onClick={() => giveAnswer(true)}
          />
          yes
        </div>
        <div>
          <input
            type="radio"
            key={text + 2}
            name={text}
            onClick={() => giveAnswer(false)}
          />
          no
        </div>
      </Fragment>
    );
  }
  return null;
},
progress).with('step', 'questions', {
  giveAnswer: value => sput(ANSWER, value),
});

export const Error = riew(function Error({ error }) {
  return error !== null ? <div className="error">Error: {error}</div> : null;
}).with('error');

export const App = riew(
  function App({ completed, questions, startOver }) {
    if (completed) {
      return (
        <Fragment>
          <ul>
            {questions.map(({ text, answer }) => (
              <li key={text}>
                {text}:{' '}
                {typeof answer === 'boolean' ? (answer ? 'yes' : 'no') : answer}
              </li>
            ))}
          </ul>
          <button onClick={startOver} type="button">
            start over
          </button>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Error />
        <Question />
        <button onClick={() => sput(NEXT_STEP_CLICK)} type="button">
          Next question
        </button>
      </Fragment>
    );
  },
  nextStepRoutine,
  startOverRoutine
).with('step', 'questions', {
  startOver: () => sput(START_OVER),
});
