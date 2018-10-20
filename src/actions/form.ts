import {
  SET_INTEREST_RATE,
  SET_INSURANCE_RATE,
  SET_DURATION,
  SET_CAPITAL,
  SET_FORM_VALUE,
} from 'constants/actions/form';
import { actionCreator } from 'actions';
import { ActionsFromActionCreators } from 'types';

export const setInterestRate = ({ interestRate }: { interestRate: number }) => actionCreator(
  SET_INTEREST_RATE, { interestRate },
);
export const setInsuranceRate = ({ insuranceRate }: { insuranceRate: number }) => actionCreator(
  SET_INSURANCE_RATE, { insuranceRate },
);
export const setDuration = ({ duration }: { duration: number }) => actionCreator(SET_DURATION, { duration });
export const setCapital = ({ capital }: { capital: number }) => actionCreator(SET_CAPITAL, { capital });
export const setFormValue = (payload: object) => actionCreator(SET_FORM_VALUE, payload);

export const ActionCreators = {
  setInterestRate,
  setInsuranceRate,
  setDuration,
  setCapital,
  setFormValue,
};

export type FormActions = ActionsFromActionCreators<typeof ActionCreators>;
