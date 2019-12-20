![Riew logo](./assets/riew.jpg)

---

<h3 align="center">Reactive View</h3>

<p align="center"><b>Riew</b> is a reactive library that uses <a href="https://en.wikipedia.org/wiki/Communicating_sequential_processes">CSP</a>  concepts for managing data and application flow.</p>

---

**Inspiration**

- [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes)
- [core.async](https://github.com/clojure/core.async)
- [Go](https://golang.org/)
- [Redux](https://redux.js.org/) and [redux-saga](https://redux-saga.js.org/)
- [JS-CSP](https://github.com/js-csp/js-csp)

## Routines & channels

Imagine that you need to transfer messages between two entities in your system. They don't know about each other. With Riew you can use a _channel_ to connect and synchronize them. We can put and take messages from the channel and as long as your entities have access to it they'll be able to exchange data. Consider the following example:

```js
const ch = chan("MY_CHANNEL");

go(function * A() {
  const name = yield take(ch);
  yield put(ch, `Hey ${name}, how are you?`);
});
go(function * B() {
  yield put(ch, "Steve");
  console.log(yield take(ch));
});
```

We have two routines `A` and `B`. They start synchronously one after each other. However, `A` is blocked at the `yield take` statement because it wants to read from the channel `ch` but there is nothing inside. Then routine `B` puts `Steve` in there and routine `A` resumes. Now `B` is blocked because it tries to read from the same channel. `Steve` is already consumed by the other routine so we are again at the same situation. `B` waits till `A` puts `Hello Steve, how are you?`. At the end the `console.log` happens and we see the message in the console.

That's the basic idea behind [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes). We have channels that are used for communication and synchronization. By default the channel operations are blocking. Putting can't happen until there is someone to take and the opposite - taking can't happen until there is someone to put. This is the behavior of the standard non-buffered channel. We have couple of buffer types here in Riew and you can learn more about them below.

## Riews

The _riew_ is an object that has `mount`, `update` and `unmount` methods. We are creating a riew by providing a view functions and one or many routines. The routines get executed when we mount the riew and they receive a `render` method so we can send data to the view function.

```js
const ch = chan('MY_CHANNEL')
const view = function (props) {
  console.log(props);
}
function * A() {
  const name = yield take(ch);
  yield put(ch, `Hey ${ name }, how are you?`);
}
function * B({ render }) {
  yield put(ch, 'Steve');
  render({ message: yield take(ch) });
};

const r = riew(view, A, B);

r.mount();
```

This example prints out `{ message: "Hey Steve, how are you?" }` to the console. As we can see `B` routine waits till it receives the message formatted by routine `A` and sends it to the `view` function. This is one of the main ideas behind this library. To manage our views by using [go](https://golang.org/)-like routines.

There is a React extension bundled with the library so if you use React you'll never call `mount`, `update` or `unmount` by yourself. This is done by using React hooks internally.

## State

## Pubsub

## API
