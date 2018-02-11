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

const mapDispatchToProps = (dispatch) => bindActionCreators({
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
        const { capital, duration, interestRate, insuranceRate } = this.props;
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
            </div>
        );
    }
}

Form.propTypes = {
    capital: PropTypes.string,
    duration: PropTypes.string,
    interestRate: PropTypes.string,
    insuranceRate: PropTypes.string,
};

export default connect(
    FormSelector,
    mapDispatchToProps,
)(CSSModules(Form, styles));