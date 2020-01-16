/* eslint-disable no-shadow */

import { state, take, sread, sput, chan, buffer, read } from 'riew';
import {
  ANSWER,
  START_OVER,
  NEXT_STEP,
  RESET_ERROR,
  SET_ERROR,
  IS_COMPLETED,
  CURRENT_QUESTION,
  GET_ERROR,
  GET_QUESTIONS,
} from './constants';

const initialValue = [
  {
    id: 'q1',
    text: 'What is your age?',
    type: 'input',
    answer: null,
  },
  {
    id: 'q2',
    text: 'Do you like pizza?',
    type: 'boolean',
    answer: null,
  },
  {
    id: 'q3',
    text: 'Do you like to swim?',
    type: 'boolean',
    answer: null,
  },
];
const questions = state(initialValue);
const currentStep = state(0);
const error = state(null);

questions.select(GET_QUESTIONS);
questions.mutate(ANSWER, function* mutateAnswer(questions, value) {
  const currentStepIndex = yield read(currentStep);
  return questions.map((question, i) =>
    i === currentStepIndex ? { ...question, answer: value } : question
  );
});
questions.mutate(START_OVER, questions =>
  questions.map(q => ({ ...q, answer: null }))
);
currentStep.mutate(NEXT_STEP, currentIndex => currentIndex + 1);
currentStep.mutate(START_OVER, () => 0);
error.mutate(RESET_ERROR, () => null);
error.mutate(SET_ERROR);
error.select(GET_ERROR);

sread(ANSWER, RESET_ERROR, { listen: true });
sread(
  [questions, currentStep],
  ([Qs, step]) => {
    sput(chan(CURRENT_QUESTION, buffer.memory()), Qs[step]);
  },
  { listen: true }
);
sread(
  [questions, currentStep],
  ([Qs, step]) => {
    sput(chan(IS_COMPLETED, buffer.memory()), Qs.length - 1 === step);
  },
  { listen: true }
);
