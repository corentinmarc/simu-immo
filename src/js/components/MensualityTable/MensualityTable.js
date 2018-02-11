import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import { connect } from 'react-redux';
import { range } from 'lodash';
import CSSModules from 'react-css-modules';
import numeral from 'numeral';

import MensualityTableSelector from './MensualityTableSelector';
import styles from './MensualityTable.scss';

const formatPrice = (price) => numeral(price).format('0,0');
const formatPercent = (price) => numeral(price).format('0.0%');

class MensualityTable extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            props: {},
            datas: [],
            totalCost: 0,
            totalInterestCost: 0,
            totalCapitalCost: 0,
            totalInsuranceCost: 0,
            mensualityCost: 0,
            totalRatioCapital: 0,
            totalRatioInterest: 0,
            totalRatioInsurance: 0,
        };
    }

    componentWillMount() {
        this.setState({
            props: this.props,
        });
        this.computeDatas(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const { capital, duration, interestRate, insuranceRate } = this.props;
        const { capital: nextCapital, duration: nextDuration, interestRate: nextInterestRate, insuranceRate: nextInsuranceRate } = nextProps;
        this.setState({
            props: nextProps,
        });
        if (
            capital !== nextCapital ||
            duration !== nextDuration ||
            interestRate !== nextInterestRate ||
            insuranceRate !== nextInsuranceRate
        ) {
            this.computeDatas(nextProps);
        }
    }

    computeDatas({ capital, duration, interestRate, insuranceRate }) {
        const nbMonth = Number(duration) * 12 || 0;
        const totalInsurancePercent = insuranceRate * duration;
        const totalCapitalPercent = this.getAverageCapitalPercent({ capital, duration, interestRate, insuranceRate });
        let datas = range(0, nbMonth).map( i => {
            const percentCapital = this.computeCapitalPercent(i, { capital, duration, interestRate, insuranceRate });
            return {
                month: i,
                percentCapital,
                percentInterest: 100 - percentCapital,
                percentInsurance: totalInsurancePercent,
                ratioCapital: percentCapital / (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
                ratioInterest: (100 - percentCapital) / (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
                ratioInsurance: (totalInsurancePercent * totalCapitalPercent / 100) / (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
            };
        });

        const totalRatioInterest = datas.reduce((acc, { ratioInterest }) => acc + ratioInterest, 0) / nbMonth;
        const totalRatioCapital = datas.reduce((acc, { ratioCapital }) => acc + ratioCapital, 0) / nbMonth;
        const totalRatioInsurance = datas.reduce((acc, { ratioInsurance }) => acc + ratioInsurance, 0) / nbMonth;
        const totalCost = capital / totalRatioCapital;
        const totalInterestCost = totalCost * totalRatioInterest;
        const totalInsuranceCost = totalCost * totalRatioInsurance;
        const totalCapitalCost = totalCost * totalRatioCapital;
        const mensualityCost = totalCost / duration / 12;

        datas = datas.map((data, i) => ({
            ...data,
            costInterest: mensualityCost * data.ratioInterest,
            costCapital: mensualityCost * data.ratioCapital,
            costInsurance: mensualityCost * data.ratioInsurance,
            costCumulate: mensualityCost * (i + 1),
        }));

        this.setState({
            datas,
            totalRatioCapital,
            totalRatioInterest,
            totalRatioInsurance,
            totalCapitalCost,
            totalInterestCost,
            totalInsuranceCost,
            totalCost,
            mensualityCost,
        });
    }

    computeCapitalPercent(i, { capital, duration, interestRate, insuranceRate }) {
        return 1 / ((1 + (interestRate / 12 / 100))**(duration * 12 - i)) * 100;
    }

    getAverageCapitalPercent({ capital, duration, interestRate, insuranceRate }) {
        const nbMonth = Number(duration) * 12 || 0;
        return range(0, nbMonth)
            .map(i => this.computeCapitalPercent(i, { capital, duration, interestRate, insuranceRate }) , [])
            .reduce((acc, cur) => acc + cur, 0) / nbMonth;
    }

    renderTableHeader() {
        return (
            <div styleName="line line-header">
                <div styleName="line-month">Mensualité n°</div>
                <div styleName="line-cost-capital">Capital remboursé</div>
                <div styleName="line-cost-interest">Coût intérêt</div>
                <div styleName="line-cost-insurance">Coût assurance</div>
                <div styleName="line-cost-cumul">Coût cumulé</div>
            </div>
        )
    }

    renderTableTotal() {
        const {
            totalRatioCapital,
            totalRatioInsurance,
            totalRatioInterest,
            totalInterestCost,
            totalCapitalCost,
            totalInsuranceCost,
            totalCost,
        } = this.state;

        return (
            <div styleName="line line-total">
                <div styleName="line-month">TOTAL</div>
                <div styleName="line-cost-capital">
                    <span styleName="price-total">{ formatPrice(totalCapitalCost) }€</span>
                    <span styleName="percent-total">({ (totalRatioCapital*100).toFixed(1) }%)</span>
                </div>
                <div styleName="line-cost-interest">
                    <span styleName="price-total">{ formatPrice(totalInterestCost) }€</span>
                    <span styleName="percent-total">({ (totalRatioInterest*100).toFixed(1) }%)</span>
                </div>
                <div styleName="line-cost-insurance">
                    <span styleName="price-total">{ formatPrice(totalInsuranceCost) }€</span>
                    <span styleName="percent-total">({ (totalRatioInsurance*100).toFixed(1) }%)</span>
                </div>
                <div styleName="line-cost-cumul">
                    <span styleName="price-total">{ totalCost.toFixed(0) }€</span>
                </div>
            </div>
        )
    }

    renderTable() {
        const { capital, duration, interestRate, insuranceRate } = this.props;
        const { datas, mensualityCost } = this.state;

        return (
            <div styleName="table">
                <div styleName="table-container">
                    { this.renderTableHeader() }
                    {
                        datas.map(({
                           month,
                           ratioInterest,
                           ratioCapital,
                           ratioInsurance,
                           costInterest,
                           costCapital,
                           costInsurance,
                           costCumulate,
                        }) => {
                            const result = [];
                            const monthLine = (
                                <div styleName="line">
                                    <div styleName="line-month">{ month + 1 } / { datas.length }</div>
                                    <div styleName="line-cost-capital">
                                        <span styleName="price">{ formatPrice(costCapital) }€</span>
                                        <span styleName="percent">({ (ratioCapital*100).toFixed(1) }%)</span>
                                    </div>
                                    <div styleName="line-cost-interest">
                                        <span styleName="price">{ formatPrice(costInterest) }€</span>
                                        <span styleName="percent">({ (ratioInterest*100).toFixed(1) }%)</span>
                                    </div>
                                    <div styleName="line-cost-insurance">
                                        <span styleName="price">{ formatPrice(costInsurance) }€</span>
                                        <span styleName="percent">({ (ratioInsurance*100).toFixed(1) }%)</span>
                                    </div>
                                    <div styleName="line-cost-cumul">
                                        <span styleName="price">{ formatPrice(costCumulate) }€</span>
                                    </div>
                                </div>
                            );
                            result.push(monthLine);

                            if (!((month+1) % 12)) {
                                const year = Math.ceil(month/12);
                                const costCapitalYear = datas.slice(0, year*12).reduce((acc, { costCapital }) => acc + costCapital, 0);
                                const ratioCapitalYear = datas.slice(0, year*12).reduce((acc, { ratioCapital }) => acc + ratioCapital, 0) / (year * 12);
                                const costInterestYear = datas.slice(0, year*12).reduce((acc, { costInterest }) => acc + costInterest, 0);
                                const ratioInterestYear = datas.slice(0, year*12).reduce((acc, { ratioInterest }) => acc + ratioInterest, 0) / (year * 12);
                                const costInsuranceYear = datas.slice(0, year*12).reduce((acc, { costInsurance }) => acc + costInsurance, 0);
                                const ratioInsuranceYear = datas.slice(0, year*12).reduce((acc, { ratioInsurance }) => acc + ratioInsurance, 0) / (year * 12);
                                const costCumulateYear = datas.slice(year*12-1)[0]['costCumulate'];

                                const yearLine = (
                                    <div styleName="line line-year">
                                        <div styleName="line-month">Année { year }</div>
                                        <div styleName="line-cost-capital">
                                            <span styleName="price">{ formatPrice(costCapitalYear) }€</span>
                                            <span styleName="percent">({ formatPercent(ratioCapitalYear) })</span>
                                        </div>
                                        <div styleName="line-cost-interest">
                                            <span styleName="price">{ formatPrice(costInterestYear) }€</span>
                                            <span styleName="percent">({ formatPercent(ratioInterestYear) })</span>
                                        </div>
                                        <div styleName="line-cost-insurance">
                                            <span styleName="price">{ formatPrice(costInsuranceYear) }€</span>
                                            <span styleName="percent">({ formatPercent(ratioInsuranceYear) })</span>
                                        </div>
                                        <div styleName="line-cost-cumul">
                                            <span styleName="price">{ formatPrice(costCumulateYear) }€</span>
                                        </div>
                                    </div>
                                )
                                result.push(yearLine);
                            }
                            return result;
                        })
                    }
                    { this.renderTableTotal() }
                </div>
            </div>
        )
    }

    render() {
        const { capital, duration, interestRate, insuranceRate } = this.props;

        const ready = capital && duration && typeof interestRate !== 'undefined' && typeof insuranceRate !== 'undefined';

        return (
            <div>
                {
                    ready ?
                        this.renderTable() : 'Missing some params to compute mensuality table'
                }
            </div>
        )
    }
}

MensualityTable.propTypes = {
    capital: PropTypes.string,
    duration: PropTypes.string,
    interestRate: PropTypes.string,
    insuranceRate: PropTypes.string,
};

export default connect(
    MensualityTableSelector,
    null
)(CSSModules(MensualityTable, styles, { allowMultiple: true }));