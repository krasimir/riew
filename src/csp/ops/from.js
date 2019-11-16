import { isChannel } from '../channel';

export default function from(ch) {
  ch.from = value => {
    if (Array.isArray(value)) {
      ch.buff.value = value;
    } else if (isChannel(value)) {
      value.pipe(ch);
    } else if (typeof value !== 'undefined') {
      ch.buff.value = [ value ];
    }
    return ch;
  };
}
