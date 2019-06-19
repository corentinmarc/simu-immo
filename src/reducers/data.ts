import { SET_COMPUTING_DATA, SET_COMPUTED_DATA } from 'constants/actions/data';
import { AllActions } from 'actions';
import { ComputedData } from 'types/data';

export type DataState = {
  isComputing: boolean;
  computedData: ComputedData | null;
};

const initialState = {
  isComputing: false,
  computedData: null,
};

const setComputingData = (state: DataState, isComputing: boolean) => ({
  ...state,
  isComputing,
});

const setComputedData = (state: DataState, computedData: ComputedData) => ({
  ...state,
  computedData,
});

const dataReducer = (state = initialState, action: AllActions) => {
  switch (action.type) {
    case SET_COMPUTING_DATA:
      return setComputingData(state, action.payload.isComputing);
    case SET_COMPUTED_DATA:
      return setComputedData(state, action.payload);
    default:
      return state;
  }
};

export default dataReducer;
