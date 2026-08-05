const STORAGE_KEY = "ledger-family-budget-v1";

const demoState = {
  transactions: [
    {
      id: "t1",
      type: "income",
      name: "Paycheck",
      category: "Income",
      amount: 2500.0,
      date: currentMonthDate(2)
    },
    {
      id: "t2",
      type: "expense",
      name: "Groceries",
      category: "Food",
      amount: 92.64,
      date: currentMonthDate(4)
    },
    {
      id: "t3",
      type: "expense",
      name: "Fuel",
      category: "Transportation",
      amount: 45.3,
      date: currentMonthDate(5)
    }
  ],

  paychecks: [
    {
      id: "p1",
      name: "Sample Employer",
      amount: 1425.0,
      frequency: "biweekly",
      startDate: currentMonthDate(2),
      endDate: "",
      status: "active"
    }
  ],

  bills: [
    {
      id: "b1",
      name: "Housing",
      amount: 900.0,
      dueDay: 1,
      paid: false
    },
    {
      id: "b2",
      name: "Electricity",
      amount: 145.0,
      dueDay: 8,
      paid: false
    },
    {
      id: "b3",
      name: "Internet",
      amount: 70.0,
      dueDay: 14,
      paid: true
    }
  ],

  cards: [
    {
      id: "c1",
      bank: "Sample Bank",
      name: "Everyday Card",
      limit: 5000,
      balance: 350,
      apr: 24.99,
      dueDay: 21,
      statementDay: 26
    }
  ]
};

let state = loadState();

