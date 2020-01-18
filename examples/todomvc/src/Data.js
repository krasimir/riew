/* eslint-disable no-shadow */
import { state, register, listen } from 'riew';

export const ToDo = label => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo('Riew is reactive view architecture'),
  ToDo('Riew plays well with React'),
  ToDo('Riew follows some of the ideas of CSP'),
]);
const saveTodosData = todos => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const todos = state(
  JSON.parse(localStorage.getItem('todos') || initialValue)
);

export const TOGGLE_TODO = todos.mutate((todos, payload) =>
  todos.map((todo, i) => {
    if (i === payload) {
      return {
        ...todo,
        completed: !todo.completed,
      };
    }
    return todo;
  })
);
export const NEW_TODO = todos.mutate((todos, payload) => [
  ...todos,
  ToDo(payload),
]);
export const DELETE_TODO = todos.mutate((todos, payload) =>
  todos.filter((todo, i) => i !== payload)
);
export const EDIT_TODO = todos.mutate((todos, payload) =>
  todos.map((todo, i) => {
    if (i === payload.index) {
      return {
        ...todo,
        editing: payload.value,
      };
    }
    return todo;
  })
);
export const UPDATE_TODO = todos.mutate((todos, payload) =>
  todos.map((todo, i) => {
    if (i === payload.index) {
      return {
        ...todo,
        label: payload.label,
        editing: false,
      };
    }
    return todo;
  })
);
export const FILTER_CLEAR_COMPLETED = todos.mutate(todos =>
  todos.filter(todo => !todo.completed)
);

register('todos', todos);

listen(todos, saveTodosData);
