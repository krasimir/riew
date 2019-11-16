import { isChannel } from '../channel';

export default function from(ch) {
  ch.from = values => {
    if (Array.isArray(values)) {
      ch.buff.value = values;
    } else if (isChannel(ch)) {
      values.pipe(ch);
    } else {
      throw new Error('`from` accepts only an array of values or another channel.');
    }
    return ch;
  };
}
