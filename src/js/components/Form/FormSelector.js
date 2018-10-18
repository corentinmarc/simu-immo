import { createStructuredSelector } from 'reselect';

import { formValueSelector } from 'selectors/form';

const FormSelector = createStructuredSelector({
  capital: formValueSelector('capital'),
  interestRate: formValueSelector('interestRate'),
  insuranceRate: formValueSelector('insuranceRate'),
  duration: formValueSelector('duration'),
  notaryRate: formValueSelector('notaryRate'),
  intercalaryFees: formValueSelector('intercalaryFees'),
});

export default FormSelector;