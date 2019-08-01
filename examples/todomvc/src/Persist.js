export const ToDo = ({ label }) => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo({ label: 'Rine helps you handle side effects' }),
  ToDo({ label: 'Rine comes from "Routine"' })
]);

export const getInitialTodosData = () => {
  return JSON.parse(localStorage.getItem('todos') || initialValue);
};
export const setTodosData = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
