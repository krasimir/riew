import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';
import DivorcedBuffer from './DivorcedBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: (size = 1) => {
    if (size < 1) {
      throw new Error('The dropping buffer should have at least size of one.');
    }
    return FixedBuffer(size, { dropping: true });
  },
  sliding: size => DroppingBuffer(size, true),
  divorced: DivorcedBuffer,
};

export default buffer;
