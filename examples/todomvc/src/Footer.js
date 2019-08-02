import React from 'react';
import PropTypes from 'prop-types';
import { partial } from 'rine';
import { ALL, ACTIVE, COMPLETED } from './constants';

function Footer({ todos, filter, all, active, completed, clearCompleted }) {
  const incomplete = todos.filter(({ completed }) => !completed);
  const itemLeft = incomplete.length === 1 ?
    <React.Fragment><strong>1</strong> item left</React.Fragment> :
    <React.Fragment><strong>{ incomplete.length }</strong> items left</React.Fragment>;
  const selectedIf = value => filter === value ? 'selected' : '';

  return (
    <footer className='footer'>
      <span className='todo-count'>{ itemLeft }</span>
      <ul className='filters'>
        <li>
          <a href='#/' onClick={ all } className={ selectedIf(ALL) }>All</a>
        </li>
        <li>
          <a href='#/active' onClick={ active } className={ selectedIf(ACTIVE) }>Active</a>
        </li>
        <li>
          <a href='#/completed' onClick={ completed } className={ selectedIf(COMPLETED) }>Completed</a>
        </li>
      </ul>
      <button className='clear-completed' onClick={ clearCompleted }>Clear completed</button>
    </footer>
  );
}

Footer.propTypes = {
  todos: PropTypes.array.isRequired,
  all: PropTypes.func.isRequired,
  active: PropTypes.func.isRequired,
  completed: PropTypes.func.isRequired,
  clearCompleted: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired
};

export default partial(Footer);
