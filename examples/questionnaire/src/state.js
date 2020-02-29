/* eslint-disable no-shadow */

import {
  state,
  read,
  listen,
  sput,
  sliding,
  fixed,
  register,
  inspector,
} from 'riew';

inspector();

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
const questions = state(initialValue)`questions`;
const currentStep = state(0)`currentStep`;
const error = state(null)`error`;

questions.select()`questions`.exportAs('questions');

export const ANSWER = questions.mutate(function* mutateAnswer(
  questions,
  value
) {
  const currentStepIndex = yield read(currentStep);
  return questions.map((question, i) =>
    i === currentStepIndex ? { ...question, answer: value } : question
  );
})`answer`;
const RESET_QUESTIONS = questions.mutate(questions =>
  questions.map(q => ({ ...q, answer: null }))
)`reset`;
export const NEXT_STEP = currentStep.mutate(
  currentIndex => currentIndex + 1
)`next-step`;
const RESET_CURRENT_STEP = currentStep.mutate(() => 0)`reset-current-step`;
export const RESET_ERROR = error.mutate(() => null)`reset-error`;
const CURRENT_QUESTION = sliding().exportAs('step')`step`;
export const IS_COMPLETED = sliding()`is-completed`;
export const START_OVER = fixed()`start-over`;

listen(ANSWER, RESET_ERROR);
listen(
  [questions, currentStep],
  ([Qs, step]) => {
    sput(CURRENT_QUESTION, Qs[step]);
    sput(IS_COMPLETED, Qs.length - 1 === step);
  },
  { initialCall: true }
);
listen(START_OVER, () => {
  sput(RESET_QUESTIONS);
  sput(RESET_CURRENT_STEP);
  sput(RESET_ERROR);
});

register('error', error);
