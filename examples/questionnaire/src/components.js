/* eslint-disable no-nested-ternary */
import React, { Fragment } from 'react';
import riew from 'riew/react';
import { sput } from 'riew';
import { nextStepRoutine, startOverRoutine, NEXT_STEP_CLICK } from './routines';
import { CURRENT_QUESTION, ANSWER, GET_QUESTIONS, START_OVER } from './state';

export const Question = riew(function Question({
  step: { type, text },
  giveAnswer,
}) {
  if (type === 'input') {
    return (
      <Fragment>
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
}).with({
  step: CURRENT_QUESTION,
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
).with({
  questions: GET_QUESTIONS,
  startOver: () => sput(START_OVER),
});
