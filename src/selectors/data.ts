import { createSelector } from 'reselect';

import { GlobalState } from 'reducers';
import { DataState } from 'reducers/data';

const dataSelector = (state: GlobalState): DataState => state.data;
const dataIsComputingSelector = createSelector(
  dataSelector,
  dataRoot => dataRoot.isComputing,
);
const dataComputedDataSelector = createSelector(
  dataSelector,
  dataRoot => dataRoot.computedData,
);

export { dataIsComputingSelector, dataComputedDataSelector };
