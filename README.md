![Riew logo](./assets/riew.jpg)

---

<h3 align="center">Reactive View</h3>

<p align="center"><b>Riew</b> is a reactive library that uses <a href="https://en.wikipedia.org/wiki/Communicating_sequential_processes">CSP</a>  concepts for managing data and application flow.</p>

---

* Inspiration - [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes), [core.async](https://github.com/clojure/core.async), [Go](https://golang.org/), [Redux](https://redux.js.org/) and [redux-saga](https://redux-saga.js.org/), [JS-CSP](https://github.com/js-csp/js-csp) 
* Core concepts - [Routines & channels](https://github.com/krasimir/riew#routines--channels), [Riews](https://github.com/krasimir/riew#riews), [State](https://github.com/krasimir/riew#state), [Pubsub](https://github.com/krasimir/riew#pubsub)
* [Playground](https://poet.codes/e/QMPvK8DM2s7#App.js)

## Concepts

### Routines & channels

Imagine that you need to transfer messages between two entities in your system. They don't know about each other. With Riew you can use a _channel_ to connect and synchronize them. We can put and take messages from the channel. Consider the following example:

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

We have two generator functions (routines) `A` and `B`. They start synchronously one after each other. However, `A` is paused (blocked) at the `yield take` statement because it wants to read from the channel `ch` but there is nothing inside. Then routine `B` puts `Steve` and routine `A` resumes back. Now `B` is blocked because it tries to read from the same channel. `Steve` is already consumed by the other routine so we are again at the same blocking situation. `B` waits till `A` puts `Hello Steve, how are you?`. At the end the log happens and we see the message into the console.

This is the basic idea behind [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes). We have channels that are used for communication and synchronization. By default the channel operations are blocking. Putting can't happen until there is someone to take and the opposite - taking can't happen until there is someone to put. This is the behavior of the standard non-buffered channel. We have couple of other buffer types here in Riew to accommodate the needs that we have.

The _channel_ in Riew has an unique ID. In one application there may be only one channel with a given ID. Every time when we want to create/use a channel we may pass the channel instance itself or just its ID. We may even skip the creation of the channel and simply use an ID. Riew will create the channel for us the first time it is used. The snippet above may be translated to the following:

```js
go(function * () {
  const name = yield take('MY_CHANNEL');
  yield put('MY_CHANNEL', `Hey ${ name }, how are you?`);
});
go(function * () {
  yield put('MY_CHANNEL', 'Steve');
  console.log(yield take('MY_CHANNEL'));
});
```

This is intentional and it's by design. It becomes much easier to use a channel from any point of the application because we just need to know the ID.

As for the routines, we may `yield` all sort of things. We may `put`, `take`, `sleep` but we may also `yield` a promise. Then Riew will wait till the promise is resolved and will resume the generator. We may even use the `call` helper to run another routine. 😮

### Riews

The _riew_ is a combination between view function and routine functions. It's materialized into an object that has `mount`, `update` and `unmount` methods. The routines get executed when we mount the riew. They receive a `render` method so we can send data to the view function.

```js
const view = function (props) {
  console.log(props);
}
function * A() {
  const name = yield take('MY_CHANNEL');
  yield put('MY_CHANNEL', `Hey ${ name }, how are you?`);
}
function * B({ render }) {
  yield put('MY_CHANNEL', 'Steve');
  render({ message: yield take('MY_CHANNEL') });
};

const r = riew(view, A, B);

r.mount();
```

This example prints out an object `{ message: "Hey Steve, how are you?" }`. As we know from the previous section, `B` routine waits till it receives the message formatted by routine `A`. It sends it to the `view` function by using the `render` helper. This code sample illustrates the core concept behind this library - keep the view pure and distribute the business logic across routines.

We may directly send a channel to the `render` function and whatever we `put` inside will reach the view. For example:

```js
const view = function (props) {
  console.log(props);
}
function * A({ render }) {
  const ch = chan();
  render({ name: ch })
  yield put(ch, 'Martin');
}

const r = riew(view, A);

r.mount();
```

The result here is `{ name: 'Martin' }`.

_(There is a React extension bundled within the library so if you use React you'll probably never call `mount`, `update` or `unmount` manually. This is done by using React hooks internally.)_

### State

In the original [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes) there is no concept of a _state_. At least not in the same way as we use it in JavaScript today. For us _state_ is a value that persist across time. It can be accessed and changed but is always available. The channels can keep values but they are consumed at some point. Or in other words taken and don't exists as such on the channels anymore.

Riew brings the idea of a state by defining a value that is outside the channels. It can be however accessed and modified by using channels. Imagine the state as a black box with two channels - one for reading and one for writing. Riew extends this idea and allows the definition of many read channels called _selectors_ and many write channels called _mutators_. Let's see the following example:

```js
// A state which value is an empty array.
const users = state([]);

// Channel for updating the state value.
users.mutate('ADD', function reducer(currentUsers, newUser) {
  return [ ...currentUsers, newUser ];
});
// Channel for reading the state value.
users.select('GET_USERS', function mapping(users) {
  return users.map(({ name }) => name).join(', ');
})

go(function * A() {
  yield put('ADD', { name: 'Steve', age: 24 });
  yield put('ADD', { name: 'Ana', age: 25 });
  yield put('ADD', { name: 'Peter', age: 22 });
  console.log(yield take('GET_USERS')); // Steve, Ana, Peter
});
```

The _mutator_ `ADD` accepts a channel (instance or ID) and a `reducer` function. That function is called against the current state value together with the item which is put into the channel. The _selector_ `GET_USERS` defines a channel which we can always read from and the value is whatever the `mapping` function returns. At the end the routine `A` adds `put`s three users and `take`s their names.

This mechanics open space for a lot of patterns. Imagine how your user adds elements to a table and you have a dedicated channel for this operation. Suddenly you have a requirement to count the number of the newly added elements. Sure you know the total number of elements in the table but not how many are just recently added. With Riew you can just hook to the same channel that adds elements to the table and count.

```js
const table = state([]);
table.mutate('ADD', (elements, newElement) => {
  return [ ...elements, newElement ];
});

const counter = state(0);
counter.mutate('ADD', (n) => n + 1); // We are hooking to the same channel `ADD`.

go(function * A() {
  yield put('ADD', 20);
  yield put('ADD', 30);
  yield put('ADD', 12);
  console.log(yield take(table)); // 20,30,12
  console.log(yield take(counter)); // 3
});
```

Another helpful pattern is to use a routine as a mutator. And because the routine may be asynchronous you may block until the it's done. Consider the trivial case where we have to get data from remote endpoint and show it to the user.

```js
const cat = state(null);
cat.mutate('KITTY_PLEASE', function * () {
  const { file } = yield fetch('https://aws.random.cat/meow').then(res => res.json());
  return file;
});

go(function * A() {
  console.log('I want a kitty!');
  yield put('KITTY_PLEASE');
  console.log(`Here we go ${ yield take(cat) }`);
});
```

The routine `A` is blocked on the put to `KITTY_PLEASE`. Our mutator is picked up and makes a request to `https://aws.random.cat/meow`. Once it finishes it mutates the state and replaces `null` with a URL. Then our routine is resumed and we can print that URL.

```js
> I want a kitty.
> Here we go https://purr.objects-us-east-1.dream.io/i/W6jh8.jpg
```

Further more we can handle the request error inside the mutator and put something else in the `cat` state. Or we can hook to the same `KITTY_PLEASE` channel and do something else.

### Pubsub

The [pubsub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) pattern is widely used in JavaScript. There are tons of libraries that are using it and it's de-facto a standard these days. I (the author of this library) however think that this pattern doesn't play well with the [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes) architecture. I've made couple of tests and tried implementing it with pure CSP patterns but it simply doesn't work as expected. That's because in the pubsub pattern we have a broadcasting system. A system in which the dispatcher of the message doesn't care what happens with the dispatched message. The act of message sending is not a blocking operation. In CSP is quite opposite. When we put something into the channel we are blocked until someone takes it. Also in pubsub we have one-to-many relation and all the subscribers receive the same message. While in CSP if we hook multiple takes to a channel they'll all receive different messages because once the message is consumed it disappears from the channel and the next taker will read the next message. CSP and pubsub are kind of similar concepts. They both follow the push model and could be used to write code in a reactive way. However, they act differently.

Riew offers pubsub pattern capabilities. They are however added next to the core CSP processes and the developer needs to make a clear separation between the two. Consider the following example:

```js
sub(ch, value => {
  console.log(`Value: ${ value }`);
});
go(function * A() {
  yield put(ch, 'Foo');
  console.log('Bar');
});
```

The result of this snippet is only `Value: Foo`. The `sub` reads the put value but doesn't consume it from the channel. The routine `A` is still blocked because there is no `take` from the channel.

## API
