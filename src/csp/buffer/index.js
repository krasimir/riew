import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';
import EverBuffer from './EverBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true),
  ever: EverBuffer
};

export default buffer;
