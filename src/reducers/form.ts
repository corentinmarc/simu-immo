import {
  SET_INTEREST_RATE,
  SET_INSURANCE_RATE,
  SET_DURATION,
  SET_CAPITAL,
  SET_FORM_VALUE,
} from 'constants/actions/form';
import { AllActions } from 'actions';
import { Partial } from 'types';

export interface FormState {
  capital: number;
  interestRate: number;
  insuranceRate: number;
  duration: number;
  notaryRate: number;
  intercalaryFees: number;
}

export type FormField = keyof FormState;

export type FormValue = Partial<FormState>;

const setFormValue = (state: FormState, payload: FormValue): FormState => ({ ...state, ...payload });

const initialState = {
  capital: 305000,
  interestRate: 1.5,
  insuranceRate: 0.2,
  duration: 25,
  notaryRate: 2.5,
  intercalaryFees: 8000,
};

const formReducer = (state = initialState, action: AllActions) => {
  switch (action.type) {
    case SET_FORM_VALUE:
      return setFormValue(state, action.payload);
    case SET_INTEREST_RATE:
      const { interestRate } = action.payload;
      return setFormValue(state, { interestRate });
    case SET_INSURANCE_RATE:
      const { insuranceRate } = action.payload;
      return setFormValue(state, { insuranceRate });
    case SET_DURATION:
      const { duration } = action.payload;
      return setFormValue(state, { duration });
    case SET_CAPITAL:
      const { capital } = action.payload;
      return setFormValue(state, { capital });
    default:
      return state;
  }
};

export default formReducer;
