/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import riew from 'riew/react';

import List from './List';
import Footer from './Footer';
import { ToDo } from './Data';
import { ENTER, ALL, ACTIVE, COMPLETED } from './constants';

const routine = function ({ render, state, todos }) {
  let [ filter, changeFilter ] = state(ALL);

  render({
    filter,
    viewAll: () => changeFilter.put(ALL),
    viewActive: () => changeFilter.put(ACTIVE),
    viewCompleted: () => changeFilter.put(COMPLETED),
    toggle: todos.set((todos, payload) => {
      return todos.map((todo, i) => {
        if (i === payload) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
    }).put,
    newTodo: todos.set((todos, payload) => [ ...todos, ToDo(payload) ]).put,
    deleteTodo: todos.set((todos, payload) => todos.filter((todo, i) => i !== payload)).put,
    editingTodo: todos.set((todos, payload) => {
      return todos.map((todo, i) => {
        if (i === payload.index) {
          return {
            ...todo,
            editing: payload.value
          };
        }
        return todo;
      });
    }).put,
    updateTodo: todos.set((todos, payload) => {
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
    }).put,
    clearCompleted: todos.set(todos => {
      return todos.filter(todo => {
        return !todo.completed;
      });
    }).put
  });
};

const View = ({
  todos,
  filter,
  viewAll,
  viewActive,
  viewCompleted,
  toggle,
  newTodo,
  editingTodo,
  updateTodo,
  deleteTodo,
  clearCompleted
}) => (
  <React.Fragment>
    <section className='todoapp'>
      <header className='header'>
        <h1>todos</h1>
        <input
          className='new-todo'
          placeholder='What needs to be done?'
          autoFocus
          onKeyUp={ e => {
            if (e.keyCode === ENTER) {
              newTodo(e.target.value);
              e.target.value = '';
            }
          } }
        />
      </header>
      <section className='main'>
        <input id='toggle-all' className='toggle-all' type='checkbox' />
        <label htmlFor='toggle-all'>Mark all as complete</label>
        <List
          todos={ todos }
          filter={ filter }
          onToggle={ toggle }
          onDelete={ deleteTodo }
          onEdit={ index => editingTodo({ index, value: true }) }
          onUpdate={ (index, label) => updateTodo({ index, label }) }
          onUpdateCancel={ index => editingTodo({ index, value: false }) }
        />
      </section>
      <Footer
        todos={ todos }
        filter={ filter }
        all={ viewAll }
        active={ viewActive }
        completed={ viewCompleted }
        clearCompleted={ clearCompleted }
      />
    </section>
  </React.Fragment>
);

const App = riew(View, routine).with('todos');

ReactDOM.render(<App />, document.querySelector('#container'));
