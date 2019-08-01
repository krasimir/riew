import React from 'react';
import ReactDOM from 'react-dom';
import { Routine, Partial } from 'rine';

import List from './List';
import { getInitialTodosData, setTodosData } from './Persist';
import { TOGGLE } from './constants';

const App = Routine(({ render, takeEvery, put }) => {
  const todos = getInitialTodosData();
  const TodosList = Partial(todos => (
    <List
      todos={ todos }
      onToggle={ index => put(TOGGLE, index) } />
  ), todos);

  takeEvery(TOGGLE, (index) => {
    todos[index].completed = !todos[index].completed;
    TodosList.set(todos);
    setTodosData(todos);
  });

  render(
    <React.Fragment>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input className='new-todo' placeholder='What needs to be done?' autoFocus />
        </header>
        <section className='main'>
          <input id='toggle-all' className='toggle-all' type='checkbox' />
          <label htmlFor='toggle-all'>Mark all as complete</label>
          <TodosList />
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
