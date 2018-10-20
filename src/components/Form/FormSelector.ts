import { createStructuredSelector } from 'reselect';

import { formValueSelector } from 'selectors/form';
import { GlobalState } from 'reducers';
import { StateProps } from './Form';

const FormSelector = createStructuredSelector<GlobalState, StateProps>({
  capital: formValueSelector('capital'),
  interestRate: formValueSelector('interestRate'),
  insuranceRate: formValueSelector('insuranceRate'),
  duration: formValueSelector('duration'),
  notaryRate: formValueSelector('notaryRate'),
  intercalaryFees: formValueSelector('intercalaryFees'),
});

export default FormSelector;
