import { range } from 'lodash-es';
import { ComputedData, MonthData } from 'types/data';

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

// @todo use a worker to make those computations
const computeDatas = ({
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
}): ComputedData => {
  const nbMonth = Number(duration) * 12 || 0;
  const totalInsurancePercent = insuranceRate * duration;
  const totalCapitalPercent = getAverageCapitalPercent({
    duration,
    interestRate,
  });

  let monthsDatas = range(0, nbMonth).map(i => {
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
  }) as MonthData[];

  const totalRatioInterest =
    monthsDatas.reduce((acc, { ratioInterest }) => acc + ratioInterest, 0) /
    nbMonth;
  const totalRatioCapital =
    monthsDatas.reduce((acc, { ratioCapital }) => acc + ratioCapital, 0) /
    nbMonth;
  const totalRatioInsurance =
    monthsDatas.reduce((acc, { ratioInsurance }) => acc + ratioInsurance, 0) /
    nbMonth;
  const totalCost = capital / totalRatioCapital;
  const totalInterestCost = totalCost * totalRatioInterest;
  const totalInsuranceCost = totalCost * totalRatioInsurance;
  const totalCapitalCost = totalCost * totalRatioCapital;
  const mensualityCost = totalCost / duration / 12;
  const notaryCost = (capital * notaryRate) / 100;
  const startCost = notaryCost + Number(intercalaryFees);
  const greatTotalCost = totalCost + startCost;

  monthsDatas = monthsDatas.map((monthData, i) => ({
    ...monthData,
    costInterest: mensualityCost * monthData.ratioInterest,
    costCapital: mensualityCost * monthData.ratioCapital,
    costInsurance: mensualityCost * monthData.ratioInsurance,
    costCumulate: mensualityCost * (i + 1),
  }));

  return {
    totalInterestCost,
    totalInsuranceCost,
    totalCapitalCost,
    greatTotalCost,
    totalRatioCapital,
    totalRatioInterest,
    totalRatioInsurance,
    totalCost,
    mensualityCost,
    notaryCost,
    startCost,
    monthsDatas,
    intercalaryFees: +intercalaryFees,
  };
};

export { computeDatas };
