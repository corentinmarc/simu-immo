/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'react-proptypes';
import { connect } from 'react-redux';
import { range } from 'lodash';
import CSSModules from 'react-css-modules';
import numeral from 'numeral';

import MensualityTableSelector from './MensualityTableSelector';
import styles from './MensualityTable.scss';
import MensualityTableHeader from './MensualityTableHeader';

const formatPrice = price => numeral(price).format('0,0');
const formatPercent = price => numeral(price).format('0.0%');

const computeCapitalPercent = (i, {
  duration,
  interestRate,
}) => 1 / ((1 + (interestRate / 12 / 100)) ** (duration * 12 - i)) * 100;

const getAverageCapitalPercent = ({
  capital,
  duration,
  interestRate,
  insuranceRate,
}) => {
  const nbMonth = Number(duration) * 12 || 0;
  return range(0, nbMonth)
    .map(i => computeCapitalPercent(i, {
      capital, duration, interestRate, insuranceRate,
    }), [])
    .reduce((acc, cur) => acc + cur, 0) / nbMonth;
};

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
      notaryCost: 0,
      mensualityCost: 0,
      totalRatioCapital: 0,
      totalRatioInterest: 0,
      totalRatioInsurance: 0,
      intercalaryFees: 0,
      startCost: 0,
      greatTotalCost: 0,
    };
  }

  componentWillMount() {
    this.setState({
      props: this.props,
    });
    this.computeDatas(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      capital,
      duration,
      interestRate,
      insuranceRate,
      notaryRate,
      intercalaryFees,
    } = this.props;
    const {
      capital: nextCapital,
      duration: nextDuration,
      interestRate: nextInterestRate,
      insuranceRate: nextInsuranceRate,
      notaryRate: nextNotaryRate,
      intercalaryFees: nextIntercalaryFees,
    } = nextProps;
    this.setState({
      props: nextProps,
    });
    if (
      capital !== nextCapital
            || duration !== nextDuration
            || interestRate !== nextInterestRate
            || insuranceRate !== nextInsuranceRate
            || notaryRate !== nextNotaryRate
            || intercalaryFees !== nextIntercalaryFees
    ) {
      this.computeDatas(nextProps);
    }
  }

  computeDatas({
    capital,
    duration,
    interestRate,
    insuranceRate,
    notaryRate,
    intercalaryFees,
  }) {
    const nbMonth = Number(duration) * 12 || 0;
    const totalInsurancePercent = insuranceRate * duration;
    const totalCapitalPercent = getAverageCapitalPercent({
      capital, duration, interestRate, insuranceRate,
    });
    let datas = range(0, nbMonth).map((i) => {
      const percentCapital = computeCapitalPercent(i, {
        capital, duration, interestRate, insuranceRate,
      });
      return {
        month: i,
        percentCapital,
        percentInterest: 100 - percentCapital,
        percentInsurance: totalInsurancePercent,
        ratioCapital: percentCapital / (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
        ratioInterest: (100 - percentCapital) / (100 + (totalInsurancePercent * totalCapitalPercent / 100)), //eslint-disable-line
        ratioInsurance: (totalInsurancePercent * totalCapitalPercent / 100) / (100 + (totalInsurancePercent * totalCapitalPercent / 100)), //eslint-disable-line
      };
    });

    const totalRatioInterest = datas.reduce(
      (acc, { ratioInterest }) => acc + ratioInterest, 0,
    ) / nbMonth;
    const totalRatioCapital = datas.reduce(
      (acc, { ratioCapital }) => acc + ratioCapital, 0,
    ) / nbMonth;
    const totalRatioInsurance = datas.reduce(
      (acc, { ratioInsurance }) => acc + ratioInsurance, 0,
    ) / nbMonth;
    const totalCost = capital / totalRatioCapital;
    const totalInterestCost = totalCost * totalRatioInterest;
    const totalInsuranceCost = totalCost * totalRatioInsurance;
    const totalCapitalCost = totalCost * totalRatioCapital;
    const mensualityCost = totalCost / duration / 12;
    const notaryCost = capital * notaryRate / 100;
    const startCost = notaryCost + Number(intercalaryFees);
    const greatTotalCost = totalCost + startCost;

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
      notaryCost,
      greatTotalCost,
      startCost,
      intercalaryFees: Number(intercalaryFees),
    });
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
      greatTotalCost,
    } = this.state;

    return (
      <div styleName="line line-total">
        <div styleName="line-month">TOTAL</div>
        <div styleName="line-cost-capital">
          <span styleName="price-total">
            { formatPrice(totalCapitalCost) }
€
          </span>
          <span styleName="percent-total">
(
            { formatPercent(totalRatioCapital) }
            {' '}
/
            {formatPercent(totalRatioCapital * (totalCost / greatTotalCost))}
            {' '}
)
          </span>
        </div>
        <div styleName="line-cost-interest">
          <span styleName="price-total">
            { formatPrice(totalInterestCost) }
€
          </span>
          <span styleName="percent-total">
(
            { (totalRatioInterest * 100).toFixed(1) }
% /
            {formatPercent(totalRatioInterest * (totalCost / greatTotalCost))}
            {' '}
)
          </span>
        </div>
        <div styleName="line-cost-insurance">
          <span styleName="price-total">
            { formatPrice(totalInsuranceCost) }
€
          </span>
          <span styleName="percent-total">
(
            { (totalRatioInsurance * 100).toFixed(1) }
% /
            {formatPercent(totalRatioInsurance * (totalCost / greatTotalCost))}
            {' '}
)
          </span>
        </div>
        <div styleName="line-cost-cumul">
          <span styleName="price-total">
            { formatPrice(totalCost) }
€
          </span>
        </div>
        <div styleName="line-total-cost-cumul">
          <span styleName="price">
            { formatPrice(greatTotalCost) }
€
          </span>
        </div>
      </div>
    );
  }

  renderTable() {
    const { datas, startCost } = this.state;

    return (
      <div styleName="table">
        <div styleName="table-container">
          <MensualityTableHeader />
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
                              <div styleName="line-month">
                                { month + 1 }
                                {' '}
/
                                {' '}
                                { datas.length }
                              </div>
                              <div styleName="line-cost-capital">
                                <span styleName="price">
                                  { formatPrice(costCapital) }
€
                                </span>
                                <span styleName="percent">
(
                                  { formatPercent(ratioCapital) }
                                  {' '}
)
                                </span>
                              </div>
                              <div styleName="line-cost-interest">
                                <span styleName="price">
                                  { formatPrice(costInterest) }
€
                                </span>
                                <span styleName="percent">
(
                                  { formatPercent(ratioInterest) }
                                  {' '}
)
                                </span>
                              </div>
                              <div styleName="line-cost-insurance">
                                <span styleName="price">
                                  { formatPrice(costInsurance) }
€
                                </span>
                                <span styleName="percent">
(
                                  { formatPercent(ratioInsurance) }
                                  {' '}
)
                                </span>
                              </div>
                              <div styleName="line-cost-cumul">
                                <span styleName="price">
                                  { formatPrice(costCumulate) }
€
                                </span>
                              </div>
                              <div styleName="line-total-cost-cumul">
                                <span styleName="price">
                                  { formatPrice(costCumulate + startCost) }
€
                                </span>
                              </div>
                            </div>
                          );
                          result.push(monthLine);

                          if (!((month + 1) % 12)) {
                            const year = Math.ceil(month / 12);
                            const costCapitalYear = datas.slice(0, year * 12).reduce(
                              (acc, data) => acc + data.costCapital, 0,
                            );
                            const ratioCapitalYear = datas.slice(0, year * 12).reduce(
                              (acc, data) => acc + data.ratioCapital, 0,
                            ) / (year * 12);
                            const costInterestYear = datas.slice(0, year * 12).reduce(
                              (acc, data) => acc + data.costInterest, 0,
                            );
                            const ratioInterestYear = datas.slice(0, year * 12).reduce(
                              (acc, data) => acc + data.ratioInterest, 0,
                            ) / (year * 12);
                            const costInsuranceYear = datas.slice(0, year * 12).reduce(
                              (acc, data) => acc + data.costInsurance, 0,
                            );
                            const ratioInsuranceYear = datas.slice(0, year * 12).reduce(
                              (acc, data) => acc + data.ratioInsurance, 0,
                            ) / (year * 12);
                            const costCumulateYear = datas.slice(year * 12 - 1)[0].costCumulate;

                            const yearLine = (
                              <div styleName="line line-year">
                                <div styleName="line-month">
                                  Année
                                  { year }
                                </div>
                                <div styleName="line-cost-capital">
                                  <span styleName="price">
                                    { formatPrice(costCapitalYear) }
                                    €
                                  </span>
                                  <span styleName="percent">
                                    (
                                    { formatPercent(ratioCapitalYear) }
                                    {' '}
                                    /
                                    { formatPercent(
                                      ratioCapitalYear * costCumulateYear
                                      / (costCumulateYear + startCost),
                                    ) }
                                    )
                                  </span>
                                </div>
                                <div styleName="line-cost-interest">
                                  <span styleName="price">
                                    { formatPrice(costInterestYear) }
                                    €
                                  </span>
                                  <span styleName="percent">
                                    (
                                    { formatPercent(ratioInterestYear) }
                                    {' '}
                                    /
                                    { formatPercent(
                                      ratioInterestYear * costCumulateYear
                                      / (costCumulateYear + startCost),
                                    ) }
                                    )
                                  </span>
                                </div>
                                <div styleName="line-cost-insurance">
                                  <span styleName="price">
                                    { formatPrice(costInsuranceYear) }
                                    €
                                  </span>
                                  <span styleName="percent">
                                    (
                                    { formatPercent(ratioInsuranceYear) }
                                    {' '}
                                    /
                                    { formatPercent(
                                      ratioInsuranceYear * costCumulateYear
                                      / (costCumulateYear + startCost),
                                    ) }
                                    )
                                  </span>
                                </div>
                                <div styleName="line-cost-cumul">
                                  <span styleName="price">
                                    { formatPrice(costCumulateYear) }
                                    €
                                  </span>
                                </div>
                                <div styleName="line-total-cost-cumul">
                                  <span styleName="price">
                                    { formatPrice(costCumulateYear + startCost) }
                                    €
                                  </span>
                                </div>
                              </div>
                            );
                            result.push(yearLine);
                          }
                          return result;
                        })
                    }
          { this.renderTableTotal() }
        </div>
      </div>
    );
  }

  render() {
    const {
      capital, duration, interestRate, insuranceRate,
    } = this.props;

    const ready = capital && duration && typeof interestRate !== 'undefined' && typeof insuranceRate !== 'undefined';

    return (
      <div>
        {
                    ready
                      ? this.renderTable() : 'Missing some params to compute mensuality table'
                }
      </div>
    );
  }
}

MensualityTable.propTypes = {
  capital: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  interestRate: PropTypes.string.isRequired,
  insuranceRate: PropTypes.string.isRequired,
  notaryRate: PropTypes.string.isRequired,
  intercalaryFees: PropTypes.string.isRequired,
};

export default connect(
  MensualityTableSelector,
  null,
)(CSSModules(MensualityTable, styles, { allowMultiple: true }));
