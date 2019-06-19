/** @jsx jsx */
import { Component } from 'react';
import { jsx, css } from '@emotion/core';

import { setComputingData, setComputedData } from 'actions/data';
import { sansSerif } from 'styles/fonts';
import { computeDatas } from 'services/dataComputingService';
import { ComputedData } from 'types/data';

import {
  lineCSS,
  lineCostCapitalCSS,
  lineCostCumulCSS,
  lineCostInsuranceCSS,
  lineCostInterestCSS,
  lineMonthCSS,
  lineTotalCostCumulCSS,
  lineYearCSS,
} from './styles/lineStyle';
import { percentCSS } from './styles/percentStyle';
import { priceCSS } from './styles/priceStyle';
import { formatPrice } from './formatters/formatPrice';
import { formatPercent } from './formatters/formatPercent';
import { MensualityTableHeader } from './MensualityTableHeader';
import { MensualityTableTotal } from './MensualityTableTotal';

const tableCSS = css`
  position: relative;
  max-height: 500px;
  padding: 50px 0;
  font-family: ${sansSerif};
`;

const tableContainerCSS = css`
  max-height: 500px;
  overflow: scroll;
`;

export type MensualityTableStateProps = {
  capital: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  notaryRate: number;
  intercalaryFees: number;
  isComputing: boolean;
  computedData: ComputedData | null;
};

export type MensualityTableDispatchProps = {
  setComputingData: typeof setComputingData;
  setComputedData: typeof setComputedData;
};

type AllProps = MensualityTableStateProps & MensualityTableDispatchProps;

type State = {
  props: AllProps;
};

