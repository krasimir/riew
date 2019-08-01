import React from 'react';

export default function List() {
  const todos = [
    { completed: false, label: 'foo', editing: false }
  ];

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
                  data-index='${ i }'
                  data-toggle
                  checked={ todo.completed } />
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
}
