import React from 'react';
import ReactDOM from 'react-dom';
import { routine, System, store, connect } from 'rine';

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
  const todos = store({ todos: getInitialTodosData() });
  const filter = store({ filter: ALL });
  const ListPartial = connect(List, todos, filter);
  const FooterPartial = connect(Footer, todos, filter);

  takeEvery(TOGGLE, (index) => {
    const t = todos.get().todos;

    t[index].completed = !t[index].completed;
    todos.set({ todos: t });
    saveTodosData(t);
  });
  takeEvery(NEW_TODO, (label) => {
    const t = todos.get().todos;

    t.push(ToDo(label));
    todos.set({ todos: t });
    saveTodosData(todos);
  });
  takeEvery(DELETE, (index) => {
    const t = todos.get().todos;

    t = t.filter((todo, i) => i !== index);
    todos.set({ todos: t });
    saveTodosData(t);
  });
  takeEvery(EDIT, ({ index, value }) => {
    const t = todos.get().todos;

    t[index].editing = value;
    todos.set({ todos: t });
    saveTodosData(t);
  });
  takeEvery(UPDATE, ({ index, label }) => {
    const t = todos.get().todos;

    t[index].label = label;
    t[index].editing = false;
    todos.set({ todos: t });
    saveTodosData(t);
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
