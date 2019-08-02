import React from 'react';
import PropTypes from 'prop-types';
import { partial } from 'rine';

function Footer({ todos, all, active, completed, clearCompleted }) {
  const incomplete = todos.filter(({ completed }) => !completed);
  const itemLeft = incomplete.length === 1 ?
    <React.Fragment><strong>1</strong> item left</React.Fragment> :
    <React.Fragment><strong>{ incomplete.length }</strong> items left</React.Fragment>;

  return (
    <footer className='footer'>
      <span className='todo-count'>{ itemLeft }</span>
      <ul className='filters'>
        <li>
          <a href='#/' onClick={ all }>All</a>
        </li>
        <li>
          <a href='#/active' onClick={ active }>Active</a>
        </li>
        <li>
          <a href='#/completed' onClick={ completed }>Completed</a>
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
  clearCompleted: PropTypes.func.isRequired
};

export default partial(Footer);
