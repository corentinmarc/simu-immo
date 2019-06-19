import { connect } from 'react-redux';

import {
  setCapital,
  setDuration,
  setInsuranceRate,
  setInterestRate,
  setFormValue,
} from 'actions/form';
import { formValueSelector } from 'selectors/form';
import { GlobalState } from 'reducers';

import Form, { FormStateProps, FormDispatchProps } from './Form';

const mapDispatchToProps: FormDispatchProps = {
  setCapital,
  setDuration,
  setInsuranceRate,
  setInterestRate,
  setFormValue,
};
const mapStateToProps = (state: GlobalState): FormStateProps => ({
  capital: formValueSelector('capital')(state),
  interestRate: formValueSelector('interestRate')(state),
  insuranceRate: formValueSelector('insuranceRate')(state),
  duration: formValueSelector('duration')(state),
  notaryRate: formValueSelector('notaryRate')(state),
  intercalaryFees: formValueSelector('intercalaryFees')(state),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);
