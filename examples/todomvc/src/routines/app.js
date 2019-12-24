import { sput } from "riew";
import { ALL, ACTIVE, COMPLETED, FILTER_CLEAR_COMPLETED } from "../constants";

export default function* app({ render, state }) {
  let filter = state(ALL);

  render({
    filter,
    viewAll: () => sput(filter, ALL),
    viewActive: () => sput(filter, ACTIVE),
    viewCompleted: () => sput(filter, COMPLETED),
    clearCompleted: () => sput(FILTER_CLEAR_COMPLETED)
  });
}