class MensualityTable extends Component<AllProps, State> {
  state = {
    props: {} as AllProps,
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
      capital !== nextCapital ||
      duration !== nextDuration ||
      interestRate !== nextInterestRate ||
      insuranceRate !== nextInsuranceRate ||
      notaryRate !== nextNotaryRate ||
      intercalaryFees !== nextIntercalaryFees
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
    capital: number;
    duration: number;
    interestRate: number;
    insuranceRate: number;
    notaryRate: number;
    intercalaryFees: number;
  }) => {
    // @todo use saga to trigger data computation and isComputing flag management
    this.props.setComputingData({ isComputing: true });

    setTimeout(() => {
      const computedDatas = computeDatas({
        capital,
        duration,
        insuranceRate,
        intercalaryFees,
        interestRate,
        notaryRate,
      });

      this.props.setComputedData(computedDatas);
      this.props.setComputingData({ isComputing: false });
    }, 0);
  };

  renderTable() {
    if (!this.props.computedData) {
      return;
    }

    const {
      monthsDatas,
      startCost,
      totalRatioCapital,
      totalRatioInsurance,
      totalRatioInterest,
      totalInterestCost,
      totalCapitalCost,
      totalInsuranceCost,
      totalCost,
      greatTotalCost,
    } = this.props.computedData;

    const { isComputing } = this.props;

    if (isComputing) {
      return <div>computing...</div>;
    }

    return (
      <div css={tableCSS}>
        <div css={tableContainerCSS}>
          <MensualityTableHeader />
          {monthsDatas.map(
            ({
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
                <div key={`month-${month}`} css={lineCSS}>
                  <div css={lineMonthCSS}>
                    {month + 1} / {monthsDatas.length}
                  </div>
                  <div css={lineCostCapitalCSS}>
                    <span css={priceCSS}>
                      {formatPrice(costCapital)} &euro;
                    </span>
                    <span css={percentCSS}>
                      ( {formatPercent(ratioCapital)} )
                    </span>
                  </div>
                  <div css={lineCostInterestCSS}>
                    <span css={priceCSS}>
                      {formatPrice(costInterest)} &euro;
                    </span>
                    <span css={percentCSS}>
                      ( {formatPercent(ratioInterest)} )
                    </span>
                  </div>
                  <div css={lineCostInsuranceCSS}>
                    <span css={priceCSS}>
                      {formatPrice(costInsurance)} &euro;
                    </span>
                    <span css={percentCSS}>
                      ( {formatPercent(ratioInsurance)} )
                    </span>
                  </div>
                  <div css={lineCostCumulCSS}>
                    <span css={priceCSS}>
                      {formatPrice(costCumulate)} &euro;
                    </span>
                  </div>
                  <div css={lineTotalCostCumulCSS}>
                    <span css={priceCSS}>
                      {formatPrice(costCumulate + startCost)} &euro;
                    </span>
                  </div>
                </div>
              );
              result.push(monthLine);

              if (!((month + 1) % 12)) {
                const year = Math.ceil(month / 12);
                const costCapitalYear = monthsDatas
                  .slice(0, year * 12)
                  .reduce((acc, data) => acc + data.costCapital, 0);
                const ratioCapitalYear =
                  monthsDatas
                    .slice(0, year * 12)
                    .reduce((acc, data) => acc + data.ratioCapital, 0) /
                  (year * 12);
                const costInterestYear = monthsDatas
                  .slice(0, year * 12)
                  .reduce((acc, data) => acc + data.costInterest, 0);
                const ratioInterestYear =
                  monthsDatas
                    .slice(0, year * 12)
                    .reduce((acc, data) => acc + data.ratioInterest, 0) /
                  (year * 12);
                const costInsuranceYear = monthsDatas
                  .slice(0, year * 12)
                  .reduce((acc, data) => acc + data.costInsurance, 0);
                const ratioInsuranceYear =
                  monthsDatas
                    .slice(0, year * 12)
                    .reduce((acc, data) => acc + data.ratioInsurance, 0) /
                  (year * 12);
                const costCumulateYear = monthsDatas.slice(year * 12 - 1)[0]
                  .costCumulate;

                const yearLine = (
                  <div key={`year-${year}`} css={[lineCSS, lineYearCSS]}>
                    <div css={lineMonthCSS}>Ann&eacute;e {year}</div>
                    <div css={lineCostCapitalCSS}>
                      <span css={priceCSS}>
                        {formatPrice(costCapitalYear)} &euro;
                      </span>
                      <span css={percentCSS}>
                        ( {formatPercent(ratioCapitalYear)} /
                        {formatPercent(
                          (ratioCapitalYear * costCumulateYear) /
                            (costCumulateYear + startCost),
                        )}
                        )
                      </span>
                    </div>
                    <div css={lineCostInterestCSS}>
                      <span css={priceCSS}>
                        {formatPrice(costInterestYear)} &euro;
                      </span>
                      <span css={percentCSS}>
                        ({formatPercent(ratioInterestYear)} /
                        {formatPercent(
                          (ratioInterestYear * costCumulateYear) /
                            (costCumulateYear + startCost),
                        )}
                        )
                      </span>
                    </div>
                    <div css={lineCostInsuranceCSS}>
                      <span css={priceCSS}>
                        {formatPrice(costInsuranceYear)} &euro;
                      </span>
                      <span css={percentCSS}>
                        ({formatPercent(ratioInsuranceYear)} /
                        {formatPercent(
                          (ratioInsuranceYear * costCumulateYear) /
                            (costCumulateYear + startCost),
                        )}
                        )
                      </span>
                    </div>
                    <div css={lineCostCumulCSS}>
                      <span css={priceCSS}>
                        {formatPrice(costCumulateYear)} &euro;
                      </span>
                    </div>
                    <div css={lineTotalCostCumulCSS}>
                      <span css={priceCSS}>
                        {formatPrice(costCumulateYear + startCost)} &euro;
                      </span>
                    </div>
                  </div>
                );
                result.push(yearLine);
              }
              return result;
            },
          )}
          <MensualityTableTotal
            greatTotalCost={greatTotalCost}
            totalCapitalCost={totalCapitalCost}
            totalCost={totalCost}
            totalInsuranceCost={totalInsuranceCost}
            totalInterestCost={totalInterestCost}
            totalRatioCapital={totalRatioCapital}
            totalRatioInsurance={totalRatioInsurance}
            totalRatioInterest={totalRatioInterest}
          />
        </div>
      </div>
    );
  }

  render() {
    const { capital, duration, interestRate, insuranceRate } = this.props;

    const ready =
      capital &&
      duration &&
      typeof interestRate !== 'undefined' &&
      typeof insuranceRate !== 'undefined';

    return (
      <div>
        {ready
          ? this.renderTable()
          : 'Missing some params to compute mensuality table'}
      </div>
    );
  }
}

export default MensualityTable;
