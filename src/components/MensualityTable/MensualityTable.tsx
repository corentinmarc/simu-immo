/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { range } from 'lodash-es';
import numeral from 'numeral';
import classnames from 'classnames';

import MensualityTableSelector from './MensualityTableSelector';
import styles from './MensualityTable.scss';
import MensualityTableHeader from './MensualityTableHeader';

const formatPrice = (price: number) => numeral(price).format('0,0');
const formatPercent = (price: number) => numeral(price).format('0.0%');

const computeCapitalPercent = (i: number, {
  duration,
  interestRate,
}: {
  duration: number,
  interestRate: number,
}) => 1 / ((1 + (interestRate / 12 / 100)) ** (duration * 12 - i)) * 100;

const getAverageCapitalPercent = ({
  duration,
  interestRate,
}: {
  duration: number,
  interestRate: number,
}) => {
  const nbMonth = Number(duration) * 12 || 0;
  return range(0, nbMonth)
    .map(i => computeCapitalPercent(i, { duration, interestRate }), [])
    .reduce((acc, cur) => acc + cur, 0) / nbMonth;
};

interface Data {
  month: number;
  ratioInterest: number;
  ratioCapital: number;
  ratioInsurance: number;
  costInterest: number;
  costCapital: number;
  costInsurance: number;
  costCumulate: number;
  percentCapital: number;
  percentInterest: number;
  percentInsurance: number;
}

export interface StateProps {
  capital: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  notaryRate: number;
  intercalaryFees: number;
}

interface DispatchProps {}

type AllProps = StateProps & DispatchProps;

interface State {
  props: AllProps;
  datas: Data[];
  totalCost: number;
  totalInterestCost: number;
  totalCapitalCost: number;
  totalInsuranceCost: number;
  notaryCost: number;
  mensualityCost: number;
  totalRatioCapital: number;
  totalRatioInterest: number;
  totalRatioInsurance: number;
  intercalaryFees: number;
  startCost: number;
  greatTotalCost: number;
}

