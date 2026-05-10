const RefundCalculator = require('../../src/strategies/RefundCalculator');

describe('RefundCalculator (Strategy Pattern)', () => {
    const baseDeposit = 6000; // e.g. 2 beds × 1500/month × 2 months

    describe('determineStrategy()', () => {
        test('should return deposit_only when no contract', () => {
            const key = RefundCalculator.determineStrategy(null, new Date());
            expect(key).toBe('deposit_only');
        });

        test('should return full_term when checkOut >= end_date', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            const key = RefundCalculator.determineStrategy(contract, new Date('2025-01-01'));
            expect(key).toBe('full_term');
        });

        test('should return short_term when stayed < 6 months', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            const key = RefundCalculator.determineStrategy(contract, new Date('2024-04-01')); // 3 months
            expect(key).toBe('short_term');
        });

        test('should return long_term when stayed >= 6 months', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            const key = RefundCalculator.determineStrategy(contract, new Date('2024-07-01')); // 6 months
            expect(key).toBe('long_term');
        });
    });

    describe('calculate() - deposit_only (no contract)', () => {
        test('should refund 80% of deposit', () => {
            const result = RefundCalculator.calculate({
                depositAmount: baseDeposit,
                contract: null,
                checkOutDate: new Date(),
                extraCosts: {}
            });
            expect(result.strategyKey).toBe('deposit_only');
            expect(result.refundRate).toBe(0.8);
            expect(result.refundAmount).toBe(baseDeposit * 0.8);
        });
    });

    describe('calculate() - short_term (stayed < 6 months, 50% refund)', () => {
        test('should refund 50% of deposit', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            const result = RefundCalculator.calculate({
                depositAmount: baseDeposit,
                contract,
                checkOutDate: new Date('2024-04-01'),
                extraCosts: {}
            });
            expect(result.strategyKey).toBe('short_term');
            expect(result.refundRate).toBe(0.5);
            expect(result.refundAmount).toBe(baseDeposit * 0.5);
        });
    });

    describe('calculate() - long_term (stayed >= 6 months, 75% refund)', () => {
        test('should refund 70% of deposit', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            const result = RefundCalculator.calculate({
                depositAmount: baseDeposit,
                contract,
                checkOutDate: new Date('2024-07-01'),
                extraCosts: {}
            });
            expect(result.strategyKey).toBe('long_term');
            expect(result.refundRate).toBe(0.7);
            expect(result.refundAmount).toBe(baseDeposit * 0.7);
        });
    });

    describe('calculate() - full_term (100% refund)', () => {
        test('should refund full deposit', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            const result = RefundCalculator.calculate({
                depositAmount: baseDeposit,
                contract,
                checkOutDate: new Date('2025-02-01'),
                extraCosts: {}
            });
            expect(result.strategyKey).toBe('full_term');
            expect(result.refundRate).toBe(1);
            expect(result.refundAmount).toBe(baseDeposit);
        });
    });

    describe('calculate() - with deductions', () => {
        test('should subtract extraCosts from refund', () => {
            // deposit_only rate = 0.8, so baseRefund = 6000 * 0.8 = 4800
            // deductions = 1000 + 500 = 1500 → refundAmount = 4800 - 1500 = 3300
            const result = RefundCalculator.calculate({
                depositAmount: 6000,
                contract: null,
                checkOutDate: new Date(),
                extraCosts: { unpaidRent: 1000, repairCosts: 500 }
            });
            expect(result.deductions.totalDeduction).toBe(1500);
            expect(result.refundAmount).toBe(3300);
        });

        test('additionalAmountDue when deductions exceed deposit', () => {
            // deposit_only rate = 0.8, so baseRefund = 1000 * 0.8 = 800
            // deductions = 2000 → net = 800 - 2000 = -1200 → additionalAmountDue = 1200
            const result = RefundCalculator.calculate({
                depositAmount: 1000,
                contract: null,
                checkOutDate: new Date(),
                extraCosts: { unpaidRent: 2000 }
            });
            expect(result.refundAmount).toBe(0);
            expect(result.additionalAmountDue).toBe(1200);
            expect(result.shouldRefund).toBe(false);
        });
    });
});
