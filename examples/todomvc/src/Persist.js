export const ToDo = ({ label }) => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo({ label: 'ActML is using JSX' }),
  ToDo({ label: 'It is like React but not for rendering' })
]);

export const useLocalStorage = () => {
  return JSON.parse(localStorage.getItem('todos') || initialValue);
};
export const usePersist = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
