import { state } from 'riew';

export const ToDo = (label) => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo('Riew helps you handle side effects'),
  ToDo('Riew comes from "Routine"')
]);
const saveTodosData = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const todos = state(JSON.parse(localStorage.getItem('todos') || initialValue));

todos.stream.pipe(saveTodosData);
