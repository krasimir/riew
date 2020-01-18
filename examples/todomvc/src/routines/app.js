import { sput } from 'riew';
import { ALL, ACTIVE, COMPLETED } from '../constants';
import { FILTER_CLEAR_COMPLETED } from '../Data';

export default function* app({ render, state }) {
  const filter = state(ALL);

  render({
    filter,
    viewAll: () => sput(filter, ALL),
    viewActive: () => sput(filter, ACTIVE),
    viewCompleted: () => sput(filter, COMPLETED),
    clearCompleted: () => sput(FILTER_CLEAR_COMPLETED),
  });
}
