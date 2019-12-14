import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';
import Broadcasting from './BroadcastingBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true),
  broadcasting: Broadcasting
};

export default buffer;
