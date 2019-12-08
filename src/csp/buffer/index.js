import FixedBuffer from './FixedBuffer';
import DroppingBuffer from './DroppingBuffer';
import ReducerBuffer from './ReducerBuffer';

const buffer = {
  fixed: FixedBuffer,
  dropping: DroppingBuffer,
  sliding: size => DroppingBuffer(size, true),
  reducer: ReducerBuffer
};

export default buffer;
