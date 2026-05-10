const Room = require('../../src/domain/Room');

describe('Room Domain Entity', () => {
    describe('STATUSES constants', () => {
        test('should have AVAILABLE and FULL statuses', () => {
            expect(Room.STATUSES.AVAILABLE).toBe('Available');
            expect(Room.STATUSES.FULL).toBe('Full');
        });
    });

    describe('GENDER_POLICIES constants', () => {
        test('should have MALE, FEMALE, MIXED policies', () => {
            expect(Room.GENDER_POLICIES.MALE).toBe('Male');
            expect(Room.GENDER_POLICIES.FEMALE).toBe('Female');
            expect(Room.GENDER_POLICIES.MIXED).toBe('Mixed');
        });
    });

    describe('isGenderCompatible()', () => {
        test('Mixed room should accept any gender', () => {
            expect(Room.isGenderCompatible('Mixed', 'Male')).toBe(true);
            expect(Room.isGenderCompatible('Mixed', 'Female')).toBe(true);
        });

        test('Male room should only accept Male', () => {
            expect(Room.isGenderCompatible('Male', 'Male')).toBe(true);
            expect(Room.isGenderCompatible('Male', 'Female')).toBe(false);
        });

        test('Female room should only accept Female', () => {
            expect(Room.isGenderCompatible('Female', 'Female')).toBe(true);
            expect(Room.isGenderCompatible('Female', 'Male')).toBe(false);
        });

        test('should allow no gender specified (undefined)', () => {
            expect(Room.isGenderCompatible('Male', undefined)).toBe(true);
            expect(Room.isGenderCompatible('Female', null)).toBe(true);
        });
    });

    describe('hasAvailableCapacity()', () => {
        test('should return true if available_beds >= requiredCount', () => {
            expect(Room.hasAvailableCapacity({ available_beds: 3 }, 1)).toBe(true);
            expect(Room.hasAvailableCapacity({ available_beds: 3 }, 3)).toBe(true);
        });

        test('should return false if available_beds < requiredCount', () => {
            expect(Room.hasAvailableCapacity({ available_beds: 2 }, 3)).toBe(false);
            expect(Room.hasAvailableCapacity({ available_beds: 0 }, 1)).toBe(false);
        });

        test('default requiredCount should be 1', () => {
            expect(Room.hasAvailableCapacity({ available_beds: 1 })).toBe(true);
            expect(Room.hasAvailableCapacity({ available_beds: 0 })).toBe(false);
        });
    });

    describe('resolveStatus()', () => {
        test('should return Available when beds > 0', () => {
            expect(Room.resolveStatus(1)).toBe('Available');
            expect(Room.resolveStatus(5)).toBe('Available');
        });

        test('should return Full when beds = 0', () => {
            expect(Room.resolveStatus(0)).toBe('Full');
        });
    });
});
