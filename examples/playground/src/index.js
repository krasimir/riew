/* eslint-disable no-use-before-define */
// import { go, sleep, put, take, stake, sput, ONE_OF } from 'riew';

// *************************************************************
/*
async function A(n) {
  const value = await B(n);
  console.log(`Fibonacci number for index ${n} is ${value}`);
}

function B(n) {
  const fibonacci = num => {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };
  return new Promise(done => {
    setTimeout(() => done(fibonacci(n)), 1000);
  });
}

A(10);
*/

/*
function createChannel() {
  const puts = [];
  const takes = [];

  return {
    put(data) {
      return new Promise(resolvePut => {
        if (takes.length > 0) {
          takes.shift()(data);
          resolvePut();
        } else {
          puts.push(() => {
            resolvePut();
            return data;
          });
        }
      });
    },
    take() {
      return new Promise(resolveTake => {
        if (puts.length > 0) {
          resolveTake(puts.shift()());
        } else {
          takes.push(resolveTake);
        }
      });
    },
  };
}

const channel = createChannel();

async function A(index) {
  await channel.put(index);
  const value = await channel.take();
  console.log(`Fibonacci number for index ${index} is ${value}`);
}

async function B() {
  const fibonacci = num => {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };
  const index = await channel.take();
  setTimeout(() => {
    channel.put(fibonacci(index));
  }, 1000);
}

A(10);
B();
B();
A(0);
A(3);
B();
*/

const Bus = {
  _subscribers: {},
  subscribe(type, callback) {
    if (!this._subscribers[type]) this._subscribers[type] = [];
    this._subscribers[type].push(callback);
  },
  send(type, ...payload) {
    if (this._subscribers[type]) {
      this._subscribers[type].forEach(s => s(...payload));
    }
  },
};
let t = 0;
function A(n) {
  Bus.subscribe('FIBONACCI_NUMBER', (index, number) => {
    console.log(++t, `Fibonacci number for index ${index} is ${number}`);
  });
  Bus.send('CALCULATE_FIBONACCI', n);
}
function B() {
  const fibonacci = num => {
    if (num <= 1) return 1;
    return fibonacci(num - 1) + fibonacci(num - 2);
  };
  Bus.subscribe('CALCULATE_FIBONACCI', n => {
    setTimeout(() => {
      Bus.send('FIBONACCI_NUMBER', n, fibonacci(n));
    }, 1000);
  });
}

A(10);
B();
B();
A(0);
A(3);
B();
