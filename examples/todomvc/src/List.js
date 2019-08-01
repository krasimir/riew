import React from 'react';
import PropTypes from 'prop-types';
import { routine } from 'rine';

import { ESC, ENTER } from './constants';

const EditTodo = routine(function EditTodo({ render }) {
  render(({ index, todo, onUpdateCancel, onUpdate }) => <input
    className='edit'
    defaultValue={ todo.label }
    onBlur={ (e) => onUpdate(index, e.target.value) }
    onKeyUp={ e => {
      if (e.keyCode === ESC) {
        e.target.value = todo.label;
        onUpdateCancel(index);
      } else if (e.keyCode === ENTER) {
        onUpdate(index, e.target.value);
      }
    }} />);
});

export default function List({
  todos, onToggle, onDelete, onEdit, onUpdate, onUpdateCancel
}) {
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
                <label data-index='${ i }' onDoubleClick={ () => onEdit(i) }>{ todo.label }</label>
                <button className='destroy' onClick={ () => onDelete(i) }></button>
              </div>
              <EditTodo
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
  onUpdateCancel: PropTypes.func.isRequired
};
