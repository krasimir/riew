![Rine logo](./assets/logo.jpg)

There are two big problem in front-end development - managing state and managing side effects. Rine helps you solve the second one. It gives you an API that runs a function parallel to your React component.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { routine } from 'rine';

const MyComponent = ({ message }) => <h1>{ message }</h1>;
const MySideEffect = routine(
  function R({ render }) {
    render({ message: 'Hey!' });
  },
  MyComponent
);

ReactDOM.render(<MySideEffect />, ...);
```

The **routine** function `R` gets fired only once when `<MySideEffect>` is mounted. Calling the `render` function inside means "render my component with this props". The example above results in `<MyComponent message='Hey!' />` (or in other words `<h1>Hey!</h1>`).

So, why the hell we'll want to do that. I know that it is difficult to see the benefit from such a small example but what I was always struggling with React is how to handle side effects. We can't make it easily just within the React components. We need some sort of abstraction that lives outside and we communicate back and forth. That's why we have the whole Redux ecosystem. In complex apps we can't rely only on React components. I always imagine 