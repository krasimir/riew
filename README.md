![Rine logo](./assets/logo.jpg)

There are two big problem in front-end development - managing state and managing side effects. Rine helps you solve the second one. It gives you an API that allows using an async function called _routine_ as a React component.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Routine } from 'rine';

const MySideEffect = Routine(async function({ render }) {
  render(<p>Hey, I'm waiting for the data.</p>);

  const data = await fetchData(...);

  render(<p>Oh nice, data is here.</p>);
});

ReactDOM.render(<MySideEffect />, ...);
```

Your routine gets fired once when `<MySideEffect>` is mounted. If that component is unmounted your function doesn't stop but calling `render` does nothing. There is an API to understand if the component is unmounted so you can stop the side effect logic if you need to.

Here is a working example that gets the current time in London.

```js
import React, { Fragment } from 'react';
import { Routine } from 'rine';

const App = Routine(async ({ render, city }) => {
  render(<p>Getting current time in { city } ...</p>);
      
  const result = await fetch(`https://worldtimeapi.org/api/timezone/Europe/${ city }.json`);
  const { datetime } = await result.json();

  render(`Right now in ${ city } - ${ new Date(datetime).toLocaleString() }`);
});

ReactDOM.render(<App city='London'/>, document.querySelector('.output')); 
```

You can play with it [here](https://poet.codes/e/MMBJ8wk8VIR).