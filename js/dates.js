function currentMonthDate(day) {
  const date = new Date();

  date.setDate(
    Math.min(
      day,
      daysInMonth(
        date.getFullYear(),
        date.getMonth()
      )
    )
  );

  return toDateInputValue(date);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function toDateInputValue(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isCurrentMonth(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const now = new Date();

  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function parseLocalDate(dateString) {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    12,
    0,
    0,
    0
  );
}

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function monthStart(monthValue) {
  const [year, month] = monthValue
    .split("-")
    .map(Number);

  return new Date(
    year,
    month - 1,
    1,
    12,
    0,
    0,
    0
  );
}

function monthEnd(monthValue) {
  const start = monthStart(monthValue);

  return new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0,
    12,
    0,
    0,
    0
  );
}

function monthlyOccurrence(anchor, index) {
  const targetMonth = anchor.getMonth() + index;

  const first = new Date(
    anchor.getFullYear(),
    targetMonth,
    1,
    12,
    0,
    0,
    0
  );

  const day = Math.min(
    anchor.getDate(),
    daysInMonth(
      first.getFullYear(),
      first.getMonth()
    )
  );

  return new Date(
    first.getFullYear(),
    first.getMonth(),
    day,
    12,
    0,
    0,
    0
  );
}
