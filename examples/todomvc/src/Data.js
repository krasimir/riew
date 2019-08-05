import {
  TOGGLE,
  NEW_TODO,
  DELETE,
  EDIT,
  UPDATE
} from './constants';

export const ToDo = (label) => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo('Rine helps you handle side effects'),
  ToDo('Rine comes from "Routine"')
]);

export const getInitialTodosData = () => {
  return JSON.parse(localStorage.getItem('todos') || initialValue);
};
export const saveTodosData = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
export const reducer = function (todos, { type, payload }) {
  switch (type) {
    case TOGGLE:
      return todos.map((todo, i) => {
        if (i === payload) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
    case NEW_TODO:
      return [ ...todos, ToDo(payload) ];
    case DELETE:
      return todos.filter((todo, i) => i !== payload);
    case EDIT:
      return todos.map((todo, i) => {
        if (i === payload.index) {
          return {
            ...todo,
            editing: payload.value
          };
        }
        return todo;
      });
    case UPDATE:
      return todos.map((todo, i) => {
        if (i === payload.index) {
          return {
            ...todo,
            label: payload.label,
            editing: false
          };
        }
        return todo;
      });
  }
  return todos;
}