function currentMonthDate(day) {
  const date = new Date();

  date.setDate(
    Math.min(day, daysInMonth(date.getFullYear(), date.getMonth()))
  );

  return toDateInputValue(date);
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const loaded = saved ? JSON.parse(saved) : structuredClone(demoState);

    return {
      transactions: Array.isArray(loaded.transactions)
        ? loaded.transactions
        : [],

      paychecks: Array.isArray(loaded.paychecks)
        ? loaded.paychecks
        : [],

      bills: Array.isArray(loaded.bills)
        ? loaded.bills
        : [],

      cards: Array.isArray(loaded.cards)
        ? loaded.cards
        : []
    };
  } catch (error) {
    console.error("Could not load saved data", error);

    return structuredClone(demoState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value) || 0);
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function ordinal(day) {
  const value = Number(day);
  const remainder100 = value % 100;

  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${value}th`;
  }

  switch (value % 10) {
    case 1:
      return `${value}st`;

    case 2:
      return `${value}nd`;

    case 3:
      return `${value}rd`;

    default:
      return `${value}th`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function isCurrentMonth(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const now = new Date();

  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function getMonthlyTotals() {
  const transactions = state.transactions.filter((item) =>
    isCurrentMonth(item.date)
  );

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const unpaidBills = state.bills
    .filter((item) => !item.paid)
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return {
    income,
    expenses,
    unpaidBills,
    available: income - expenses - unpaidBills
  };
}

function getCreditTotals() {
  const totalLimit = state.cards.reduce(
    (sum, card) => sum + Number(card.limit),
    0
  );

  const totalBalance = state.cards.reduce(
    (sum, card) => sum + Number(card.balance),
    0
  );

  const utilization =
    totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  return {
    totalLimit,
    totalBalance,
    utilization
  };
}

function setGreeting() {
  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening";

  document.getElementById("greeting").textContent = greeting;

  document.getElementById("todayText").textContent =
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(now);
}

function parseLocalDate(dateString) {
  if (!dateString) {
    return null;
  }

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function addDays(date, days) {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
}

function monthStart(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);

  return new Date(year, month - 1, 1, 12, 0, 0, 0);
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
    daysInMonth(first.getFullYear(), first.getMonth())
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

function getPaycheckOccurrences(schedule, rangeStart, rangeEnd) {
  if (!schedule || schedule.status !== "active") {
    return [];
  }

  const anchor = parseLocalDate(schedule.startDate);

  if (!anchor || anchor > rangeEnd) {
    return [];
  }

  const scheduleEnd = parseLocalDate(schedule.endDate);

  const effectiveEnd =
    scheduleEnd && scheduleEnd < rangeEnd
      ? scheduleEnd
      : rangeEnd;

  if (effectiveEnd < rangeStart || effectiveEnd < anchor) {
    return [];
  }

  const occurrences = [];

  if (schedule.frequency === "monthly") {
    let index = Math.max(
      0,
      (rangeStart.getFullYear() - anchor.getFullYear()) * 12 +
        (rangeStart.getMonth() - anchor.getMonth()) -
        1
    );

    let cursor = monthlyOccurrence(anchor, index);

    while (cursor < rangeStart) {
      index += 1;
      cursor = monthlyOccurrence(anchor, index);
    }

    while (
      cursor <= effectiveEnd &&
      occurrences.length < 500
    ) {
      if (cursor >= anchor) {
        occurrences.push(new Date(cursor));
      }

      index += 1;
      cursor = monthlyOccurrence(anchor, index);
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
    (rangeStart - anchor) / millisecondsPerDay
  );

  const jumps = Math.max(
    0,
    Math.floor(daysFromAnchor / intervalDays)
  );

  let cursor = addDays(anchor, jumps * intervalDays);

  while (cursor < rangeStart) {
    cursor = addDays(cursor, intervalDays);
  }

  while (
    cursor <= effectiveEnd &&
    occurrences.length < 500
  ) {
    occurrences.push(new Date(cursor));
    cursor = addDays(cursor, intervalDays);
  }

  return occurrences;
}

function selectedPaycheckMonth() {
  return (
    document.getElementById("paycheckMonthPicker").value ||
    toDateInputValue(new Date()).slice(0, 7)
  );
}

function paycheckOccurrencesForSelectedMonth() {
  const monthValue = selectedPaycheckMonth();
  const start = monthStart(monthValue);
  const end = monthEnd(monthValue);

  return state.paychecks
    .flatMap((schedule) =>
      getPaycheckOccurrences(schedule, start, end).map(
        (date) => ({
          schedule,
          date
        })
      )
    )
    .sort(
      (a, b) =>
        a.date - b.date ||
        a.schedule.name.localeCompare(b.schedule.name)
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
      .filter((schedule) => schedule.status === "active")
      .map((schedule) => {
        const occurrence = getPaycheckOccurrences(
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
      .sort((a, b) => a.date - b.date)[0] || null
  );
}

function renderPaychecks() {
  const monthValue = selectedPaycheckMonth();
  const selectedYear = Number(monthValue.slice(0, 4));
  const occurrences = paycheckOccurrencesForSelectedMonth();

  const expectedIncome = occurrences.reduce(
    (sum, item) => sum + Number(item.schedule.amount),
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
  ).textContent = `Projected for ${selectedYear}`;

  document.getElementById(
    "nextPaycheckDate"
  ).textContent = next
    ? formatDate(toDateInputValue(next.date))
    : "None";

  document.getElementById(
    "nextPaycheckDetail"
  ).textContent = next
    ? `${next.schedule.name} · ${currency(
        next.schedule.amount
      )}`
    : "Add an active schedule";

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(monthStart(monthValue));

  document.getElementById(
    "paycheckOccurrenceSubtitle"
  ).textContent = `Expected payments for ${monthLabel}.`;

  const tbody = document.getElementById("paychecksTable");

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
        const scheduleOccurrences = occurrences.filter(
          (item) => item.schedule.id === schedule.id
        );

        const scheduleTotal =
          scheduleOccurrences.length *
          Number(schedule.amount);

        return `
          <tr>
            <td>
              <strong>${escapeHtml(schedule.name)}</strong>
            </td>

            <td>
              <strong>${currency(schedule.amount)}</strong>
            </td>

            <td>
              ${paycheckFrequencyLabel(schedule.frequency)}
            </td>

            <td>
              ${formatDate(schedule.startDate)}
            </td>

            <td>
              ${scheduleOccurrences.length} deposits ·
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

  const occurrenceList = document.getElementById(
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
                ${formatDate(toDateInputValue(item.date))}
              </strong>

              <small>
                ${escapeHtml(item.schedule.name)} ·
                ${paycheckFrequencyLabel(
                  item.schedule.frequency
                )}
              </small>
            </div>

            <strong class="positive">
              ${currency(item.schedule.amount)}
            </strong>
          </div>
        `
      )
      .join("");
  }
}

function resetPaycheckForm() {
  const form = document.getElementById("paycheckForm");

  form.reset();

  document.getElementById("paycheckEditId").value = "";

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

function renderDashboard() {
  const totals = getMonthlyTotals();
  const credit = getCreditTotals();

  const availableElement =
    document.getElementById("availableValue");

  availableElement.textContent = currency(totals.available);

  availableElement.classList.toggle(
    "negative",
    totals.available < 0
  );

  availableElement.classList.toggle(
    "positive",
    totals.available >= 0
  );

  document.getElementById(
    "incomeValue"
  ).textContent = currency(totals.income);

  document.getElementById(
    "expenseValue"
  ).textContent = currency(totals.expenses);

  document.getElementById(
    "utilizationValue"
  ).textContent = `${credit.utilization.toFixed(1)}%`;

  const monthlyTransactions = state.transactions.filter(
    (item) => isCurrentMonth(item.date)
  );

  const incomeCount = monthlyTransactions.filter(
    (item) => item.type === "income"
  ).length;

  const expenseCount = monthlyTransactions.filter(
    (item) => item.type === "expense"
  ).length;

  document.getElementById(
    "incomeDetail"
  ).textContent = `${incomeCount} income ${
    incomeCount === 1 ? "entry" : "entries"
  }`;

  document.getElementById(
    "expenseDetail"
  ).textContent = `${expenseCount} expense ${
    expenseCount === 1 ? "entry" : "entries"
  }`;

  document.getElementById(
    "utilizationDetail"
  ).textContent = state.cards.length
    ? `${currency(credit.totalBalance)} across ${
        state.cards.length
      } ${state.cards.length === 1 ? "card" : "cards"}`
    : "No cards entered";

  document.getElementById(
    "flowIncomeValue"
  ).textContent = currency(totals.income);

  document.getElementById(
    "flowExpenseValue"
  ).textContent = currency(totals.expenses);

  const difference = totals.income - totals.expenses;

  const differenceElement = document.getElementById(
    "flowDifferenceValue"
  );

  differenceElement.textContent = currency(difference);

  differenceElement.classList.toggle(
    "negative",
    difference < 0
  );

  differenceElement.classList.toggle(
    "positive",
    difference >= 0
  );

  const combined = totals.income + totals.expenses;

  const incomeWidth =
    combined > 0
      ? (totals.income / combined) * 100
      : 50;

  const expenseWidth =
    combined > 0
      ? (totals.expenses / combined) * 100
      : 50;

  document.getElementById(
    "flowIncome"
  ).style.width = `${incomeWidth}%`;

  document.getElementById(
    "flowExpense"
  ).style.width = `${expenseWidth}%`;

  renderUpcomingBills();
  renderRecentTransactions();
}

function renderUpcomingBills() {
  const container = document.getElementById(
    "upcomingBillsList"
  );

  const bills = [...state.bills]
    .filter((bill) => !bill.paid)
    .sort(
      (a, b) => Number(a.dueDay) - Number(b.dueDay)
    )
    .slice(0, 4);

  if (!bills.length) {
    container.innerHTML = `
      <div class="empty-state">
        No unpaid bills.
      </div>
    `;

    return;
  }

  container.innerHTML = bills
    .map(
      (bill) => `
        <div class="list-item">
          <div class="item-main">
            <div class="item-icon">
              ${escapeHtml(
                bill.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(bill.name)}
              </p>

              <p class="item-meta">
                Due on the ${ordinal(bill.dueDay)}
              </p>
            </div>
          </div>

          <div class="item-value">
            ${currency(bill.amount)}
          </div>
        </div>
      `
    )
    .join("");
}

function renderRecentTransactions() {
  const container = document.getElementById(
    "recentTransactionsList"
  );

  const transactions = [...state.transactions]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5);

  if (!transactions.length) {
    container.innerHTML = `
      <div class="empty-state">
        No transactions yet.
      </div>
    `;

    return;
  }

  container.innerHTML = transactions
    .map(
      (item) => `
        <div class="list-item">
          <div class="item-main">
            <div class="item-icon">
              ${item.type === "income" ? "+" : "−"}
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(item.name)}
              </p>

              <p class="item-meta">
                ${escapeHtml(item.category)} ·
                ${formatDate(item.date)}
              </p>
            </div>
          </div>

          <div class="item-value ${
            item.type === "income" ? "positive" : ""
          }">
            ${
              item.type === "income" ? "+" : "−"
            }${currency(item.amount)}
          </div>
        </div>
      `
    )
    .join("");
}

function renderTransactionsTable() {
  const tbody = document.getElementById(
    "transactionsTable"
  );

  const transactions = [...state.transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  if (!transactions.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            No transactions yet.
          </div>
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = transactions
    .map(
      (item) => `
        <tr>
          <td>
            ${formatDate(item.date)}
          </td>

          <td>
            <strong>${escapeHtml(item.name)}</strong>
          </td>

          <td>
            ${escapeHtml(item.category)}
          </td>

          <td>
            <span class="pill ${
              item.type === "income"
                ? "pill-income"
                : "pill-expense"
            }">
              ${item.type}
            </span>
          </td>

          <td class="${
            item.type === "income" ? "positive" : ""
          }">
            <strong>
              ${
                item.type === "income" ? "+" : "−"
              }${currency(item.amount)}
            </strong>
          </td>

          <td>
            <button
              class="icon-button"
              type="button"
              data-delete-transaction="${item.id}"
              aria-label="Delete transaction"
            >
              Delete
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderBillsTable() {
  const tbody = document.getElementById("billsTable");

  const bills = [...state.bills].sort(
    (a, b) => Number(a.dueDay) - Number(b.dueDay)
  );

  if (!bills.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            No bills yet.
          </div>
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = bills
    .map(
      (bill) => `
        <tr>
          <td>
            <strong>${escapeHtml(bill.name)}</strong>
          </td>

          <td>
            ${ordinal(bill.dueDay)}
          </td>

          <td>
            <strong>${currency(bill.amount)}</strong>
          </td>

          <td>
            <span class="pill ${
              bill.paid ? "pill-paid" : "pill-due"
            }">
              ${bill.paid ? "Paid" : "Upcoming"}
            </span>
          </td>

          <td>
            <button
              class="button button-secondary button-small"
              type="button"
              data-toggle-bill="${bill.id}"
            >
              ${
                bill.paid
                  ? "Mark unpaid"
                  : "Mark paid"
              }
            </button>
          </td>

          <td>
            <button
              class="icon-button"
              type="button"
              data-delete-bill="${bill.id}"
              aria-label="Delete bill"
            >
              Delete
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderCards() {
  const grid = document.getElementById(
    "creditCardGrid"
  );

  if (!state.cards.length) {
    grid.innerHTML = `
      <article class="card empty-state">
        No credit cards yet.
      </article>
    `;

    return;
  }

  grid.innerHTML = state.cards
    .map((card) => {
      const utilization =
        Number(card.limit) > 0
          ? (Number(card.balance) /
              Number(card.limit)) *
            100
          : 0;

      const cappedWidth = Math.min(utilization, 100);

      return `
        <article class="card credit-card">
          <div class="credit-card-top">
            <div>
              <p class="credit-bank">
                ${escapeHtml(card.bank)}
              </p>

              <h3 class="credit-name">
                ${escapeHtml(card.name)}
              </h3>
            </div>

            <button
              class="icon-button"
              type="button"
              data-delete-card="${card.id}"
              aria-label="Delete card"
            >
              Delete
            </button>
          </div>

          <div class="utilization-row">
            <span>Utilization</span>
            <strong>
              ${utilization.toFixed(1)}%
            </strong>
          </div>

          <div
            class="progress"
            aria-label="Credit utilization"
          >
            <div
              class="progress-fill"
              style="width: ${cappedWidth}%"
            ></div>
          </div>

          <div class="credit-stats">
            <div class="credit-stat">
              <span>Balance</span>
              <strong>${currency(card.balance)}</strong>
            </div>

            <div class="credit-stat">
              <span>Limit</span>
              <strong>${currency(card.limit)}</strong>
            </div>

            <div class="credit-stat">
              <span>APR</span>
              <strong>
                ${Number(card.apr).toFixed(2)}%
              </strong>
            </div>

            <div class="credit-stat">
              <span>Due</span>
              <strong>${ordinal(card.dueDay)}</strong>
            </div>

            <div class="credit-stat">
              <span>Statement</span>
              <strong>
                ${ordinal(card.statementDay)}
              </strong>
            </div>

            <div class="credit-stat">
              <span>Available</span>
              <strong>
                ${currency(
                  Number(card.limit) -
                    Number(card.balance)
                )}
              </strong>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  setGreeting();
  renderDashboard();
  renderTransactionsTable();
  renderPaychecks();
  renderBillsTable();
  renderCards();
}

document.addEventListener("click", (event) => {
  const pageButton = event.target.closest(
    "[data-page]"
  );

  if (pageButton) {
    navigateTo(pageButton.dataset.page);
  }

  const pageLink = event.target.closest(
    "[data-page-link]"
  );

  if (pageLink) {
    navigateTo(pageLink.dataset.pageLink);
  }

  const modalButton = event.target.closest(
    "[data-open-modal]"
  );

  if (modalButton) {
    if (
      modalButton.dataset.openModal ===
      "paycheckModal"
    ) {
      resetPaycheckForm();
    }

    openModal(modalButton.dataset.openModal);
  }

  const closeButton = event.target.closest(
    "[data-close-modal]"
  );

  if (closeButton) {
    closeModal(
      closeButton.closest(".modal-backdrop")
    );
  }

  if (
    event.target.classList.contains(
      "modal-backdrop"
    )
  ) {
    closeModal(event.target);
  }

  const transactionDelete = event.target.closest(
    "[data-delete-transaction]"
  );

  if (transactionDelete) {
    state.transactions = state.transactions.filter(
      (item) =>
        item.id !==
        transactionDelete.dataset.deleteTransaction
    );

    saveState();
    renderAll();
    showToast("Transaction removed");
  }

  const paycheckEdit = event.target.closest(
    "[data-edit-paycheck]"
  );

  if (paycheckEdit) {
    editPaycheck(
      paycheckEdit.dataset.editPaycheck
    );
  }

  const paycheckToggle = event.target.closest(
    "[data-toggle-paycheck]"
  );

  if (paycheckToggle) {
    const schedule = state.paychecks.find(
      (item) =>
        item.id ===
        paycheckToggle.dataset.togglePaycheck
    );

    if (schedule) {
      schedule.status =
        schedule.status === "active"
          ? "paused"
          : "active";
    }

    saveState();
    renderAll();

    showToast(
      schedule?.status === "active"
        ? "Paycheck schedule activated"
        : "Paycheck schedule paused"
    );
  }

  const paycheckDelete = event.target.closest(
    "[data-delete-paycheck]"
  );

  if (paycheckDelete) {
    state.paychecks = state.paychecks.filter(
      (item) =>
        item.id !==
        paycheckDelete.dataset.deletePaycheck
    );

    saveState();
    renderAll();

    showToast("Paycheck schedule removed");
  }

  const billToggle = event.target.closest(
    "[data-toggle-bill]"
  );

  if (billToggle) {
    const bill = state.bills.find(
      (item) =>
        item.id === billToggle.dataset.toggleBill
    );

    if (bill) {
      bill.paid = !bill.paid;
    }

    saveState();
    renderAll();

    showToast(
      bill?.paid
        ? "Bill marked paid"
        : "Bill marked unpaid"
    );
  }

  const billDelete = event.target.closest(
    "[data-delete-bill]"
  );

  if (billDelete) {
    state.bills = state.bills.filter(
      (item) =>
        item.id !== billDelete.dataset.deleteBill
    );

    saveState();
    renderAll();

    showToast("Bill removed");
  }

  const cardDelete = event.target.closest(
    "[data-delete-card]"
  );

  if (cardDelete) {
    state.cards = state.cards.filter(
      (item) =>
        item.id !== cardDelete.dataset.deleteCard
    );

    saveState();
    renderAll();

    showToast("Credit card removed");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document
      .querySelectorAll(".modal-backdrop.open")
      .forEach(closeModal);
  }
});

document
  .getElementById("transactionForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    state.transactions.push({
      id: makeId("transaction"),

      type: document.getElementById(
        "transactionType"
      ).value,

      name: document
        .getElementById("transactionName")
        .value.trim(),

      category: document
        .getElementById("transactionCategory")
        .value.trim(),

      amount: Number(
        document.getElementById(
          "transactionAmount"
        ).value
      ),

      date: document.getElementById(
        "transactionDate"
      ).value
    });

    saveState();

    event.target.reset();

    document.getElementById(
      "transactionDate"
    ).value = toDateInputValue(new Date());

    closeModal(
      document.getElementById("transactionModal")
    );

    renderAll();

    showToast("Transaction saved");
  });

