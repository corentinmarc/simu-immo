import { connect } from 'react-redux';

import { formValueSelector } from 'selectors/form';
import {
  dataComputedDataSelector,
  dataIsComputingSelector,
} from 'selectors/data';
import { GlobalState } from 'reducers';
import { setComputingData, setComputedData } from 'actions/data';

import MensualityTable, {
  MensualityTableStateProps,
  MensualityTableDispatchProps,
} from './MensualityTable';

const mapStateToProps = (state: GlobalState): MensualityTableStateProps => ({
  capital: formValueSelector('capital')(state),
  interestRate: formValueSelector('interestRate')(state),
  insuranceRate: formValueSelector('insuranceRate')(state),
  duration: formValueSelector('duration')(state),
  notaryRate: formValueSelector('notaryRate')(state),
  intercalaryFees: formValueSelector('intercalaryFees')(state),
  isComputing: dataIsComputingSelector(state),
  computedData: dataComputedDataSelector(state),
});

const mapDispatchToProps: MensualityTableDispatchProps = {
  setComputingData,
  setComputedData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MensualityTable);
