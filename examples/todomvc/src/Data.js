import { state, register } from 'rine';

export const ToDo = (label) => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo('Rine helps you handle side effects'),
  ToDo('Rine comes from "Routine"')
]);
const getInitialTodosData = () => {
  return JSON.parse(localStorage.getItem('todos') || initialValue);
};
const todos = state(getInitialTodosData());

export const saveTodosData = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};
export const toggle = todos.mutation((todos, payload) => {
  return todos.map((todo, i) => {
    if (i === payload) {
      return {
        ...todo,
        completed: !todo.completed
      };
    }
    return todo;
  });
});
export const newTodo = todos.mutation((todos, payload) => [ ...todos, ToDo(payload) ]);
export const deleteTodo = todos.mutation((todos, payload) => todos.filter((todo, i) => i !== payload));
export const editingTodo = todos.mutation((todos, payload) => {
  return todos.map((todo, i) => {
    if (i === payload.index) {
      return {
        ...todo,
        editing: payload.value
      };
    }
    return todo;
  });
});
export const updateTodo = todos.mutation((todos, payload) => {
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
});
export const clearCompleted = todos.mutation((todos) => {
  return todos.filter(todo => {
    return !todo.completed;
  });
});

register('todos', todos);
