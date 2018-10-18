import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import NumberInput from 'material-ui-number-input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CSSModules from 'react-css-modules';

import {
  setCapital,
  setDuration,
  setInsuranceRate,
  setInterestRate,
  setFormValue,
} from 'actions/form';

import FormSelector from './FormSelector';
import styles from './Form.scss';

const mapDispatchToProps = dispatch => bindActionCreators({
  setCapital,
  setDuration,
  setInsuranceRate,
  setInterestRate,
  setFormValue,
}, dispatch);

class Form extends Component {
  onChange(type, value) {
    this.props.setFormValue({ [type]: value });
  }

  render() {
    const {
      capital, duration, interestRate, insuranceRate, notaryRate, intercalaryFees,
    } = this.props;
    return (
      <div styleName="container">
        <NumberInput
          id="capital"
          min={0}
          max={1000000}
          floatingLabelText="Capital à emprunter"
          value={capital}
          onChange={(e, value) => this.onChange('capital', value)}
        />
        <NumberInput
          id="interestRate"
          min={0}
          max={100}
          floatingLabelText="Taux intérêt (%)"
          value={interestRate}
          onChange={(e, value) => this.onChange('interestRate', value)}
        />
        <NumberInput
          id="insuranceRate"
          min={0}
          max={100}
          floatingLabelText="Taux assurance (%)"
          value={insuranceRate}
          onChange={(e, value) => this.onChange('insuranceRate', value)}
        />
        <NumberInput
          id="duration"
          min={0}
          max={100}
          floatingLabelText="Durée emprunt (années)"
          value={duration}
          onChange={(e, value) => this.onChange('duration', value)}
        />
        <NumberInput
          id="notaryRate"
          min={0}
          max={100}
          floatingLabelText="Taux notaire (%)"
          value={notaryRate}
          onChange={(e, value) => this.onChange('notaryRate', value)}
        />
        <NumberInput
          id="intercalaryFees"
          min={0}
          max={100}
          floatingLabelText="Frais intercalaire (€)"
          value={intercalaryFees}
          onChange={(e, value) => this.onChange('intercalaryFees', value)}
        />
      </div>
    );
  }
}

Form.propTypes = {
  capital: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  interestRate: PropTypes.string.isRequired,
  insuranceRate: PropTypes.string.isRequired,
  notaryRate: PropTypes.string.isRequired,
  intercalaryFees: PropTypes.string.isRequired,
  setFormValue: PropTypes.func.isRequired,
};

export default connect(
  FormSelector,
  mapDispatchToProps,
)(CSSModules(Form, styles));
