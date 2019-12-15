/* eslint-disable react/prop-types */
import React from 'react';
import ReactDOM from 'react-dom';
import riew from 'riew/react';
import { sput } from 'riew';

import './Data';
import List from './List';
import Footer from './Footer';
import {
  ENTER,
  ALL,
  ACTIVE,
  COMPLETED,
  TOGGLE_TODO,
  NEW_TODO,
  DELETE_TODO,
  EDIT_TODO,
  UPDATE_TODO,
  FILTER_CLEAR_COMPLETED
} from './constants';

const routine = function * ({ render, state }) {
  let filter = state(ALL);

  render({
    filter,
    viewAll: () => sput(filter.WRITE, ALL),
    viewActive: () => sput(filter.WRITE, ACTIVE),
    viewCompleted: () => sput(filter.WRITE, COMPLETED),
    toggle: idx => sput(TOGGLE_TODO, idx),
    newTodo: payload => sput(NEW_TODO, payload),
    deleteTodo: idx => sput(DELETE_TODO, idx),
    editingTodo: payload => sput(EDIT_TODO, payload),
    updateTodo: payload => sput(UPDATE_TODO, payload),
    clearCompleted: () => sput(FILTER_CLEAR_COMPLETED)
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
