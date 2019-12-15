import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';
import Ever from './EverBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true),
  ever: Ever
};

export default buffer;
