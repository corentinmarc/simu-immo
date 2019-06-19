/** @jsx jsx */
import { Component } from 'react';
import NumberInput from 'material-ui-number-input';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { css, jsx } from '@emotion/core';

import {
  setCapital,
  setDuration,
  setInsuranceRate,
  setInterestRate,
  setFormValue,
} from 'actions/form';
import { FormField } from 'reducers/form';
import { GlobalState } from 'reducers';

import FormSelector from './FormSelector';

const containerCSS = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 40px;
  > div {
    margin-right: 20px;
  }
`;

const mapDispatchToProps = (dispatch: Dispatch<GlobalState>) =>
  bindActionCreators(
    {
      setCapital,
      setDuration,
      setInsuranceRate,
      setInterestRate,
      setFormValue,
    },
    dispatch,
  );

export interface StateProps {
  capital: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  notaryRate: number;
  intercalaryFees: number;
}

interface DispatchProps {
  setCapital: typeof setCapital;
  setDuration: typeof setDuration;
  setInsuranceRate: typeof setInsuranceRate;
  setInterestRate: typeof setInterestRate;
  setFormValue: typeof setFormValue;
}

type AllProps = StateProps & DispatchProps;

class Form extends Component<AllProps> {
  onChange = (type: FormField, value: string) => {
    this.props.setFormValue({ [type]: value });
  };

  render() {
    const {
      capital,
      duration,
      interestRate,
      insuranceRate,
      notaryRate,
      intercalaryFees,
    } = this.props;
    return (
      <div css={containerCSS}>
        <NumberInput
          id="capital"
          min={0}
          max={1000000}
          floatingLabelText="Capital &agrave; emprunter"
          value={capital.toString()}
          onChange={(e, value) => this.onChange('capital', value)}
        />
        <NumberInput
          id="interestRate"
          min={0}
          max={100}
          floatingLabelText="Taux int&eacute;r&ecirc;t (%)"
          value={interestRate.toString()}
          onChange={(e, value) => this.onChange('interestRate', value)}
        />
        <NumberInput
          id="insuranceRate"
          min={0}
          max={100}
          floatingLabelText="Taux assurance (%)"
          value={insuranceRate.toString()}
          onChange={(e, value) => this.onChange('insuranceRate', value)}
        />
        <NumberInput
          id="duration"
          min={0}
          max={100}
          floatingLabelText="Dur&eacute;e emprunt (ann&eacute;es)"
          value={duration.toString()}
          onChange={(e, value) => this.onChange('duration', value)}
        />
        <NumberInput
          id="notaryRate"
          min={0}
          max={100}
          floatingLabelText="Taux notaire (%)"
          value={notaryRate.toString()}
          onChange={(e, value) => this.onChange('notaryRate', value)}
        />
        <NumberInput
          id="intercalaryFees"
          min={0}
          max={100}
          floatingLabelText="Frais intercalaire (&euro;)"
          value={intercalaryFees.toString()}
          onChange={(e, value) => this.onChange('intercalaryFees', value)}
        />
      </div>
    );
  }
}

export default connect(
  FormSelector,
  mapDispatchToProps,
)(Form);
