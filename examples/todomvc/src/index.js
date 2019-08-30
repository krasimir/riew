/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import riew from 'riew/react';

import List from './List';
import Footer from './Footer';
import { todos, ToDo } from './Data';
import { ENTER, ALL, ACTIVE, COMPLETED } from './constants';

const controller = function ({ render, filter, todos }) {
  console.log(filter);
  render({
    viewAll: filter.mutate(() => ALL),
    viewActive: filter.mutate(() => ACTIVE),
    viewCompleted: filter.mutate(() => COMPLETED),
    toggle: todos.mutate((todos, payload) => {
      return todos.map((todo, i) => {
        if (i === payload) {
          return {
            ...todo,
            completed: !todo.completed
          };
        }
        return todo;
      });
    }),
    newTodo: todos.mutate((todos, payload) => [ ...todos, ToDo(payload) ]),
    deleteTodo: todos.mutate((todos, payload) => todos.filter((todo, i) => i !== payload)),
    editingTodo: todos.mutate((todos, payload) => {
      return todos.map((todo, i) => {
        if (i === payload.index) {
          return {
            ...todo,
            editing: payload.value
          };
        }
        return todo;
      });
    }),
    updateTodo: todos.mutate((todos, payload) => {
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
    }),
    clearCompleted: todos.mutate((todos) => {
      return todos.filter(todo => {
        return !todo.completed;
      });
    })
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
          }}/>
      </header>
      <section className='main'>
        <input id='toggle-all' className='toggle-all' type='checkbox' />
        <label htmlFor='toggle-all'>Mark all as complete</label>
        <List
          todos={ todos }
          filter={ filter }
          onToggle={ toggle }
          onDelete={ deleteTodo }
          onEdit={ (index) => editingTodo({ index, value: true }) }
          onUpdate={ (index, label) => updateTodo({ index, label }) }
          onUpdateCancel={ index => editingTodo({ index, value: false }) } />
      </section>
        <Footer
          todos={ todos }
          filter={ filter }
          all={ viewAll }
          active={ viewActive }
          completed={ viewCompleted }
          clearCompleted={ clearCompleted } />
    </section>
  </React.Fragment>
);

const App = riew(View, controller).with({ $filter: ALL, todos });

ReactDOM.render(<App />, document.querySelector('#container'));
