import React from 'react';
import ReactDOM from 'react-dom';

import List from './List';

function App() {
  return (
    <React.Fragment>
      <section className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input className='new-todo' placeholder='What needs to be done?' autoFocus />
        </header>
        <section className='main'>
          <input id='toggle-all' className='toggle-all' type='checkbox' />
          <label htmlFor='toggle-all'>Mark all as complete</label>
          <List />
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
}

ReactDOM.render(<App />, document.querySelector('#container'));