import { createStructuredSelector } from 'reselect';

import { formValueSelector } from 'selectors/form';
import { StateProps } from './MensualityTable';
import { GlobalState } from 'reducers';

const MensualityTableSelector = createStructuredSelector<
  GlobalState,
  StateProps
>({
  capital: formValueSelector('capital'),
  interestRate: formValueSelector('interestRate'),
  insuranceRate: formValueSelector('insuranceRate'),
  duration: formValueSelector('duration'),
  notaryRate: formValueSelector('notaryRate'),
  intercalaryFees: formValueSelector('intercalaryFees'),
});

export default MensualityTableSelector;
