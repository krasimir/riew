import { state } from 'rine';

export const ToDo = (label) => ({ label, completed: false, editing: false });

const initialValue = JSON.stringify([
  ToDo('Rine helps you handle side effects'),
  ToDo('Rine comes from "Routine"')
]);
const saveTodosData = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const todos = state(JSON.parse(localStorage.getItem('todos') || initialValue));

todos.onUpdate().pipe(saveTodosData);

export const toggle = todos.mutate((todos, payload) => {
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
export const newTodo = todos.mutate((todos, payload) => [ ...todos, ToDo(payload) ]);
export const deleteTodo = todos.mutate((todos, payload) => todos.filter((todo, i) => i !== payload));
export const editingTodo = todos.mutate((todos, payload) => {
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
export const updateTodo = todos.mutate((todos, payload) => {
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
export const clearCompleted = todos.mutate((todos) => {
  return todos.filter(todo => {
    return !todo.completed;
  });
});
