const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_FRIDAY = 5;

function readTime(time) {
  if (typeof time !== 'string') return null;
  const match = /^(\d{2}):([0-5]\d)$/.exec(time);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23) return null;
  return { hour, minute };
}

function getNumericParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  );
}

/** Convert a calendar date and clock time in an IANA zone to a real instant. */
export function zonedDateTimeToUtc({ year, month, day, hour, minute, second = 0 }, timeZone = 'Africa/Lagos') {
  const desiredAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  let candidate = desiredAsUtc;

  // Reconcile the wall clock with the zone offset. Two passes also cover zones
  // whose offset changes around a date boundary; Africa/Lagos itself has no DST.
  for (let pass = 0; pass < 3; pass += 1) {
    const local = getNumericParts(new Date(candidate), timeZone);
    const representedAsUtc = Date.UTC(
      local.year,
      local.month - 1,
      local.day,
      local.hour,
      local.minute,
      local.second,
    );
    const correction = desiredAsUtc - representedAsUtc;
    candidate += correction;
    if (correction === 0) break;
  }

  return new Date(candidate);
}

function localDateParts(date, timeZone) {
  const parts = getNumericParts(date, timeZone);
  return { year: parts.year, month: parts.month, day: parts.day };
}

function getWeeklyCandidate(year, month, day, dayOfWeek, clockTime, timeZone) {
  const localMidnight = new Date(Date.UTC(year, month - 1, day));
  const currentDay = localMidnight.getUTCDay();
  const delta = (dayOfWeek - currentDay + 7) % 7;
  localMidnight.setUTCDate(localMidnight.getUTCDate() + delta);

  return zonedDateTimeToUtc(
    {
      year: localMidnight.getUTCFullYear(),
      month: localMidnight.getUTCMonth() + 1,
      day: localMidnight.getUTCDate(),
      ...clockTime,
    },
    timeZone,
  );
}

/** Return the next occurrence of a weekly event, strictly after `now`. */
export function getNextWeeklyOccurrence(now, dayOfWeek, time, timeZone = 'Africa/Lagos') {
  const clockTime = readTime(time);
  if (!clockTime || !Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) return null;

  const local = localDateParts(now, timeZone);
  let target = getWeeklyCandidate(local.year, local.month, local.day, dayOfWeek, clockTime, timeZone);

  if (target.getTime() <= now.getTime()) {
    const nextLocalDate = new Date(Date.UTC(local.year, local.month - 1, local.day + 7));
    target = zonedDateTimeToUtc(
      {
        year: nextLocalDate.getUTCFullYear(),
        month: nextLocalDate.getUTCMonth() + 1,
        day: nextLocalDate.getUTCDate(),
        ...clockTime,
      },
      timeZone,
    );
  }

  return target;
}

function firstFridayOfMonth(year, month, clockTime, timeZone) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const offset = (WEEKDAY_FRIDAY - firstDay.getUTCDay() + 7) % 7;
  const day = 1 + offset;
  return zonedDateTimeToUtc({ year, month, day, ...clockTime }, timeZone);
}

/** Return the next first-Friday event, rolling forward after its configured time. */
export function getNextMonthlyFirstFriday(now, time, timeZone = 'Africa/Lagos') {
  const clockTime = readTime(time);
  if (!clockTime) return null;

  const local = localDateParts(now, timeZone);
  let year = local.year;
  let month = local.month;
  let target = firstFridayOfMonth(year, month, clockTime, timeZone);

  if (target.getTime() <= now.getTime()) {
    const nextMonth = new Date(Date.UTC(year, month, 1));
    year = nextMonth.getUTCFullYear();
    month = nextMonth.getUTCMonth() + 1;
    target = firstFridayOfMonth(year, month, clockTime, timeZone);
  }

  return target;
}

export function getNextServiceOccurrence(now, service, timeZone = 'Africa/Lagos') {
  if (!service || !readTime(service.time)) return null;
  if (service.cadence === 'monthly-first-friday') {
    return getNextMonthlyFirstFriday(now, service.time, timeZone);
  }
  return getNextWeeklyOccurrence(now, service.dayOfWeek, service.time, timeZone);
}

function formatEventDate(date, timeZone) {
  return new Intl.DateTimeFormat('en-NG', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date) + (timeZone === 'Africa/Lagos' ? ' WAT' : ` (${timeZone})`);
}

function formatServiceTime(time, timeZone) {
  const clock = readTime(time);
  if (!clock) return 'Service time to be confirmed';
  const hour = clock.hour % 12 || 12;
  const period = clock.hour >= 12 ? 'PM' : 'AM';
  const zone = timeZone === 'Africa/Lagos' ? 'WAT' : timeZone;
  return `${hour}:${String(clock.minute).padStart(2, '0')} ${period} ${zone}`;
}

function updateCountdown(card, service, timeZone, now) {
  const dateNode = card.querySelector('[data-next-date]');
  const timeNode = card.querySelector('[data-service-time]');
  const countdown = card.querySelector('[data-countdown-wrap]');
  const target = getNextServiceOccurrence(now, service, timeZone);

  if (!target) {
    if (dateNode) dateNode.textContent = 'Upcoming date will be shared by the church.';
    if (timeNode) timeNode.textContent = 'Service time to be confirmed';
    if (countdown) countdown.hidden = true;
    card.dataset.countdownState = 'unconfigured';
    return;
  }

  if (timeNode) timeNode.textContent = formatServiceTime(service.time, timeZone);
  if (dateNode) {
    const formattedDate = formatEventDate(target, timeZone);
    if (dateNode.textContent !== formattedDate) {
      dateNode.textContent = formattedDate;
      if (dateNode.tagName === 'TIME') dateNode.dateTime = target.toISOString();
    }
  }

  const remaining = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);
  const values = {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };

  for (const [unit, value] of Object.entries(values)) {
    const output = card.querySelector(`[data-countdown-unit="${unit}"]`);
    if (output) output.textContent = String(value).padStart(2, '0');
  }

  const spoken = `${values.days} days, ${values.hours} hours, ${values.minutes} minutes, ${values.seconds} seconds`;
  const timer = card.querySelector('[data-countdown]');
  if (timer) timer.setAttribute('aria-label', `Time until ${service.title}: ${spoken}`);
  if (countdown) countdown.hidden = false;
  card.dataset.countdownState = 'active';
}

/** Start all configured service clocks and return a cleanup function. */
export function initCountdowns(services, timeZone = 'Africa/Lagos', nowProvider = () => new Date()) {
  const cards = [...document.querySelectorAll('[data-service-countdown]')];
  const render = () => {
    const now = nowProvider();
    for (const card of cards) {
      const service = services[card.dataset.serviceCountdown];
      if (service) updateCountdown(card, service, timeZone, now);
    }
  };

  render();
  const intervalId = window.setInterval(render, 1000);
  return () => window.clearInterval(intervalId);
}
