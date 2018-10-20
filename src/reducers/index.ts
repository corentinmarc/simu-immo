import { combineReducers, Reducer } from 'redux';

import formReducer, { FormState } from './form';

export interface GlobalState {
  form: FormState;
}

const rootReducer = combineReducers<GlobalState>({
  form: formReducer as Reducer<FormState>,
});

export default rootReducer;
