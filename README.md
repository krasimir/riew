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

Imagine that you need to transfer messages between two entities in your system. They don't know about each other but they can use a _channel_. We can put and take messages from the channel and as long as we have access to it we are able to communicate.

```js
const ch = chan("MY_CHANNEL");

go(function * () {
  const name = yield take(ch);
  yield put(ch, `Hey ${name}, how are you?`);
});
go(function * () {
  yield put(ch, "Steve");
  console.log(yield take(ch));
});
```

## Riews

## State

## Pubsub

## React

## API
