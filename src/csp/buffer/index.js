import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true)
};

export default buffer;
