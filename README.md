![Riew logo](./assets/riew.jpg)

---

<h3 align="center">Reactive View</h3>

<p align="center"><b>Riew</b> is a reactive library that uses <a href="https://en.wikipedia.org/wiki/Communicating_sequential_processes">CSP</a>  concepts for managing data and application flow.</p>

---

* Inspiration - [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes), [core.async](https://github.com/clojure/core.async), [Go](https://golang.org/), [Redux](https://redux.js.org/), [redux-saga](https://redux-saga.js.org/), [JS-CSP](https://github.com/js-csp/js-csp) 
* Core concepts - [Routines & channels](https://github.com/krasimir/riew#routines--channels), [Riews](https://github.com/krasimir/riew#riews), [State](https://github.com/krasimir/riew#state), [Pubsub](https://github.com/krasimir/riew#pubsub)
* API
  * [chan](https://github.com/krasimir/riew#chan)
  * [buffer](https://github.com/krasimir/riew#buffer)
  * [go](https://github.com/krasimir/riew#go)
    * [stopping a routine](https://github.com/krasimir/riew#stopping-a-routine)
    * [restarting a routine](https://github.com/krasimir/riew#restarting-the-routine)
    * [what you can yield](https://github.com/krasimir/riew#what-you-can-yield)
  * [put](https://github.com/krasimir/riew#put), [sput](https://github.com/krasimir/riew#sput)
  * [take](https://github.com/krasimir/riew#take), [stake](https://github.com/krasimir/riew#stake)
  * [close](https://github.com/krasimir/riew#close), [sclose](https://github.com/krasimir/riew#sclose)
  * [call](https://github.com/krasimir/riew#call)
  * [fork](https://github.com/krasimir/riew#fork)
  * [sleep](https://github.com/krasimir/riew#sleep)
  * [stop](https://github.com/krasimir/riew#stop)
  * [timeout](https://github.com/krasimir/riew#timeout)
  * [merge](https://github.com/krasimir/riew#merge)
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

The [pubsub](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) pattern is widely used in JavaScript. There are tons of libraries that are using it and it's de-facto a standard these days. I (the author of this library) however think that this pattern doesn't play well with the [CSP](https://en.wikipedia.org/wiki/Communicating_sequential_processes) architecture. I've made couple of tests and tried implementing it with pure CSP patterns but it simply doesn't work as expected. That's because in the pubsub pattern we have a broadcasting system. A system in which the dispatcher of the message doesn't care what happens with the dispatched message. The act of message sending is not a blocking operation. In CSP is quite opposite. When we put something into the channel we are blocked until someone takes it. Also in pubsub we have one-to-many relation and all the subscribers receive the same message. While in CSP if we hook multiple takers to a channel they'll all receive different messages because once the message is consumed it disappears from the channel and the next taker will read the next message. CSP and pubsub are kind of similar concepts. They both follow the push model and could be used to write code in a reactive way. However, they act differently.

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

### chan

> `chan(id, buff)` or `chan(buff)`

Creates a new channel with ID equal to `id` and buffer equal to `buff`.

* `id` (`String`, optional) - must be unique for your system. If not specified it will be auto-generated by the library.
* `buff` (`Buffer`, optional) - buffer created by using the [`buffer`](https://github.com/krasimir/riew#buffer) helpers. If not specified `buffer.fixed()` is used.

The function returns a channel object with the following methods/fields:

* `channel.id` - the ID of the channel.
* `channel.isActive()` - returns `true` if the channel is in an `OPEN` state.
* `channel.state()` - returns one of the following: `OPEN`, `CLOSED` or `ENDED`. When the `channel` is `OPEN` we can put and take from it. When it is `CLOSED` every put gets resolved with `CLOSED`. The `take` on a `CLOSED` channel consumes the values left in the channel. If no values gets resolved with `CLOSED`. When a channel is `ENDED` both `put` and `take` are resolved with `ENDED`.

Example:

```js
const ch = chan('FOOBAR');

console.log(ch.id); // FOOBAR
console.log(ch.state()); // Symbol(OPEN)
console.log(ch.isActive()); // true
```

### buffer

> `buffer.fixed()`

It creates a fixed buffer with size 0. The `put` to the channel is blocked until a `take` happens. A `take` is blocked until a `put` happens.

Example:

```js
const ch = chan(buffer.fixed());

go(function * A() {
  yield put(ch, 'foo');
});
go(function * B() {
  yield sleep(1000);
  const value = yield take(ch);
});
```

1. Routine A starts and stops at the `yield put`.
2. Routine B starts and stops at `yield sleep` for one second.
3. Routine B is resumed because and `take`s 'foo' from the channel.
4. Routine A is resumed and it ends.
5. Routine B ends with `value` equal to `foo`.

> `buffer.fixed(n)`

It creates a fixed buffer with size `n`. `n` number of puts are non-blocking and the buffer holds the values till they are consumed. The `n + 1` put is blocking.

Example:

```js
const ch = chan(buffer.fixed(2));

go(function * A() {
  yield put(ch, 'foo');
  console.log('a')
  yield put(ch, 'bar');
  console.log('b')
  yield put(ch, 'moo');
  console.log('c')
});
go(function * B() {
  yield sleep(2000);
  console.log(yield take(ch));
  console.log(yield take(ch));
  console.log(yield take(ch));
});
```

1. Routine A starts and we see `"a"` and `"b"` in the console. It's because we have a buffer with size 2.
3. Routine B starts and stops at `yield sleep(2000)` for two seconds.
4. Routine B continues and consumes all the values from the channel including `"moo"`.

> `buffer.sliding(n)`

Similar to the fixed buffer except that the `put`s are never blocking. If the buffer is full a new item is added at the end but one item is removed from the beginning.

Example:

```js
const ch = chan(buffer.sliding(2));

go(function * A() {
  yield put(ch, 'foo');
  yield put(ch, 'bar');
  yield put(ch, 'moo');
  yield put(ch, 'zoo');
});
go(function * B() {
  yield sleep(2000);
  console.log(yield take(ch));
  console.log(yield take(ch));
});
```

1. Routine A starts and all the puts happen with no stopping of the generator.
2. Routine B starts and in the channel we have `["moo", "zoo"]`.
3. Routine B ends and in the console we see `"moo"` followed by `"zoo"`.

> `buffer.dropping(n)`

Similar to the fixed buffer except that every `put` outside of the buffer range is not blocking the routing. It resolves with `true` if there is space in the buffer and `false` if not. It's simply ignored.

Example:

```js
const ch = chan(buffer.dropping(2));

go(function * A() {
  yield put(ch, 'foo');
  yield put(ch, 'bar');
  yield put(ch, 'moo');
  yield put(ch, 'zoo');
});
go(function * B() {
  yield sleep(2000);
  console.log(yield take(ch));
  console.log(yield take(ch));
});
```

1. Routine A starts and all the puts happen with no stopping of the generator. It's just the last two do nothing.
2. Routine B starts and in the channel we have `["foo", "bar"]`.
3. Routine B ends and in the console we see `"foo"` followed by `"bar"`.

> `buffer.divorced()`

This type of buffer is a bit against the idea of the original CSP. The `put`s and `take`s to the channel with such buffer are always non-blocking. They resolve immediately. The `put`s always resolve with `true` while the `take`s with the latest value that was in the channel.

Example:

```js
const ch = chan(buffer.divorced());

go(function * A() {
  yield put(ch, 'foo');
  yield put(ch, 'bar');
  yield put(ch, 'moo');
});
go(function * B() {
  console.log(yield take(ch));
  console.log(yield take(ch));
});
```

1. Routine `A` starts and all the `put`'s are resolved with true. Routine `A` ends.
2. Routine `B` starts and both `take`s are resolved with `"moo"`. The latest set value.
3. Routine `B` ends.

### go

> `go(routine, done, ...routineArgs)`

Runs a routine.

* `routine` (`Generator`, required) - a generator function
* `done` (`Function`, optional) - a callback function which is fired when the routine ends.
* `routineArgs` (`Any`, optional) - any optional arguments that come as arguments to our generator.

Example:

```js
const ch = chan();

go(
  function * A(greeting) {
    const name = yield take(ch);
    return `${ greeting }, ${ name }`;
	},
  (v) => {
    console.log(v);
  },
  'Hey'
);
go(function * B() {
	yield put(ch, 'Pablo')
});
```

1. `go` runs a routine `A` with one argument `"Hey"`. The routine stops at `yield take(ch)`.
2. Routine `B` starts and inside we put to the channel `"Pablo"` string.
3. Routine `A` is resumed and forms its result which is `Hey, Pablo`.
4. The routine done callback is called and we see the result in the console.

#### Stopping a routine

The `go` function returns an object that has a `stop` method. Once you call it the routine will be terminated.

```js
const routine = go(function * () {
  yield sleep(1000);
  // This line will never be executed because
  // the routine is terminated before it gets resumed.
  console.log('Never called!'); 
});

routine.stop(); // <-- this terminates the routine
```

Another way to stop the routine is to yield `stop()`. This is not the same as writing `return` because `return` will fire the callback of the routine so it's ended. `stop()` is about terminating it. In the following example we'll see only `"done B"`.

```js
go(function * A() {
  yield stop();
  console.log('Never called!');
}, () => console.log('done A'));

go(function * B() {
  return;
  console.log('Never called!');
}, () => console.log('done B'));
```

The routine is automatically terminated if it's part of a [riew](https://github.com/krasimir/riew#riew) and the riew is unmounted.

```js
const routine = function * () {
  yield sleep(1000);
  // This line will never be executed because
  // the routine is terminated before it gets resumed.
  console.log('Never called!');
};

const r = riew(() => {}, routine);

r.mount();
r.unmount(); // <-- this terminates the routine
```

#### Restarting the routine

Rerunning a routine means terminating the current processes and running the generator again.

The `go` function returns an object that has a `rerun` method. Once you call it the routine will be restarted.

```js
const routine = go(function * () {
  console.log('Hello!');
  yield sleep(1000);
  console.log('Bye!');
});
routine.rerun();
```

We'll see "Hello" twice before seeing "Bye", because the routing will be restarted before it gets resumed from the `sleep`.

Another way to restart the routine is to `return` the `go` function. For example:

```js
go(function * () {
  console.log('Hello!');
  yield sleep(1000);
  console.log('Bye!');
  return go;
});
```

This routine will print `"Hello!"`, will wait a second and will print `"Bye!"`. And will do that in a endless loop because the generator is restarted every time.

#### What you can yield

* You can yield a promise. Riew will wait till the promise is resolved and will resume the generator.

```js
const routine = go(function * () {
  const res = yield fetch('https://aws.random.cat/meow');
  const { file } = yield res.json();
  console.log(file);
});
```
* [put](https://github.com/krasimir/riew#put)
* [take](https://github.com/krasimir/riew#take)
* [read](https://github.com/krasimir/riew#read)
* [sleep](https://github.com/krasimir/riew#sleep)
* [stop](https://github.com/krasimir/riew#stop)
* [close](https://github.com/krasimir/riew#close)
* [call](https://github.com/krasimir/riew#call)
* [fork](https://github.com/krasimir/riew#fork)

### put

> `put(channel, anything)`

Meant to be used only inside a routine. It puts items into a channel. Could be blocking. It depends on the channel's [buffer](https://github.com/krasimir/riew#buffer).

* `channel` (`String` or a [channel object](https://github.com/krasimir/riew#chan), required) - the channel which we want to put items in.
* `anything` (`Any`, required) - the item that we want to put into the channel.

The generator is resumed with `true` if the `put` is successful. `false` in the case of a channel with a dropping [buffer](https://github.com/krasimir/riew#buffer). Or it may return channel [statuses](https://github.com/krasimir/riew#chan) `CLOSED` or `ENDED`.

Example:

```js
const ch = chan();

go(function * () {
  console.log(yield take(ch));
})
go(function * () {
	yield put(ch, 'foo');
});
```

### sput

> `sput(channel, anything, callback)`

Same as [put](https://github.com/krasimir/riew#put) but it can be called outside of a routine. This function is super handy to make the bridge between Riew and non-Riew code. The `s` comes from `standalone`.

* `channel` (`String` or a [channel object](https://github.com/krasimir/riew#chan), required) - the channel which we want to put items in.
* `anything` (`Any`, required) - the item that we want to put into the channel.
* `callback` (`Function`, optional) - it will be fired when the `put` operation ends.

The callback may be fired with `true` if the `put` is successful. `false` in the case of a channel with a dropping [buffer](https://github.com/krasimir/riew#buffer). Or with channel [statuses](https://github.com/krasimir/riew#chan) `CLOSED` or `ENDED`.

Example:

```js
const ch = chan();

go(function * () {
  console.log(yield take(ch));
});

sput(ch, 'foo', res => console.log(`Put successful ${ res }`));
```

### take

> `take(channel)`

Meant to be used only inside a routine. It takes an item from a channel. Could be blocking. It depends on the channel's [buffer](https://github.com/krasimir/riew#buffer).

* `channel` (`String` or a [channel object](https://github.com/krasimir/riew#chan), required) - the channel which we want to take items from.

The generator is resumed with the item taken from the channel.

Example:

```js
const ch = chan();

go(function * () {
  console.log(yield take(ch));
})
go(function * () {
	yield put(ch, 'foo');
});
```

### stake

> `stake(channel, callback)`

Same as [take](https://github.com/krasimir/riew#take) but it can be called outside of a routine. This function is super handy to make the bridge between Riew and non-Riew code. The `s` comes from `standalone`.

* `channel` (`String` or a [channel object](https://github.com/krasimir/riew#chan), required) - the channel which we want to take items from.
* `callback` (`Function`, optional) - it will be fired with the item taken from the channel.

The generator is resumed with the item taken from the channel.

Example:

```js
const ch = chan();

go(function * () {
  yield put(ch, 'foo');
  yield put(ch, 'bar');
});

stake(ch, item => console.log(item));
```

Notice that this is one-time call. It's not like a [subscription](https://github.com/krasimir/riew#sub) to the channel. In the example here we'll see only `"foo"` but not `"bar"`.

### close

> `close(channel)`

This function closes a channel and it is meant to be used inside a generator. Which means that the channel's state is set to `CLOSE` or maybe `ENDED`. It depends on the [buffer](https://github.com/krasimir/riew#buffer) strategy.

* `channel` (`String` or a [channel object](https://github.com/krasimir/riew#chan), required) - the channel that we want to close.

Example:

```js
const ch = chan();

go(function * () {
  console.log(yield take(ch));
  console.log(yield take(ch));
  console.log(yield take(ch));
});
go(function * () {
  yield put(ch, 'foo');
  yield close(ch);
});
```

In the console we'll see `"foo"` followed by two `Symbol(ENDED)`. The routine is paused at the first [take](https://github.com/krasimir/riew#take). `put` resumes it with the value of `"foo"` and the routine gets paused at the second take. The `close` call closes the channel and releases all the pending takes. Each of the next takes will result with either `CLOSE` ro `ENDED` depending of the value of the channel's [buffer](https://github.com/krasimir/riew#buffer). Every [put](https://github.com/krasimir/riew#put) to a `CLOSED` or `ENDED` channel is resolved with a channel status immediately.

### sclose

> `sclose(channel)`

This function is the same as [close](https://github.com/krasimir/riew#close) but it's meant to be used outside of a routine.

* `channel` (`String` or a [channel object](https://github.com/krasimir/riew#chan), required) - the channel that we want to close.

Example:

```js
const ch = chan();

go(function * () {
  console.log(yield take(ch));
  console.log(yield take(ch));
  console.log(yield take(ch));
});

sput(ch, 'foo');
close(ch);
```

In the console we'll see `"foo"` followed by two `Symbol(ENDED)`. The routine is paused at the first [take](https://github.com/krasimir/riew#take). `sput` resumes it with the value of `"foo"` and the routine gets paused at the second take. The `close` call closes the channel and releases all the pending takes. Each of the next takes will result with either `CLOSE` ro `ENDED` depending of the value of the channel's [buffer](https://github.com/krasimir/riew#buffer). Every [put](https://github.com/krasimir/riew#put) to a `CLOSED` or `ENDED` channel is resolved with a channel status immediately.

### call

> `call(routine, ...routineArgs)`

It runs another routine and it's meant to be used only inside a routine.

* `routine` (`Generator`, required) - a generator function
* `routineArgs` (`Any`, optional) - any optional arguments that come as arguments to our generator.

Example:

```js
function * A(name) {
  return `Hey, ${ name }!`;
}

go(function * B() {
  console.log(yield call(A, 'Ana')); // Hey, Ana!
});
```

Notice that the routine `B` is paused until routine `A` finishes.

### fork

> `fork(routine, ...routineArgs)`

Like [call](https://github.com/krasimir/riew#call) but it's not blocking. Meant to be used only inside a routine.

* `routine` (`Generator`, required) - a generator function
* `routineArgs` (`Any`, optional) - any optional arguments that come as arguments to our generator.

Example:

```js
const ch = chan();

function * fillName(name) {
  yield put(ch, name);
}

go(function * printName() {
  yield fork(fillName, 'Ana');
  console.log(`Hey, ${ yield take(ch) }!`); // Hey, Ana!
});
```

Notice that the routine `printName` is not paused when we `yield fork`.

### sleep

> `sleep(interval)`

It's meant to be used only inside a routine. It pauses the routine for a given time.

* `interval` (`Number`, required) - milliseconds

Example:

```js
go(function * () {
  console.log('A');
  yield sleep(2000); // <-- two seconds delay
  console.log('A');
});
```

### stop

> `stop()`

It's meant to be used only inside a routine. It terminates the routine.

Example:

```js
const answer = 42;
go(function * () {
  console.log('A');
  if (answer === 42) {
    yield stop();
  }
  console.log('Never called!');
});
```

### timeout

> `timeout(interval)`

It creates a channel that will close after a given interval of time.

* `interval` (`Number`, required) - milliseconds

Example:

```js
const ch = timeout(1000);

go(function * () {
  yield put(ch, 'foo');
  yield put(ch, 'bar');
  yield put(ch, 'moo');
})
go(function * () {
  console.log(yield take(ch));
  yield sleep(2000);
  console.log(yield take(ch));
  console.log(yield take(ch));
});
```

We'll see `"foo"` and then two seconds later two `Symbol(ENDED)`. That's because the channel is closed after a second and the two takes after the `sleep` are operating with an `ENDED` channel.

### merge

> `merge(...sourceChannels)`

Returns a channel that contains the values from all the source channels. Have in mind that internally this function registers a taker.

* `sourceChannels` (`Channels`, required) - one or many channels

Example:

```js
const chA = chan();
const chB = chan();
const ch = merge(chA, chB);

go(function * () {
  console.log(yield take(ch)); // foo
  console.log(yield take(ch)); // bar
  console.log(yield take(ch)); // moo
  console.log(yield take(ch)); // zoo
});
go(function * () {
  yield put(chA, 'foo');
  yield put(chB, 'bar');
  yield put(chB, 'moo');
  yield put(chA, 'zoo');
});
```