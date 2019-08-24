import React from 'react';
import ReactDOM from 'react-dom';
import routine from 'rine/react';

import List from './List';
import Footer from './Footer';
import {
  toggle,
  newTodo,
  editingTodo,
  updateTodo,
  deleteTodo,
  clearCompleted,
  todos
} from './Data';
import {
  ENTER,
  ALL,
  ACTIVE,
  COMPLETED
} from './constants';

const App = routine(function App({ render, state }) {
  const filter = state(ALL);
  const viewAll = filter.mutate(() => ALL);
  const viewActive = filter.mutate(() => ACTIVE);
  const viewCompleted = filter.mutate(() => COMPLETED);

  todos.stream.mapToKey('todos').pipe(render);
  filter.stream.mapToKey('filter').pipe(render);

  render({
    viewAll,
    viewActive,
    viewCompleted,
    todos: todos.get(),
    filter: filter.get()
  });
}, ({ todos, filter, viewAll, viewActive, viewCompleted }) => (
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
              newTodo(e.target.value);
              e.target.value = '';
            }
          }}/>
      </header>
      <section className='main'>
        <input id='toggle-all' className='toggle-all' type='checkbox' />
        <label htmlFor='toggle-all'>Mark all as complete</label>
        <List
          todos={ todos }
          filter={ filter }
          onToggle={ toggle }
          onDelete={ deleteTodo }
          onEdit={ (index) => editingTodo({ index, value: true }) }
          onUpdate={ (index, label) => updateTodo({ index, label }) }
          onUpdateCancel={ index => editingTodo({ index, value: false }) } />
      </section>
        <Footer
          todos={ todos }
          filter={ filter }
          all={ viewAll }
          active={ viewActive }
          completed={ viewCompleted }
          clearCompleted={ clearCompleted } />
    </section>
  </React.Fragment>
));

ReactDOM.render(<App />, document.querySelector('#container'));
