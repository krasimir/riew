/* eslint-disable react/prop-types */
/** @jsx A */
import { useReducer, usePubSub, useEffect } from '../../../lib';

export const TOGGLE = 'TOGGLE';
export const NEW_TODO = 'NEW_TODO';
export const DELETE = 'DELETE';
export const EDIT = 'EDIT';
export const EDIT_TODO = 'EDIT_TODO';
export const CLEAR_COMPLETED = 'CLEAR_COMPLETED';

const toggle = (todoIndex) => ({ type: TOGGLE, todoIndex });
const deleteTodo = (todoIndex) => ({ type: DELETE, todoIndex });
const newTodo = (label) => ({ type: NEW_TODO, label });
const edit = (todoIndex) => ({ type: EDIT, todoIndex });
const editToDo = ({ index, label }) => ({ type: EDIT_TODO, index, label });
const clearCompleted = () => ({ type: CLEAR_COMPLETED });

export const ToDo = ({ label }) => ({ label, completed: false, editing: false });

const reducer = function (todos, action) {
  switch (action.type) {
    case TOGGLE:
      return todos.map((todo, index) => {
        if (index === action.todoIndex) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
    case EDIT:
      return todos.map((todo, index) => {
        if (index === action.todoIndex) {
          return {
            ...todo,
            editing: !todo.editing
          };
        }
        return {
          ...todo,
          editing: false
        };
      });
    case EDIT_TODO:
      return todos.map((todo, index) => {
        if (index === action.index) {
          return {
            ...todo,
            label: action.label,
            editing: false
          };
        }
        return todo;
      });
    case NEW_TODO:
      return [ ...todos, ToDo({ label: action.label }) ];
    case DELETE:
      return todos.filter((todo, index) => index !== action.todoIndex);
    case CLEAR_COMPLETED:
      return todos.filter((todo) => !todo.completed);
    default:
      return todos;
  }
};

export default function Store({ initialValue, children }) {
  const [ todos, dispatch ] = useReducer(reducer, initialValue);
  const { subscribe } = usePubSub();

  useEffect(() => {
    subscribe(TOGGLE, (todoIndex) => dispatch(toggle(todoIndex)));
    subscribe(NEW_TODO, (label) => dispatch(newTodo(label)));
    subscribe(DELETE, (todoIndex) => dispatch(deleteTodo(todoIndex)));
    subscribe(EDIT, (label) => dispatch(edit(label)));
    subscribe(EDIT_TODO, (payload) => dispatch(editToDo(payload)));
    subscribe(CLEAR_COMPLETED, () => dispatch(clearCompleted()));
  }, []);

  children({ todos: todos() });
}