document
  .getElementById("paycheckForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const editId = document.getElementById(
      "paycheckEditId"
    ).value;

    const schedule = {
      id: editId || makeId("paycheck"),

      name: document
        .getElementById("paycheckName")
        .value.trim(),

      amount: Number(
        document.getElementById(
          "paycheckAmount"
        ).value
      ),

      frequency: document.getElementById(
        "paycheckFrequency"
      ).value,

      startDate: document.getElementById(
        "paycheckStartDate"
      ).value,

      endDate: document.getElementById(
        "paycheckEndDate"
      ).value,

      status: document.getElementById(
        "paycheckStatus"
      ).value
    };

    if (
      schedule.endDate &&
      schedule.endDate < schedule.startDate
    ) {
      showToast(
        "End date must be after the starting date"
      );

      return;
    }

    if (editId) {
      const index = state.paychecks.findIndex(
        (item) => item.id === editId
      );

      if (index >= 0) {
        state.paychecks[index] = schedule;
      }
    } else {
      state.paychecks.push(schedule);
    }

    saveState();

    closeModal(
      document.getElementById("paycheckModal")
    );

    resetPaycheckForm();
    renderAll();

    showToast(
      editId
        ? "Paycheck schedule updated"
        : "Paycheck schedule saved"
    );
  });

