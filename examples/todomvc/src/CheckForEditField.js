/* eslint-disable react/prop-types */
/** @jsx A */
import { A } from '../../../lib';

import { FocusField } from './DOM';

export default function CheckForEditField({ todos }) {
  return <FocusField index={ todos.findIndex(({ editing }) => editing) } />;
}
