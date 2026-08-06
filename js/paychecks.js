function paycheckFrequencyLabel(frequency) {
  return (
    {
      daily: "Daily",
      weekly: "Weekly",
      biweekly: "Biweekly",
      monthly: "Monthly"
    }[frequency] || frequency
  );
}

function getPaycheckOccurrences(
  schedule,
  rangeStart,
  rangeEnd
) {
  if (!schedule || schedule.status !== "active") {
    return [];
  }

  const anchor = parseLocalDate(
    schedule.startDate
  );

  if (!anchor || anchor > rangeEnd) {
    return [];
  }

  const scheduleEnd = parseLocalDate(
    schedule.endDate
  );

  const effectiveEnd =
    scheduleEnd && scheduleEnd < rangeEnd
      ? scheduleEnd
      : rangeEnd;

  if (
    effectiveEnd < rangeStart ||
    effectiveEnd < anchor
  ) {
    return [];
  }

  const occurrences = [];

  if (schedule.frequency === "monthly") {
    let index = Math.max(
      0,
      (rangeStart.getFullYear() -
        anchor.getFullYear()) *
        12 +
        (rangeStart.getMonth() -
          anchor.getMonth()) -
        1
    );

    let cursor = monthlyOccurrence(
      anchor,
      index
    );

    while (cursor < rangeStart) {
      index += 1;

      cursor = monthlyOccurrence(
        anchor,
        index
      );
    }

    while (
      cursor <= effectiveEnd &&
      occurrences.length < 500
    ) {
      if (cursor >= anchor) {
        occurrences.push(new Date(cursor));
      }

      index += 1;

      cursor = monthlyOccurrence(
        anchor,
        index
      );
    }

    return occurrences;
  }

  const intervalDays =
    schedule.frequency === "daily"
      ? 1
      : schedule.frequency === "weekly"
        ? 7
        : 14;

  const millisecondsPerDay = 86400000;

  const daysFromAnchor = Math.floor(
    (rangeStart - anchor) /
      millisecondsPerDay
  );

  const jumps = Math.max(
    0,
    Math.floor(
      daysFromAnchor / intervalDays
    )
  );

  let cursor = addDays(
    anchor,
    jumps * intervalDays
  );

  while (cursor < rangeStart) {
    cursor = addDays(
      cursor,
      intervalDays
    );
  }

  while (
    cursor <= effectiveEnd &&
    occurrences.length < 500
  ) {
    occurrences.push(new Date(cursor));

    cursor = addDays(
      cursor,
      intervalDays
    );
  }

  return occurrences;
}

function selectedPaycheckMonth() {
  return (
    document.getElementById(
      "paycheckMonthPicker"
    ).value ||
    toDateInputValue(new Date()).slice(0, 7)
  );
}

function paycheckOccurrencesForSelectedMonth() {
  const monthValue = selectedPaycheckMonth();

  const start = monthStart(monthValue);
  const end = monthEnd(monthValue);

  return state.paychecks
    .flatMap((schedule) =>
      getPaycheckOccurrences(
        schedule,
        start,
        end
      ).map((date) => ({
        schedule,
        date
      }))
    )
    .sort(
      (a, b) =>
        a.date - b.date ||
        a.schedule.name.localeCompare(
          b.schedule.name
        )
    );
}

function getNextScheduledPaycheck() {
  const today = new Date();

  today.setHours(12, 0, 0, 0);

  const horizon = new Date(
    today.getFullYear() + 5,
    today.getMonth(),
    today.getDate(),
    12,
    0,
    0,
    0
  );

  return (
    state.paychecks
      .filter(
        (schedule) =>
          schedule.status === "active"
      )
      .map((schedule) => {
        const occurrence =
          getPaycheckOccurrences(
            schedule,
            today,
            horizon
          )[0];

        return occurrence
          ? {
              schedule,
              date: occurrence
            }
          : null;
      })
      .filter(Boolean)
      .sort(
        (a, b) => a.date - b.date
      )[0] || null
  );
}
