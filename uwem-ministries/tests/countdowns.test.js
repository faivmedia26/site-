import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNextMonthlyFirstFriday,
  getNextServiceOccurrence,
  getNextWeeklyOccurrence,
} from '../js/countdowns.js';

const WAT = 'Africa/Lagos';
const at = (value) => new Date(value);
const iso = (date) => date?.toISOString();

test('Sunday before the configured service time counts down to the same Sunday', () => {
  const target = getNextWeeklyOccurrence(at('2026-10-25T07:59:00Z'), 0, '09:00', WAT);
  assert.equal(iso(target), '2026-10-25T08:00:00.000Z');
});

test('Sunday after the configured service time rolls forward one week', () => {
  const target = getNextWeeklyOccurrence(at('2026-10-25T08:01:00Z'), 0, '09:00', WAT);
  assert.equal(iso(target), '2026-11-01T08:00:00.000Z');
});

test('Thursday before the configured service time counts down to that Thursday', () => {
  const target = getNextWeeklyOccurrence(at('2026-10-22T16:29:00Z'), 4, '17:30', WAT);
  assert.equal(iso(target), '2026-10-22T16:30:00.000Z');
});

test('Thursday after the configured service time rolls forward one week', () => {
  const target = getNextWeeklyOccurrence(at('2026-10-22T16:31:00Z'), 4, '17:30', WAT);
  assert.equal(iso(target), '2026-10-29T16:30:00.000Z');
});

test('Redemption Night uses this month when its first Friday is still upcoming', () => {
  const target = getNextMonthlyFirstFriday(at('2026-10-02T19:59:00Z'), '21:00', WAT);
  assert.equal(iso(target), '2026-10-02T20:00:00.000Z');
});

test('Redemption Night rolls to next month after the first Friday start time', () => {
  const target = getNextMonthlyFirstFriday(at('2026-10-02T20:01:00Z'), '21:00', WAT);
  assert.equal(iso(target), '2026-11-06T20:00:00.000Z');
});

test('first-Friday logic crosses the December to January boundary', () => {
  const target = getNextMonthlyFirstFriday(at('2026-12-04T20:01:00Z'), '21:00', WAT);
  assert.equal(iso(target), '2027-01-01T20:00:00.000Z');
});

test('first-Friday logic handles a leap year and advances after the event time', () => {
  const before = getNextMonthlyFirstFriday(at('2028-02-03T20:00:00Z'), '21:00', WAT);
  const after = getNextMonthlyFirstFriday(at('2028-02-04T20:01:00Z'), '21:00', WAT);
  assert.equal(iso(before), '2028-02-04T20:00:00.000Z');
  assert.equal(iso(after), '2028-03-03T20:00:00.000Z');
});

test('a missing service time does not create a midnight countdown', () => {
  assert.equal(getNextWeeklyOccurrence(at('2026-10-25T07:59:00Z'), 0, '', WAT), null);
  assert.equal(getNextServiceOccurrence(at('2026-10-25T07:59:00Z'), { cadence: 'monthly-first-friday', time: null }, WAT), null);
});
