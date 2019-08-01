import React from 'react';
import PropTypes from 'prop-types';

export default function List({ todos, onToggle }) {
  return (
    <ul className='todo-list'>
      {
        todos.map((todo, i) => {
          const liClass = todo.editing ? 'editing' : (todo.completed ? 'completed' : '');

          return (
            <li className={ liClass } key={ i }>
              <div className='view'>
                <input
                  className='toggle'
                  type='checkbox'
                  checked={ todo.completed }
                  onChange={ () => onToggle(i) }/>
                <label data-index='${ i }' data-label>{ todo.label }</label>
                <button
                  className='destroy'
                  data-index='${ i }'
                  data-delete></button>
              </div>
              <input className='edit' value='${ todo.label }' data-index='${ i }' data-edit />
            </li>
          );
        })
      }
    </ul>
  );
};

List.propTypes = {
  todos: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired
};
