const Bed = require('../../src/domain/Bed');

describe('Bed Domain Entity', () => {
    describe('STATUSES constants', () => {
        test('should have all 4 statuses', () => {
            expect(Bed.STATUSES.EMPTY).toBe('Empty');
            expect(Bed.STATUSES.RESERVED).toBe('Reserved');
            expect(Bed.STATUSES.DEPOSITED).toBe('Deposited');
            expect(Bed.STATUSES.OCCUPIED).toBe('Occupied');
        });
    });

    describe('isAvailableForDeposit()', () => {
        test('should return true for Empty bed', () => {
            expect(Bed.isAvailableForDeposit({ status: 'Empty' })).toBe(true);
        });

        test('should return false for non-Empty beds', () => {
            expect(Bed.isAvailableForDeposit({ status: 'Reserved' })).toBe(false);
            expect(Bed.isAvailableForDeposit({ status: 'Deposited' })).toBe(false);
            expect(Bed.isAvailableForDeposit({ status: 'Occupied' })).toBe(false);
        });
    });

    describe('isOccupied()', () => {
        test('should return true for Occupied bed only', () => {
            expect(Bed.isOccupied({ status: 'Occupied' })).toBe(true);
            expect(Bed.isOccupied({ status: 'Empty' })).toBe(false);
            expect(Bed.isOccupied({ status: 'Reserved' })).toBe(false);
        });
    });

    describe('isActive()', () => {
        test('should return false for Empty bed', () => {
            expect(Bed.isActive({ status: 'Empty' })).toBe(false);
        });

        test('should return true for non-Empty beds', () => {
            expect(Bed.isActive({ status: 'Reserved' })).toBe(true);
            expect(Bed.isActive({ status: 'Deposited' })).toBe(true);
            expect(Bed.isActive({ status: 'Occupied' })).toBe(true);
        });
    });

    describe('totalMonthlyPrice()', () => {
        test('should sum all bed prices', () => {
            const beds = [{ price: 1000 }, { price: 1500 }, { price: 2000 }];
            expect(Bed.totalMonthlyPrice(beds)).toBe(4500);
        });

        test('should handle string prices from DB', () => {
            const beds = [{ price: '1000' }, { price: '2000' }];
            expect(Bed.totalMonthlyPrice(beds)).toBe(3000);
        });

        test('should handle missing price (default 0)', () => {
            const beds = [{ price: undefined }, { price: 1000 }];
            expect(Bed.totalMonthlyPrice(beds)).toBe(1000);
        });

        test('should return 0 for empty array', () => {
            expect(Bed.totalMonthlyPrice([])).toBe(0);
        });
    });
});
