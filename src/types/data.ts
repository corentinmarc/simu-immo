export type MonthData = {
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
};

export type ComputedData = {
  monthsDatas: MonthData[];
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
};
