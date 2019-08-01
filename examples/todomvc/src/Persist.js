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
