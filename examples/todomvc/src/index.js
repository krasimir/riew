import React from 'react';
import ReactDOM from 'react-dom';
import { state } from 'rine';
import routine from 'rine/lib/react';

console.log(state);
console.log(routine);

// import List from './List';
// import Footer from './Footer';
// import {
//   saveTodosData,
//   toggle,
//   newTodo,
//   editingTodo,
//   updateTodo,
//   deleteTodo,
//   clearCompleted
// } from './Data';
// import {
//   ENTER,
//   ALL,
//   ACTIVE,
//   COMPLETED
// } from './constants';

// const App = rine(function App({ render, state, todos }) {
//   const filter = state(ALL);
//   const changeFilter = filter.mutation((current, payload) => payload);

//   connect({ todos }, ({ todos }) => {
//     saveTodosData(todos);
//     render({ todos });
//   });
//   connect({ filter }, render);
//   render({ changeFilter });
// }, ({ todos, filter, changeFilter }) => (
//   <React.Fragment>
//     <section className='todoapp'>
//       <header className='header'>
//         <h1>todos</h1>
//         <input
//           className='new-todo'
//           placeholder='What needs to be done?'
//           autoFocus
//           onKeyUp={ e => {
//             if (e.keyCode === ENTER) {
//               newTodo(e.target.value);
//               e.target.value = '';
//             }
//           }}/>
//       </header>
//       <section className='main'>
//         <input id='toggle-all' className='toggle-all' type='checkbox' />
//         <label htmlFor='toggle-all'>Mark all as complete</label>
//         <List
//           todos={ todos }
//           filter={ filter }
//           onToggle={ toggle }
//           onDelete={ deleteTodo }
//           onEdit={ (index) => editingTodo({ index, value: true }) }
//           onUpdate={ (index, label) => updateTodo({ index, label }) }
//           onUpdateCancel={ index => editingTodo({ index, value: false }) } />
//       </section>
//         <Footer
//           todos={ todos }
//           filter={ filter }
//           all={ () => changeFilter(ALL) }
//           active={ () => changeFilter(ACTIVE) }
//           completed={ () => changeFilter(COMPLETED) }
//           clearCompleted={ clearCompleted } />
//     </section>
//   </React.Fragment>
// ));

// App.inject('todos');

// ReactDOM.render(<App />, document.querySelector('#container'));
