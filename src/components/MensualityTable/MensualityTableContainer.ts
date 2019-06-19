import { connect } from 'react-redux';

import { formValueSelector } from 'selectors/form';
import { GlobalState } from 'reducers';

import MensualityTable, { MensualityTableStateProps } from './MensualityTable';

const mapStateToProps = (state: GlobalState): MensualityTableStateProps => ({
  capital: formValueSelector('capital')(state),
  interestRate: formValueSelector('interestRate')(state),
  insuranceRate: formValueSelector('insuranceRate')(state),
  duration: formValueSelector('duration')(state),
  notaryRate: formValueSelector('notaryRate')(state),
  intercalaryFees: formValueSelector('intercalaryFees')(state),
});

export default connect(
  mapStateToProps,
  null,
)(MensualityTable);
