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

We have two routines `A` and `B`. They start at synchronously one after each other. However, `A` is blocked at the `yield take` statement because it wants to read from the channel `ch` but there is nothing inside (yet). Then routine `B` puts `Steve` in there and routine `A` resumes. Now `B` is blocked because it tries to read from the channel but `Steve` is already consumed by the other routine. It waits till `A` puts `Hello Steve, how are you?`. At the end the `console.log` happens and we see the message in the console.

## Riews

## State

## Pubsub

## React

## API
