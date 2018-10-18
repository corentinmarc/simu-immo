import {
  SET_INTEREST_RATE,
  SET_INSURANCE_RATE,
  SET_DURATION,
  SET_CAPITAL,
  SET_FORM_VALUE,
} from 'constants/actions/form';
import { actionCreator } from 'actions';

export const setInterestRate = ({ interestRate }) => actionCreator(
  SET_INTEREST_RATE, { interestRate },
);
export const setInsuranceRate = ({ insuranceRate }) => actionCreator(
  SET_INSURANCE_RATE, { insuranceRate },
);
export const setDuration = ({ duration }) => actionCreator(SET_DURATION, { duration });
export const setCapital = ({ capital }) => actionCreator(SET_CAPITAL, { capital });
export const setFormValue = payload => actionCreator(SET_FORM_VALUE, payload);
