import React from 'react';
import ReactDOM from 'react-dom';
import { routine, connect, put } from 'rine';

import List from './List';
import Footer from './Footer';
import { getInitialTodosData, saveTodosData, reducer } from './Data';
import {
  TOGGLE,
  ENTER,
  NEW_TODO,
  DELETE,
  EDIT,
  UPDATE,
  ALL,
  ACTIVE,
  COMPLETED,
  CLEAR_COMPLETED,
  CHANGE_FILTER
} from './constants';

const App = routine(function App({ render, state }) {
  const todos = state(getInitialTodosData(), reducer);
  const filter = state(ALL, (current, action) => {
    if (action.type === CHANGE_FILTER) {
      return action.payload;
    }
    return current;
  });

  connect({ todos }, ({ todos }) => {
    saveTodosData(todos);
    render({ todos });
  });
  connect({ filter }, render);

}, ({ todos, filter }) => (
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
              put(NEW_TODO, e.target.value);
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
          onToggle={ index => put(TOGGLE, index) }
          onDelete={ index => put(DELETE, index) }
          onEdit={ index => put(EDIT, { index, value: true }) }
          onUpdate={ (index, label) => put(UPDATE, { index, label }) }
          onUpdateCancel={ index => put(EDIT, { index, value: false }) } />
      </section>
        <Footer
          todos={ todos }
          filter={ filter }
          all={ () => put(CHANGE_FILTER, ALL) }
          active={ () => put(CHANGE_FILTER, ACTIVE) }
          completed={ () => put(CHANGE_FILTER, COMPLETED) }
          clearCompleted={ () => put(CLEAR_COMPLETED) } />
    </section>
  </React.Fragment>
));

ReactDOM.render(<App />, document.querySelector('#container'));
