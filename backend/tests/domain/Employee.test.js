const Employee = require('../../src/domain/Employee');

describe('Employee Domain Entity', () => {
    describe('ROLES constants', () => {
        test('should have SALE, ACCOUNTANT, MANAGER', () => {
            expect(Employee.ROLES.SALE).toBe('sale');
            expect(Employee.ROLES.ACCOUNTANT).toBe('accountant');
            expect(Employee.ROLES.MANAGER).toBe('manager');
        });
    });

    describe('isValidRole()', () => {
        test('should return true for valid roles', () => {
            expect(Employee.isValidRole('sale')).toBe(true);
            expect(Employee.isValidRole('accountant')).toBe(true);
            expect(Employee.isValidRole('manager')).toBe(true);
        });

        test('should return false for invalid roles', () => {
            expect(Employee.isValidRole('admin')).toBe(false);
            expect(Employee.isValidRole('')).toBe(false);
            expect(Employee.isValidRole(null)).toBe(false);
        });
    });

    describe('isSale()', () => {
        test('should return true for sale employee', () => {
            expect(Employee.isSale({ role: 'sale' })).toBe(true);
        });
        test('should return false otherwise', () => {
            expect(Employee.isSale({ role: 'manager' })).toBe(false);
        });
    });

    describe('isManager()', () => {
        test('should return true for manager', () => {
            expect(Employee.isManager({ role: 'manager' })).toBe(true);
        });
        test('should return false otherwise', () => {
            expect(Employee.isManager({ role: 'sale' })).toBe(false);
        });
    });

    describe('isAccountant()', () => {
        test('should return true for accountant', () => {
            expect(Employee.isAccountant({ role: 'accountant' })).toBe(true);
        });
        test('should return false otherwise', () => {
            expect(Employee.isAccountant({ role: 'sale' })).toBe(false);
        });
    });
});
