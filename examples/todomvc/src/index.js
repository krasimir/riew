import React from 'react';
import ReactDOM from 'react-dom';
import { routine, partial, System } from 'rine';

import List from './List';
import { getInitialTodosData, saveTodosData, ToDo } from './Persist';
import { TOGGLE, ENTER, NEW_TODO, DELETE, EDIT, UPDATE } from './constants';

const App = routine(({ render, takeEvery, put }) => {
  let todos = getInitialTodosData();
  const ListPartial = partial(List, { todos });

  takeEvery(TOGGLE, (index) => {
    todos[index].completed = !todos[index].completed;
    ListPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(NEW_TODO, (label) => {
    todos.push(ToDo(label));
    ListPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(DELETE, (index) => {
    todos = todos.filter((todo, i) => i !== index);
    ListPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(EDIT, ({ index, value }) => {
    console.log('EDIT');
    todos[index].editing = value;
    ListPartial.set({ todos });
    saveTodosData(todos);
  });
  takeEvery(UPDATE, ({ index, label }) => {
    console.log('UPDATE');
    todos[index].label = label;
    todos[index].editing = false;
    ListPartial.set({ todos });
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
        <footer className='footer'>
          <span className='todo-count'><strong>0</strong> item left</span>
          <ul className='filters'>
            <li>
              <a href='#/'>All</a>
            </li>
            <li>
              <a href='#/active'>Active</a>
            </li>
            <li>
              <a href='#/completed'>Completed</a>
            </li>
          </ul>
          <button className='clear-completed'>Clear completed</button>
        </footer>
      </section>
      <footer className='info'>
        Rine
      </footer>
    </React.Fragment>
  );
});

ReactDOM.render(<App />, document.querySelector('#container'));

setInterval(function () {
  console.log(Object.keys(System.debug().controllers).length);
}, 1000);
