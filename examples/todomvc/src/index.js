import React from 'react';
import ReactDOM from 'react-dom';
import { routine, System } from 'rine';

import List from './List';
import Footer from './Footer';
import { getInitialTodosData, saveTodosData, ToDo } from './Persist';
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

const App = routine(function App({ render, takeEvery, put }) {
  let todos = getInitialTodosData();
  const ListPartial = List({ todos, filter: ALL });
  const FooterPartial = Footer({ todos, filter: ListPartial.get().filter });

  takeEvery(TOGGLE, (index) => {
    todos[index].completed = !todos[index].completed;
    ListPartial.set({ todos });
    FooterPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(NEW_TODO, (label) => {
    todos.push(ToDo(label));
    ListPartial.set({ todos });
    FooterPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(DELETE, (index) => {
    todos = todos.filter((todo, i) => i !== index);
    ListPartial.set({ todos });
    FooterPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(EDIT, ({ index, value }) => {
    todos[index].editing = value;
    ListPartial.set({ todos });
    FooterPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(UPDATE, ({ index, label }) => {
    todos[index].label = label;
    todos[index].editing = false;
    ListPartial.set({ todos });
    FooterPartial.set({ todos });
    saveTodosData(todos);
  });

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

// setInterval(function () {
//   const controllers = System.debug().controllers;

//   console.log(Object.keys(controllers).map(id => {
//     return controllers[id].name;
//   }));
// }, 1000);
