![Rine logo](./assets/logo.jpg)

```js
import { Fragment } from 'react';
import { Routine } from 'rine';

const App = Routine(async ({ render, city }) => {
  render(<p>Getting current time in { city } ...</p>);
      
  const result = await fetch(`https://worldtimeapi.org/api/timezone/Europe/${ city }.json`);
  const { datetime } = await result.json();

  render(`Right now in ${ city } - ${ new Date(datetime).toLocaleString() }`);
});

ReactDOM.render(<App city='London'/>, document.querySelector('.output')); 
```

**Rine** helps you handle side effects in React.