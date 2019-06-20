import { computeDatas } from './dataComputingService';

describe('Services/dataComputingService', () => {
  describe('computeDatas', () => {
    const dataTest1 = {
      capital: 100000,
      duration: 25 * 12,
      interestRate: 2,
      insuranceRate: 0.3,
      notaryRate: 3,
      intercalaryFees: 6000,
    };
    test('should write some tests !', () => {
      const shouldWriteSomeTest = true;

      computeDatas(dataTest1);

      expect(shouldWriteSomeTest).toBe(true);
    });
  });
});
