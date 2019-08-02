import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { partial } from 'rine';

import { ESC, ENTER, ALL, COMPLETED, ACTIVE } from './constants';

const EditTodo = ({ index, todo, onUpdateCancel, onUpdate }) => {
  const inputEl = useRef(null);

  useEffect(() => {
    if (todo.editing) {
      inputEl.current.focus();
    }
  }, [ todo.editing ]);

  return (
    <input
      ref={ inputEl }
      className='edit'
      defaultValue={ todo.label }
      data-label={ todo.label }
      onBlur={ (e) => onUpdate(index, e.target.value) }
      onKeyUp={ e => {
        if (e.keyCode === ESC) {
          e.target.value = todo.label;
          onUpdateCancel(index);
        } else if (e.keyCode === ENTER) {
          onUpdate(index, e.target.value);
        }
      }} />
  );
};

EditTodo.propTypes = {
  index: PropTypes.number.isRequired,
  todo: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpdateCancel: PropTypes.func.isRequired
};

function List({
  todos,
  filter,
  onToggle,
  onDelete,
  onEdit,
  onUpdate,
  onUpdateCancel
}) {
  return (
    <ul className='todo-list'>
      {
        todos.filter(todo => {
          if (filter === ALL) return true;
          if (filter === COMPLETED) return todo.completed;
          if (filter === ACTIVE) return !todo.completed;
          return true;
        }).map((todo, i) => {
          const liClass = todo.editing ? 'editing' : (todo.completed ? 'completed' : '');

          return (
            <li className={ liClass } key={ i }>
              <div className='view'>
                <input
                  className='toggle'
                  type='checkbox'
                  checked={ todo.completed }
                  onChange={ () => onToggle(i) }/>
                <label data-index='${ i }' onDoubleClick={ () => onEdit(i) }>{ todo.label }</label>
                <button className='destroy' onClick={ () => onDelete(i) }></button>
              </div>
              <EditTodo
                key={ todo.label }
                index={ i }
                todo={ todo }
                onUpdate={ onUpdate }
                onUpdateCancel={ onUpdateCancel }
                />
            </li>
          );
        })
      }
    </ul>
  );
};

List.propTypes = {
  todos: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onUpdateCancel: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired
};

export default partial(List);
