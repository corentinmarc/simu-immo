import { combineReducers } from 'redux';

import formReducer from './form';

const rootReducer = combineReducers({
  form: formReducer,
});

export default rootReducer;
