import { useState } from '../../../lib';

import { ToDo } from './Store';

const initialValue = JSON.stringify([
  ToDo({ label: 'ActML is using JSX' }),
  ToDo({ label: 'It is like React but not for rendering' })
]);

export const useLocalStorage = () => {
  const [ getData ] = useState(JSON.parse(localStorage.getItem('todos') || initialValue));

  return getData();
};
export const Persist = ({ todos }) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
