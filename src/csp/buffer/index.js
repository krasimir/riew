import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';
import DivorcedBuffer from './DivorcedBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true),
  divorced: DivorcedBuffer,
};

export default buffer;
