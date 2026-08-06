function renderPaychecks() {
  const monthValue = selectedPaycheckMonth();
  const selectedYear = Number(
    monthValue.slice(0, 4)
  );

  const occurrences =
    paycheckOccurrencesForSelectedMonth();

  const expectedIncome = occurrences.reduce(
    (sum, item) =>
      sum + Number(item.schedule.amount),
    0
  );

  const yearStart = new Date(
    selectedYear,
    0,
    1,
    12,
    0,
    0,
    0
  );

  const yearEnd = new Date(
    selectedYear,
    11,
    31,
    12,
    0,
    0,
    0
  );

  const yearlyIncome = state.paychecks.reduce(
    (sum, schedule) => {
      return (
        sum +
        getPaycheckOccurrences(
          schedule,
          yearStart,
          yearEnd
        ).length *
          Number(schedule.amount)
      );
    },
    0
  );

  const next = getNextScheduledPaycheck();

  document.getElementById(
    "expectedPaycheckIncome"
  ).textContent = currency(expectedIncome);

  document.getElementById(
    "expectedPaycheckCount"
  ).textContent = String(occurrences.length);

  document.getElementById(
    "yearlyPaycheckIncome"
  ).textContent = currency(yearlyIncome);

  document.getElementById(
    "yearlyPaycheckDetail"
  ).textContent =
    `Projected for ${selectedYear}`;

  document.getElementById(
    "nextPaycheckDate"
  ).textContent = next
    ? formatDate(
        toDateInputValue(next.date)
      )
    : "None";

  document.getElementById(
    "nextPaycheckDetail"
  ).textContent = next
    ? `${next.schedule.name} · ${currency(
        next.schedule.amount
      )}`
    : "Add an active schedule";

  const monthLabel =
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric"
    }).format(monthStart(monthValue));

  document.getElementById(
    "paycheckOccurrenceSubtitle"
  ).textContent =
    `Expected payments for ${monthLabel}.`;

  const tbody = document.getElementById(
    "paychecksTable"
  );

  if (!state.paychecks.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            No paycheck schedules yet.
          </div>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = state.paychecks
      .map((schedule) => {
        const scheduleOccurrences =
          occurrences.filter(
            (item) =>
              item.schedule.id === schedule.id
          );

        const scheduleTotal =
          scheduleOccurrences.length *
          Number(schedule.amount);

        return `
          <tr>
            <td>
              <strong>
                ${escapeHtml(schedule.name)}
              </strong>
            </td>

            <td>
              <strong>
                ${currency(schedule.amount)}
              </strong>
            </td>

            <td>
              ${paycheckFrequencyLabel(
                schedule.frequency
              )}
            </td>

            <td>
              ${formatDate(schedule.startDate)}
            </td>

            <td>
              ${scheduleOccurrences.length}
              deposits ·
              ${currency(scheduleTotal)}
            </td>

            <td>
              <span class="pill ${
                schedule.status === "active"
                  ? "pill-income"
                  : "pill-due"
              }">
                ${schedule.status}
              </span>
            </td>

            <td>
              <div class="schedule-actions">
                <button
                  class="button button-secondary button-small"
                  type="button"
                  data-edit-paycheck="${schedule.id}"
                >
                  Edit
                </button>

                <button
                  class="button button-secondary button-small"
                  type="button"
                  data-toggle-paycheck="${schedule.id}"
                >
                  ${
                    schedule.status === "active"
                      ? "Pause"
                      : "Activate"
                  }
                </button>

                <button
                  class="icon-button"
                  type="button"
                  data-delete-paycheck="${schedule.id}"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  const occurrenceList =
    document.getElementById(
      "paycheckOccurrenceList"
    );

  if (!occurrences.length) {
    occurrenceList.innerHTML = `
      <div class="empty-state">
        No active paycheck dates in this month.
      </div>
    `;
  } else {
    occurrenceList.innerHTML = occurrences
      .map(
        (item) => `
          <div class="occurrence-item">
            <div>
              <strong>
                ${formatDate(
                  toDateInputValue(item.date)
                )}
              </strong>

              <small>
                ${escapeHtml(
                  item.schedule.name
                )} ·
                ${paycheckFrequencyLabel(
                  item.schedule.frequency
                )}
              </small>
            </div>

            <strong class="positive">
              ${currency(
                item.schedule.amount
              )}
            </strong>
          </div>
        `
      )
      .join("");
  }
}

function resetPaycheckForm() {
  const form = document.getElementById(
    "paycheckForm"
  );

  form.reset();

  document.getElementById(
    "paycheckEditId"
  ).value = "";

  document.getElementById(
    "paycheckStartDate"
  ).value = toDateInputValue(new Date());

  document.getElementById(
    "paycheckFrequency"
  ).value = "biweekly";

  document.getElementById(
    "paycheckStatus"
  ).value = "active";

  document.getElementById(
    "paycheckModalTitle"
  ).textContent = "Add paycheck";

  document.getElementById(
    "paycheckSubmitButton"
  ).textContent = "Save paycheck";
}

function editPaycheck(scheduleId) {
  const schedule = state.paychecks.find(
    (item) => item.id === scheduleId
  );

  if (!schedule) {
    return;
  }

  document.getElementById(
    "paycheckEditId"
  ).value = schedule.id;

  document.getElementById(
    "paycheckName"
  ).value = schedule.name;

  document.getElementById(
    "paycheckAmount"
  ).value = schedule.amount;

  document.getElementById(
    "paycheckFrequency"
  ).value = schedule.frequency;

  document.getElementById(
    "paycheckStartDate"
  ).value = schedule.startDate;

  document.getElementById(
    "paycheckEndDate"
  ).value = schedule.endDate || "";

  document.getElementById(
    "paycheckStatus"
  ).value = schedule.status;

  document.getElementById(
    "paycheckModalTitle"
  ).textContent = "Edit paycheck";

  document.getElementById(
    "paycheckSubmitButton"
  ).textContent = "Save changes";

  openModal("paycheckModal");
}
