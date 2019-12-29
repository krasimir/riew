/* eslint-disable no-use-before-define */
import { go, sleep, put, take, stake, sput, ONE_OF } from 'riew';

function simulateAsync() {
  return new Promise(done =>
    setTimeout(() => {
      done(42);
    }, 1000)
  );
}

// *************************************************************
async function A() {
  const value = await B(10);
  console.log(`Value is ${value}`);
}

async function B(n) {
  const remoteValue = await simulateAsync();
  return remoteValue * n;
}

A();
