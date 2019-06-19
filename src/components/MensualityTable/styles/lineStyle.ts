import { css } from '@emotion/core';

const lineCSS = css`
  display: flex;
  height: 35px;
  box-sizing: border-box;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 8px;
`;

const lineHeaderCSS = css`
  position: absolute;
  top: 0;
  height: 50px;
  width: 100%;
  background: #f5f5f5;
  border: 1px solid #bbb;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.05);
  font-weight: bold;
  color: #333;
`;

const lineYearCSS = css`
  height: 45px;
  width: 100%;
  background: #f5f5f5;
  border: 1px solid #bbb;
  font-weight: bold;
  color: #333;
`;

const lineTotalCSS = css`
  position: absolute;
  bottom: 0;
  height: 50px;
  width: 100%;
  background: #f5f5f5;
  border: 1px solid #bbb;
  box-shadow: 0px -3px 3px rgba(0, 0, 0, 0.05);
  font-weight: bold;
  color: #333;
`;

const getLineItemStyle = (grow: number = 1) => css`
  flex-basis: 100px;
  flex-shrink: 0;
  flex-grow: ${grow};
`;

const lineMonthCSS = getLineItemStyle();
const linePercentInterestCSS = getLineItemStyle(2);
const linePercentCapitalCSS = getLineItemStyle(2);
const linePercentInsuranceCSS = getLineItemStyle(2);
const lineCostInterestCSS = getLineItemStyle(2);
const lineCostCapitalCSS = getLineItemStyle(2);
const lineCostInsuranceCSS = getLineItemStyle(2);
const lineCostCumulCSS = getLineItemStyle(2);
const lineTotalCostCumulCSS = getLineItemStyle(2);

export {
  lineCSS,
  lineHeaderCSS,
  lineMonthCSS,
  lineYearCSS,
  lineTotalCSS,
  linePercentInterestCSS,
  linePercentCapitalCSS,
  linePercentInsuranceCSS,
  lineCostInterestCSS,
  lineCostCapitalCSS,
  lineCostInsuranceCSS,
  lineCostCumulCSS,
  lineTotalCostCumulCSS,
};