document
  .getElementById("paycheckMonthPicker")
  .addEventListener("change", renderPaychecks);

document
  .getElementById("generatePaychecksButton")
  .addEventListener("click", () => {
    const occurrences =
      paycheckOccurrencesForSelectedMonth();

    let added = 0;

    occurrences.forEach((item) => {
      const date = toDateInputValue(item.date);

      const exists = state.transactions.some(
        (transaction) =>
          transaction.paycheckScheduleId ===
            item.schedule.id &&
          transaction.date === date
      );

      if (exists) {
        return;
      }

      state.transactions.push({
        id: makeId("transaction"),
        type: "income",
        name: item.schedule.name,
        category: "Paycheck",
        amount: Number(item.schedule.amount),
        date,
        paycheckScheduleId: item.schedule.id
      });

      added += 1;
    });

    saveState();
    renderAll();

    showToast(
      added
        ? `${added} paycheck ${
            added === 1 ? "entry" : "entries"
          } added`
        : "No new paycheck entries to add"
    );
  });

document
  .getElementById("billForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    state.bills.push({
      id: makeId("bill"),

      name: document
        .getElementById("billName")
        .value.trim(),

      amount: Number(
        document.getElementById("billAmount").value
      ),

      dueDay: Number(
        document.getElementById("billDueDay").value
      ),

      paid: false
    });

    saveState();

    event.target.reset();

    closeModal(
      document.getElementById("billModal")
    );

    renderAll();

    showToast("Bill saved");
  });

document
  .getElementById("cardForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    state.cards.push({
      id: makeId("card"),

      bank: document
        .getElementById("cardBank")
        .value.trim(),

      name: document
        .getElementById("cardName")
        .value.trim(),

      limit: Number(
        document.getElementById("cardLimit").value
      ),

      balance: Number(
        document.getElementById("cardBalance").value
      ),

      apr: Number(
        document.getElementById("cardApr").value
      ),

      dueDay: Number(
        document.getElementById("cardDueDay").value
      ),

      statementDay: Number(
        document.getElementById(
          "cardStatementDay"
        ).value
      )
    });

    saveState();

    event.target.reset();

    closeModal(
      document.getElementById("cardModal")
    );

    renderAll();

    showToast("Credit card saved");
  });

document.getElementById(
  "transactionDate"
).value = toDateInputValue(new Date());

document.getElementById(
  "paycheckMonthPicker"
).value = toDateInputValue(new Date()).slice(
  0,
  7
);

resetPaycheckForm();
renderAll();
