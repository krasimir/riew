import React, { Fragment } from "react";
import riew from "riew/react";
import { sput } from "riew";

import { CURRENT_QUESTION, ANSWER } from "./constants";

export const Question = riew(({ step: { type, text }, giveAnswer }) => {
  if (type === "input") {
    return (
      <Fragment>
        <label>
          {text}
          <input type="text" onChange={e => giveAnswer(e.target.value)} />
        </label>
      </Fragment>
    );
  } else if (type === "boolean") {
    return (
      <Fragment>
        <div>{text}</div>
        <label>
          <input
            type="radio"
            key={text + 1}
            name={text}
            onClick={() => giveAnswer(true)}
          />
          yes
        </label>
        <label>
          <input
            type="radio"
            key={text + 2}
            name={text}
            onClick={() => giveAnswer(false)}
          />
          no
        </label>
      </Fragment>
    );
  }
  return null;
}).with({
  step: CURRENT_QUESTION,
  giveAnswer: value => sput(ANSWER, value)
});

export const Error = riew(({ error }) => {
  return error !== null ? <div className="error">Error: {error}</div> : null;
}).with({ error });
