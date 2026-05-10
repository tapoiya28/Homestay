const Contract = require('../../src/domain/Contract');

describe('Contract Domain Entity', () => {
    describe('constants', () => {
        test('should have correct CONFIRMATION_STATUSES', () => {
            expect(Contract.CONFIRMATION_STATUSES.UNCONFIRMED).toBe('Unconfirmed');
            expect(Contract.CONFIRMATION_STATUSES.CONFIRMED).toBe('Confirmed');
            expect(Contract.CONFIRMATION_STATUSES.TERMINATED).toBe('Terminated');
        });
    });

    describe('isConfirmed()', () => {
        test('should return true for Confirmed contracts', () => {
            expect(Contract.isConfirmed({ confirmation_status: 'Confirmed' })).toBe(true);
        });

        test('should return false for non-Confirmed contracts', () => {
            expect(Contract.isConfirmed({ confirmation_status: 'Unconfirmed' })).toBe(false);
            expect(Contract.isConfirmed({ confirmation_status: 'Terminated' })).toBe(false);
        });
    });

    describe('isTerminated()', () => {
        test('should return true for Terminated contracts', () => {
            expect(Contract.isTerminated({ confirmation_status: 'Terminated' })).toBe(true);
        });

        test('should return false for non-Terminated contracts', () => {
            expect(Contract.isTerminated({ confirmation_status: 'Confirmed' })).toBe(false);
            expect(Contract.isTerminated({ confirmation_status: 'Unconfirmed' })).toBe(false);
        });
    });

    describe('isActive()', () => {
        test('should return false for Terminated contract', () => {
            expect(Contract.isActive({ confirmation_status: 'Terminated' })).toBe(false);
        });

        test('should return true for Confirmed or Unconfirmed', () => {
            expect(Contract.isActive({ confirmation_status: 'Confirmed' })).toBe(true);
            expect(Contract.isActive({ confirmation_status: 'Unconfirmed' })).toBe(true);
        });
    });

    describe('monthsStayed()', () => {
        test('should calculate months between start_date and given date', () => {
            const contract = { start_date: '2024-01-01' };
            const asOf = new Date('2024-07-01');
            expect(Contract.monthsStayed(contract, asOf)).toBe(6);
        });

        test('should return 0 for same month', () => {
            const contract = { start_date: '2024-01-15' };
            const asOf = new Date('2024-01-30');
            expect(Contract.monthsStayed(contract, asOf)).toBe(0);
        });

        test('should return negative if asOf is before start', () => {
            const contract = { start_date: '2024-06-01' };
            const asOf = new Date('2024-01-01');
            expect(Contract.monthsStayed(contract, asOf)).toBeLessThan(0);
        });
    });

    describe('isFullTerm()', () => {
        test('should return true if checkoutDate >= end_date', () => {
            const contract = { end_date: '2025-01-01' };
            expect(Contract.isFullTerm(contract, new Date('2025-01-01'))).toBe(true);
            expect(Contract.isFullTerm(contract, new Date('2025-06-01'))).toBe(true);
        });

        test('should return false if checkoutDate < end_date', () => {
            const contract = { end_date: '2025-01-01' };
            expect(Contract.isFullTerm(contract, new Date('2024-12-01'))).toBe(false);
        });
    });

    describe('totalDurationMonths()', () => {
        test('should calculate full contract duration', () => {
            const contract = { start_date: '2024-01-01', end_date: '2025-01-01' };
            expect(Contract.totalDurationMonths(contract)).toBe(12);
        });

        test('should calculate 6 month contract', () => {
            const contract = { start_date: '2024-01-01', end_date: '2024-07-01' };
            expect(Contract.totalDurationMonths(contract)).toBe(6);
        });
    });
});
