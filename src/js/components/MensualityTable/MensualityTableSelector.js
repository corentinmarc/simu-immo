import { createStructuredSelector } from 'reselect';

import { formValueSelector } from 'selectors/form';

const MensualityTableSelector = createStructuredSelector({
    capital: formValueSelector('capital'),
    interestRate: formValueSelector('interestRate'),
    insuranceRate: formValueSelector('insuranceRate'),
    duration: formValueSelector('duration'),
});

export default MensualityTableSelector;