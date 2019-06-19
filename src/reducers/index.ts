import { combineReducers, Reducer } from 'redux';

import formReducer, { FormState } from './form';
import dataReducer, { DataState } from './data';

export interface GlobalState {
  form: FormState;
  data: DataState;
}

const rootReducer = combineReducers<GlobalState>({
  form: formReducer as Reducer<FormState>,
  data: dataReducer as Reducer<DataState>,
});

export default rootReducer;
