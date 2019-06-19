/** @jsx jsx */
import { Component } from 'react';
import { range } from 'lodash-es';
import { jsx, css } from '@emotion/core';

import { sansSerif } from 'styles/fonts';
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

const computeCapitalPercent = (
  i: number,
  {
    duration,
    interestRate,
  }: {
    duration: number;
    interestRate: number;
  },
) => (1 / (1 + interestRate / 12 / 100) ** (duration * 12 - i)) * 100;

const getAverageCapitalPercent = ({
  duration,
  interestRate,
}: {
  duration: number;
  interestRate: number;
}) => {
  const nbMonth = Number(duration) * 12 || 0;
  return (
    range(0, nbMonth)
      .map(i => computeCapitalPercent(i, { duration, interestRate }), [])
      .reduce((acc, cur) => acc + cur, 0) / nbMonth
  );
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

export type MensualityTableStateProps = {
  capital: number;
  duration: number;
  interestRate: number;
  insuranceRate: number;
  notaryRate: number;
  intercalaryFees: number;
};

export type MensualityTableDispatchProps = {};

type AllProps = MensualityTableStateProps & MensualityTableDispatchProps;

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
  computing: boolean;
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
    computing: false,
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
    const nbMonth = Number(duration) * 12 || 0;
    const totalInsurancePercent = insuranceRate * duration;
    const totalCapitalPercent = getAverageCapitalPercent({
      duration,
      interestRate,
    });

    this.setState({ computing: true }, async () =>
      setTimeout(() => {
        let datas = range(0, nbMonth).map(i => {
          const percentCapital = computeCapitalPercent(i, {
            duration,
            interestRate,
          });
          return {
            percentCapital,
            month: i,
            percentInterest: 100 - percentCapital,
            percentInsurance: totalInsurancePercent,
            ratioCapital:
              percentCapital /
              (100 + (totalInsurancePercent * totalCapitalPercent) / 100),
            ratioInterest:
              (100 - percentCapital) /
              (100 + (totalInsurancePercent * totalCapitalPercent) / 100),
            ratioInsurance:
              (totalInsurancePercent * totalCapitalPercent) /
              100 /
              (100 + (totalInsurancePercent * totalCapitalPercent) / 100),
          };
        });

        const totalRatioInterest =
          datas.reduce((acc, { ratioInterest }) => acc + ratioInterest, 0) /
          nbMonth;
        const totalRatioCapital =
          datas.reduce((acc, { ratioCapital }) => acc + ratioCapital, 0) /
          nbMonth;
        const totalRatioInsurance =
          datas.reduce((acc, { ratioInsurance }) => acc + ratioInsurance, 0) /
          nbMonth;
        const totalCost = capital / totalRatioCapital;
        const totalInterestCost = totalCost * totalRatioInterest;
        const totalInsuranceCost = totalCost * totalRatioInsurance;
        const totalCapitalCost = totalCost * totalRatioCapital;
        const mensualityCost = totalCost / duration / 12;
        const notaryCost = (capital * notaryRate) / 100;
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
          computing: false,
        });
      }, 0),
    );
  };

  renderTable() {
    const {
      datas,
      startCost,
      computing,
      totalRatioCapital,
      totalRatioInsurance,
      totalRatioInterest,
      totalInterestCost,
      totalCapitalCost,
      totalInsuranceCost,
      totalCost,
      greatTotalCost,
    } = this.state;

    if (computing) {
      return <div>computing...</div>;
    }

    return (
      <div css={tableCSS}>
        <div css={tableContainerCSS}>
          <MensualityTableHeader />
          {datas.map(
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
                    {month + 1} / {datas.length}
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
                const costCapitalYear = datas
                  .slice(0, year * 12)
                  .reduce((acc, data) => acc + data.costCapital, 0);
                const ratioCapitalYear =
                  datas
                    .slice(0, year * 12)
                    .reduce((acc, data) => acc + data.ratioCapital, 0) /
                  (year * 12);
                const costInterestYear = datas
                  .slice(0, year * 12)
                  .reduce((acc, data) => acc + data.costInterest, 0);
                const ratioInterestYear =
                  datas
                    .slice(0, year * 12)
                    .reduce((acc, data) => acc + data.ratioInterest, 0) /
                  (year * 12);
                const costInsuranceYear = datas
                  .slice(0, year * 12)
                  .reduce((acc, data) => acc + data.costInsurance, 0);
                const ratioInsuranceYear =
                  datas
                    .slice(0, year * 12)
                    .reduce((acc, data) => acc + data.ratioInsurance, 0) /
                  (year * 12);
                const costCumulateYear = datas.slice(year * 12 - 1)[0]
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
