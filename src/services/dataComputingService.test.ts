import { computeDatas } from './dataComputingService';

describe('Services/dataComputingService', () => {
  describe('computeDatas', () => {
    const dataTest1 = {
      capital: 100000,
      duration: 1,
      interestRate: 2,
      insuranceRate: 0.3,
      notaryRate: 3,
      intercalaryFees: 6000,
    };
    test('Snapshot of computedDatas', () => {
      const cumputedDatas = computeDatas(dataTest1);

      expect(cumputedDatas).toMatchSnapshot();
    });
  });
});
