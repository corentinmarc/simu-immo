/** @jsx jsx */
import { jsx } from '@emotion/core';

import {
  lineCSS,
  lineHeaderCSS,
  lineMonthCSS,
  lineCostCapitalCSS,
  lineCostInterestCSS,
  lineCostInsuranceCSS,
  lineCostCumulCSS,
  lineTotalCostCumulCSS,
} from '../styles/lineStyle';

const MensualityTableHeader = () => (
  <div css={[lineCSS, lineHeaderCSS]}>
    <div css={lineMonthCSS}>Mensualit&eacute; n°</div>
    <div css={lineCostCapitalCSS}>Capital rembours&eacute;</div>
    <div css={lineCostInterestCSS}>Co&ucirc;t int&eacute;r&ecirc;t</div>
    <div css={lineCostInsuranceCSS}>Co&ucirc;t assurance</div>
    <div css={lineCostCumulCSS}>Co&ucirc;t cumul&eacute;</div>
    <div css={lineTotalCostCumulCSS}>
      Co&ucirc;t cumul&eacute; total
      <sub>(notaire et frais intercalaires inclus)</sub>
    </div>
  </div>
);

export default MensualityTableHeader;
