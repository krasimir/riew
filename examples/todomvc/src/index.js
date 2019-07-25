/** @jsx A */
import { A, run, Fragment, usePubSub, useState, useEffect, processor } from '../../../lib';
import inspector from 'actml-inspector';

inspector.watch(processor);
console.log(inspector);

import Store from './Store';
import Renderer from './Renderer';
import CheckForEditField from './CheckForEditField';
import { ProgressChecker, FilterOptionsTabs, Container, Footer } from './DOM';
import { useLocalStorage, Persist } from './Persist';

export const FILTER_ALL = 'FILTER_ALL';
export const FILTER_ACTIVE = 'FILTER_ACTIVE';
export const FILTER_COMPLETED = 'FILTER_COMPLETED';

function App() {
  const initialValue = useLocalStorage();
  const { publish, subscribe } = usePubSub();
  const [ filter, setFilter ] = useState(FILTER_ALL);

  useEffect(() => {
    subscribe(FILTER_ALL, () => setFilter(FILTER_ALL));
    subscribe(FILTER_ACTIVE, () => setFilter(FILTER_ACTIVE));
    subscribe(FILTER_COMPLETED, () => setFilter(FILTER_COMPLETED));
  }, []);

  return (
    <Fragment>
      <Container onUserAction={ publish } />
      <Footer onUserAction={ publish }/>
      <Store initialValue={ initialValue }>
        <FilterOptionsTabs filter={ filter() } />
        <Renderer filter={ filter() }/>
        <CheckForEditField />
        <ProgressChecker />
        <Persist />
      </Store>
    </Fragment>
  );
};

run(<App />);
