import {
  TOGGLE,
  NEW_TODO,
  DELETE,
  EDIT,
  EDIT_TODO,
  CLEAR_COMPLETED
} from './Store';
import {
  FILTER_ALL,
  FILTER_ACTIVE,
  FILTER_COMPLETED
} from './';
import { useEffect } from '../../../lib';

const $ = (selector) => document.querySelector(selector);
const list = $('.todo-list');
const header = $('.header');

const ENTER = 13;
const ESC = 27;

export function FillContainer({ children }) {
  list.innerHTML = children();
}
export function Container({ onUserAction }) {
  useEffect(() => {
    list.addEventListener('click', (e) => {
      const todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-toggle')) {
        onUserAction(TOGGLE, todoIndex);
      } else if (e.target.hasAttribute('data-delete')) {
        onUserAction(DELETE, todoIndex);
      }
    });
    list.addEventListener('dblclick', (e) => {
      const todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-label')) {
        onUserAction(EDIT, todoIndex);
      }
    });
    list.addEventListener('focusout', (e) => {
      const todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-edit')) {
        onUserAction(EDIT_TODO, { index: todoIndex, label: e.target.value });
      }
    });
    list.addEventListener('keyup', (e) => {
      const todoIndex = parseInt(e.target.getAttribute('data-index'), 10);

      if (e.target.hasAttribute('data-edit') && e.keyCode === ENTER) {
        onUserAction(EDIT_TODO, { index: todoIndex, label: e.target.value });
      } else if (e.target.hasAttribute('data-edit') && e.keyCode === ESC) {
        onUserAction(EDIT, todoIndex);
      }
    });
    header.addEventListener('keyup', (e) => {
      if (e.target.hasAttribute('data-new') && e.keyCode === ENTER) {
        onUserAction(NEW_TODO, e.target.value);
        e.target.value = '';
      }
    });
  }, []);
}
export function FocusField({ index }) {
  const el = $(`.edit[data-index="${ index }"]`);

  if (el) {
    el.focus();
    el.selectionStart = el.selectionEnd = el.value.length;
  }
};
export function ProgressChecker({ todos }) {
  const completed = todos.filter(({ completed }) => completed).length;
  const itemsLeft = todos.length - completed;

  $('[data-count]').innerHTML = `
    <strong>${ itemsLeft }</strong> ${ itemsLeft > 1 || itemsLeft === 0 ? 'items' : 'item' } left
  `;
};
export function Footer({ onUserAction }) {
  useEffect(() => {
    $('[data-filter]').addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-all')) {
        onUserAction(FILTER_ALL);
      } else if (e.target.hasAttribute('data-active')) {
        onUserAction(FILTER_ACTIVE);
      } else if (e.target.hasAttribute('data-completed')) {
        onUserAction(FILTER_COMPLETED);
      }
    });
    $('[data-clear-completed]').addEventListener('click', () => {
      onUserAction(CLEAR_COMPLETED);
    });
  }, []);
};
export function FilterOptionsTabs({ filter }) {
  useEffect(() => {
    $('[data-all]').setAttribute('class', filter === FILTER_ALL ? 'selected' : '');
    $('[data-active]').setAttribute('class', filter === FILTER_ACTIVE ? 'selected' : '');
    $('[data-completed]').setAttribute('class', filter === FILTER_COMPLETED ? 'selected' : '');
  }, [ filter ]);
}
