/** @jsx jsx */
import NumberInput from 'material-ui-number-input';
import { css, jsx } from '@emotion/core';

import {
  setCapital,
  setDuration,
  setInsuranceRate,
  setInterestRate,
  setFormValue,
} from 'actions/form';
import { FormField } from 'reducers/form';

const containerCSS = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 40px;
  > div {
    margin-right: 20px;
  }
`;

export type FormStateProps = {
  capital: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  notaryRate: number;
  intercalaryFees: number;
};

export type FormDispatchProps = {
  setCapital: typeof setCapital;
  setDuration: typeof setDuration;
  setInsuranceRate: typeof setInsuranceRate;
  setInterestRate: typeof setInterestRate;
  setFormValue: typeof setFormValue;
};

type Props = FormStateProps & FormDispatchProps;

const Form = ({
  capital,
  duration,
  interestRate,
  insuranceRate,
  notaryRate,
  intercalaryFees,
  setFormValue,
}: Props) => {
  const onChange = (type: FormField, value: string) => {
    setFormValue({ [type]: value });
  };

  return (
    <div css={containerCSS}>
      <NumberInput
        id="capital"
        min={0}
        max={10000000}
        floatingLabelText="Capital &agrave; emprunter"
        value={capital.toString()}
        onChange={(e, value) => {
          if (+value >= 0 && +value <= 10000000) {
            onChange('capital', value);
          }
        }}
      />
      <NumberInput
        id="interestRate"
        min={0}
        max={100}
        floatingLabelText="Taux int&eacute;r&ecirc;t (%)"
        value={interestRate.toString()}
        onChange={(e, value) => {
          if (+value >= 0 && +value <= 100) {
            onChange('interestRate', value);
          }
        }}
      />
      <NumberInput
        id="insuranceRate"
        min={0}
        max={100}
        floatingLabelText="Taux assurance (%)"
        value={insuranceRate.toString()}
        onChange={(e, value) => {
          if (+value >= 0 && +value <= 100) {
            onChange('insuranceRate', value);
          }
        }}
      />
      <NumberInput
        id="duration"
        min={0}
        max={100}
        floatingLabelText="Dur&eacute;e emprunt (ann&eacute;es)"
        value={duration.toString()}
        onChange={(e, value) => {
          if (+value >= 0 && +value <= 100) {
            onChange('duration', value);
          }
        }}
      />
      <NumberInput
        id="notaryRate"
        min={0}
        max={100}
        floatingLabelText="Taux notaire (%)"
        value={notaryRate.toString()}
        onChange={(e, value) => {
          if (+value >= 0 && +value <= 100) {
            onChange('notaryRate', value);
          }
        }}
      />
      <NumberInput
        id="intercalaryFees"
        min={0}
        max={100000}
        floatingLabelText="Frais intercalaire (&euro;)"
        value={intercalaryFees.toString()}
        onChange={(e, value) => {
          if (+value >= 0 && +value <= 100000) {
            onChange('intercalaryFees', value);
          }
        }}
      />
    </div>
  );
};

export default Form;
