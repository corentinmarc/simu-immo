import { SET_COMPUTING_DATA, SET_COMPUTED_DATA } from 'constants/actions/data';
import { actionCreator } from 'actions';
import { ActionsFromActionCreators } from 'types';
import { ComputedData } from 'types/data';

export const setComputingData = ({ isComputing }: { isComputing: boolean }) =>
  actionCreator(SET_COMPUTING_DATA, { isComputing });

export const setComputedData = (data: ComputedData) =>
  actionCreator(SET_COMPUTED_DATA, data);

export const actionCreators = {
  setComputingData,
  setComputedData,
};

export type DataActions = ActionsFromActionCreators<typeof actionCreators>;
