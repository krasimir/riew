import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
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
  CLEAR_COMPLETED
} from './constants';

const App = routine(function App({ render, state }) {
  const todos = state(getInitialTodosData(), reducer);
  const filter = state(ALL);
  const ListPartial = connect(List, { todos, filter });
  const FooterPartial = connect(Footer, { todos, filter });

  todos.subscribe(saveTodosData);

  render({
    list: (
      <ListPartial
        onToggle={ index => put(TOGGLE, index) }
        onDelete={ index => put(DELETE, index) }
        onEdit={ index => put(EDIT, { index, value: true }) }
        onUpdate={ (index, label) => put(UPDATE, { index, label }) }
        onUpdateCancel={ index => put(EDIT, { index, value: false }) } />
    ),
    footer: (
      <FooterPartial
        all={ () => filter.set(ALL) }
        active={ () => filter.set(ACTIVE) }
        completed={ () => filter.set(COMPLETED) }
        clearCompleted={ () => put(CLEAR_COMPLETED) } />
    )
  });
}, ({ list, footer }) => (
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
        { list }
      </section>
      { footer }
    </section>
  </React.Fragment>
));

ReactDOM.render(<App />, document.querySelector('#container'));
