import React from 'react';
import ReactDOM from 'react-dom';
import { routine, state, put, connect } from 'rine';

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
  COMPLETED
} from './constants';

const App = routine(function * App(render) {
  const todos = state(getInitialTodosData(), reducer);
  const filter = state(ALL);
  const ListPartial = connect(List, { todos, filter });
  const FooterPartial = connect(Footer, { todos, filter });

  todos.subscribe(saveTodosData);

  render(
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
          <ListPartial
            onToggle={ index => put(TOGGLE, index) }
            onDelete={ index => put(DELETE, index) }
            onEdit={ index => put(EDIT, { index, value: true }) }
            onUpdate={ (index, label) => put(UPDATE, { index, label }) }
            onUpdateCancel={ index => put(EDIT, { index, value: false }) } />
        </section>
        <FooterPartial
          all={ () => {
            ListPartial.set({ filter: ALL });
            FooterPartial.set({ filter: ALL });
          } }
          active={ () => {
            ListPartial.set({ filter: ACTIVE });
            FooterPartial.set({ filter: ACTIVE });
          } }
          completed={ () => {
            ListPartial.set({ filter: COMPLETED });
            FooterPartial.set({ filter: COMPLETED });
          } }
          clearCompleted={ () => {} } />
      </section>
    </React.Fragment>
  );
});

ReactDOM.render(<App />, document.querySelector('#container'));
