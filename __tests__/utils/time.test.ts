import { isBefore } from '../../src/utils/time'

describe('time utils', () => {
  it('should return true when date1 is before date2', () => {
    const date1 = new Date(2021, 1, 1);
    const date2 = new Date(2021, 1, 2);
    expect(isBefore(date1, date2)).toBe(true);
  });

  it('should return false when date1 is after date2', () => {
    const date1 = new Date(2021, 1, 2);
    const date2 = new Date(2021, 1, 1);
    expect(isBefore(date1, date2)).toBe(false);
  });

  it('should return false when date1 is the same as date2', () => {
    const date1 = new Date(2021, 1, 1);
    const date2 = new Date(2021, 1, 1);
    expect(isBefore(date1, date2)).toBe(false);
  });

  it('should handle dates with different times', () => {
    const date1 = new Date(2021, 1, 1, 12);
    const date2 = new Date(2021, 1, 1, 13);
    expect(isBefore(date1, date2)).toBe(true);
  });
});