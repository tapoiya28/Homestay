const DepositReceipt = require('../../src/domain/DepositReceipt');

describe('DepositReceipt Domain Entity', () => {
    describe('STATUSES constants', () => {
        test('should have all statuses', () => {
            expect(DepositReceipt.STATUSES.PENDING).toBe('Pending Payment');
            expect(DepositReceipt.STATUSES.PAID).toBe('Paid');
            expect(DepositReceipt.STATUSES.CANCELLED).toBe('Cancelled');
            expect(DepositReceipt.STATUSES.REFUNDED).toBe('Refunded');
        });
    });

    describe('isPaid()', () => {
        test('should return true for Paid receipt', () => {
            expect(DepositReceipt.isPaid({ status: 'Paid' })).toBe(true);
        });

        test('should return false for non-Paid receipts', () => {
            expect(DepositReceipt.isPaid({ status: 'Pending Payment' })).toBe(false);
            expect(DepositReceipt.isPaid({ status: 'Cancelled' })).toBe(false);
        });
    });

    describe('isPending()', () => {
        test('should return true for Pending Payment receipt', () => {
            expect(DepositReceipt.isPending({ status: 'Pending Payment' })).toBe(true);
        });

        test('should return false for non-Pending receipts', () => {
            expect(DepositReceipt.isPending({ status: 'Paid' })).toBe(false);
        });
    });

    describe('isExpired()', () => {
        test('should return true if payment_deadline has passed', () => {
            const past = new Date(Date.now() - 1000 * 60 * 60).toISOString(); // 1 hour ago
            expect(DepositReceipt.isExpired({ payment_deadline: past })).toBe(true);
        });

        test('should return false if payment_deadline is in the future', () => {
            const future = new Date(Date.now() + 1000 * 60 * 60).toISOString(); // 1 hour later
            expect(DepositReceipt.isExpired({ payment_deadline: future })).toBe(false);
        });

        test('should return false if no payment_deadline', () => {
            expect(DepositReceipt.isExpired({ payment_deadline: null })).toBe(false);
            expect(DepositReceipt.isExpired({})).toBe(false);
        });
    });

    describe('calculateTotalDeposit()', () => {
        test('should return 2x total monthly bed prices', () => {
            const beds = [{ price: 1000 }, { price: 2000 }];
            expect(DepositReceipt.calculateTotalDeposit(beds)).toBe(6000); // (1000+2000) * 2
        });

        test('should handle string prices', () => {
            const beds = [{ price: '1500' }];
            expect(DepositReceipt.calculateTotalDeposit(beds)).toBe(3000);
        });

        test('should return 0 for empty beds array', () => {
            expect(DepositReceipt.calculateTotalDeposit([])).toBe(0);
        });
    });

    describe('DEPOSIT_MONTHS constant', () => {
        test('should be 2', () => {
            expect(DepositReceipt.DEPOSIT_MONTHS).toBe(2);
        });
    });
});
