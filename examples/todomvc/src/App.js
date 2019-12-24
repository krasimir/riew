import React from "react";

import List from "./List";
import Footer from "./Footer";

import { ENTER } from "./constants";

export default function App({
  filter,
  viewAll,
  viewActive,
  viewCompleted,
  toggle,
  newTodo,
  editingTodo,
  updateTodo,
  deleteTodo,
  clearCompleted
}) {
  return (
    <React.Fragment>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyUp={e => {
              if (e.keyCode === ENTER) {
                newTodo(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </header>
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <List
            filter={filter}
            onToggle={toggle}
            onDelete={deleteTodo}
            onEdit={index => editingTodo({ index, value: true })}
            onUpdate={(index, label) => updateTodo({ index, label })}
            onUpdateCancel={index => editingTodo({ index, value: false })}
          />
        </section>
        <Footer
          filter={filter}
          all={viewAll}
          active={viewActive}
          completed={viewCompleted}
          clearCompleted={clearCompleted}
        />
      </section>
    </React.Fragment>
  );
}
