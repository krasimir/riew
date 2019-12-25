import { go, read, sput } from 'riew';

go(function*() {
  console.log(yield read(['foo', 'bar']));
});

sput('foo', 10);
sput('bar', 20);

/*
  
  {
    idle: {
      on: {
        FETCH: 'loading'
      }
    },
    loading: {
      on: {
        RESOLVE: 'success',
        REJECT: 'failure'
      }
    },
    success: {
      type: 'final'
    },
    failure: {
      on: {
        RETRY: {
          target: 'loading',
          actions: assign({
            retries: (context, event) => context.retries + 1
          })
        }
      }
    }
  }
  
*/
