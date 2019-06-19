/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
  lineCSS,
  lineTotalCSS,
  lineMonthCSS,
  lineCostCapitalCSS,
  lineCostInterestCSS,
  lineCostInsuranceCSS,
  lineCostCumulCSS,
  lineTotalCostCumulCSS,
} from '../styles/lineStyle';
import { percentTotalCSS } from '../styles/percentStyle';
import { priceCSS, priceTotalCSS } from '../styles/priceStyle';
import { formatPrice } from '../formatters/formatPrice';
import { formatPercent } from '../formatters/formatPercent';

type Props = {
  totalCapitalCost: number;
  totalRatioCapital: number;
  totalCost: number;
  greatTotalCost: number;
  totalInterestCost: number;
  totalRatioInterest: number;
  totalRatioInsurance: number;
  totalInsuranceCost: number;
};

const MensualityTableTotal = ({
  totalCapitalCost,
  totalRatioCapital,
  totalCost,
  greatTotalCost,
  totalInterestCost,
  totalRatioInterest,
  totalRatioInsurance,
  totalInsuranceCost,
}: Props) => (
  <div css={[lineCSS, lineTotalCSS]}>
    <div css={lineMonthCSS}>TOTAL</div>
    <div css={lineCostCapitalCSS}>
      <span css={priceTotalCSS}>{formatPrice(totalCapitalCost)} &euro;</span>
      <span css={percentTotalCSS}>
        ( {formatPercent(totalRatioCapital)} /
        {formatPercent(totalRatioCapital * (totalCost / greatTotalCost))} )
      </span>
    </div>
    <div css={lineCostInterestCSS}>
      <span css={priceTotalCSS}>{formatPrice(totalInterestCost)} &euro;</span>
      <span css={percentTotalCSS}>
        ( {(totalRatioInterest * 100).toFixed(1)} % /
        {formatPercent(totalRatioInterest * (totalCost / greatTotalCost))} )
      </span>
    </div>
    <div css={lineCostInsuranceCSS}>
      <span css={priceTotalCSS}>{formatPrice(totalInsuranceCost)} &euro;</span>
      <span css={percentTotalCSS}>
        ( {(totalRatioInsurance * 100).toFixed(1)} % /
        {formatPercent(totalRatioInsurance * (totalCost / greatTotalCost))} )
      </span>
    </div>
    <div css={lineCostCumulCSS}>
      <span css={priceTotalCSS}>{formatPrice(totalCost)} &euro;</span>
    </div>
    <div css={lineTotalCostCumulCSS}>
      <span css={priceCSS}>{formatPrice(greatTotalCost)} &euro;</span>
    </div>
  </div>
);

export default MensualityTableTotal;