class MensualityTable extends Component<AllProps, State> {
  state = {
    props: {} as AllProps,
    datas: [] as Data[],
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

  componentWillMount() {
    this.setState({
      props: this.props,
    });
    this.computeDatas(this.props);
  }

  componentWillReceiveProps(nextProps: AllProps) {
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

  computeDatas = ({
    capital,
    duration,
    interestRate,
    insuranceRate,
    notaryRate,
    intercalaryFees,
  }: {
    capital: number,
    duration: number,
    interestRate: number,
    insuranceRate: number,
    notaryRate: number,
    intercalaryFees: number,
  }) => {
    const nbMonth = Number(duration) * 12 || 0;
    const totalInsurancePercent = insuranceRate * duration;
    const totalCapitalPercent = getAverageCapitalPercent({ duration, interestRate });
    let datas = range(0, nbMonth).map((i) => {
      const percentCapital = computeCapitalPercent(i, { duration, interestRate });
      return {
        percentCapital,
        month: i,
        percentInterest: 100 - percentCapital,
        percentInsurance: totalInsurancePercent,
        ratioCapital: percentCapital / (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
        ratioInterest: (100 - percentCapital) /
          (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
        ratioInsurance: (totalInsurancePercent * totalCapitalPercent / 100) /
          (100 + (totalInsurancePercent * totalCapitalPercent / 100)),
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
      datas: datas as Data[],
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
      <div className={classnames(styles.line, styles['line-total'])}>
        <div className={styles['line-month']}>TOTAL</div>
        <div className={styles['line-cost-capital']}>
          <span className={styles['price-total']}>
            { formatPrice(totalCapitalCost) } &euro;
          </span>
          <span className={styles['percent-total']}>
            ( { formatPercent(totalRatioCapital) } /
              {formatPercent(totalRatioCapital * (totalCost / greatTotalCost))} )
          </span>
        </div>
        <div className={styles['line-cost-interest']}>
          <span className={styles['price-total']}>
            { formatPrice(totalInterestCost) } &euro;
          </span>
          <span className={styles['percent-total']}>
            ( { (totalRatioInterest * 100).toFixed(1) } % /
              {formatPercent(totalRatioInterest * (totalCost / greatTotalCost))} )
          </span>
        </div>
        <div className={styles['line-cost-insurance']}>
          <span className={styles['price-total']}>
            { formatPrice(totalInsuranceCost) } &euro;
          </span>
          <span className={styles['percent-total']}>
            ( { (totalRatioInsurance * 100).toFixed(1) } % /
              {formatPercent(totalRatioInsurance * (totalCost / greatTotalCost))} )
          </span>
        </div>
        <div className={styles['line-cost-cumul']}>
          <span className={styles['price-total']}>
            { formatPrice(totalCost) } &euro;
          </span>
        </div>
        <div className={styles['line-total-cost-cumul']}>
          <span className={styles['price']}>
            { formatPrice(greatTotalCost) } &euro;
          </span>
        </div>
      </div>
    );
  }

  renderTable() {
    const { datas, startCost } = this.state;

    return (
      <div className={styles['table']}>
        <div className={styles['table-container']}>
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
                <div className={styles['line']}>
                  <div className={styles['line-month']}>
                    { month + 1 } / { datas.length }
                  </div>
                  <div className={styles['line-cost-capital']}>
                    <span className={styles['price']}>
                      { formatPrice(costCapital) } &euro;
                    </span>
                    <span className={styles['percent']}>
                      ( { formatPercent(ratioCapital) } )
                    </span>
                  </div>
                  <div className={styles['line-cost-interest']}>
                    <span className={styles['price']}>
                      { formatPrice(costInterest) } &euro;
                    </span>
                    <span className={styles['percent']}>
                      ( { formatPercent(ratioInterest) } )
                    </span>
                  </div>
                  <div className={styles['line-cost-insurance']}>
                    <span className={styles['price']}>
                      { formatPrice(costInsurance) } &euro;
                    </span>
                    <span className={styles['percent']}>
                      ( { formatPercent(ratioInsurance) } )
                    </span>
                  </div>
                  <div className={styles['line-cost-cumul']}>
                    <span className={styles['price']}>
                      { formatPrice(costCumulate) } &euro;
                    </span>
                  </div>
                  <div className={styles['line-total-cost-cumul']}>
                    <span className={styles['price']}>
                      { formatPrice(costCumulate + startCost) } &euro;
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
                  <div className={classnames(styles['line'], styles['line-year'])}>
                    <div className={styles['line-month']}>
                      Ann&eacute;e { year }
                    </div>
                    <div className={styles['line-cost-capital']}>
                      <span className={styles['price']}>
                        { formatPrice(costCapitalYear) } &euro;
                      </span>
                      <span className={styles['percent']}>
                        ( { formatPercent(ratioCapitalYear) } /
                        { formatPercent(
                          ratioCapitalYear * costCumulateYear
                          / (costCumulateYear + startCost),
                        ) }
                        )
                      </span>
                    </div>
                    <div className={styles['line-cost-interest']}>
                      <span className={styles['price']}>
                        { formatPrice(costInterestYear) } &euro;
                      </span>
                      <span className={styles['percent']}>
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
                    <div className={styles['line-cost-insurance']}>
                      <span className={styles['price']}>
                        { formatPrice(costInsuranceYear) } &euro;
                      </span>
                      <span className={styles['percent']}>
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
                    <div className={styles['line-cost-cumul']}>
                      <span className={styles['price']}>
                        { formatPrice(costCumulateYear) } &euro;
                      </span>
                    </div>
                    <div className={styles['line-total-cost-cumul']}>
                      <span className={styles['price']}>
                        { formatPrice(costCumulateYear + startCost) } &euro;
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

    const ready = capital && duration &&
      typeof interestRate !== 'undefined' && typeof insuranceRate !== 'undefined';

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

export default connect(
  MensualityTableSelector,
  null,
)(MensualityTable);
