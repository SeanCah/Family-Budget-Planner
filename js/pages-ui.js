function renderTransactionsTable() {
  const tbody = document.getElementById(
    "transactionsTable"
  );

  const transactions = [
    ...state.transactions
  ].sort(
    (a, b) =>
      new Date(b.date) - new Date(a.date)
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
            <strong>
              ${escapeHtml(item.name)}
            </strong>
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
            item.type === "income"
              ? "positive"
              : ""
          }">
            <strong>
              ${
                item.type === "income"
                  ? "+"
                  : "−"
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
  const tbody = document.getElementById(
    "billsTable"
  );

  const bills = [...state.bills].sort(
    (a, b) =>
      Number(a.dueDay) -
      Number(b.dueDay)
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
            <strong>
              ${escapeHtml(bill.name)}
            </strong>
          </td>

          <td>
            ${ordinal(bill.dueDay)}
          </td>

          <td>
            <strong>
              ${currency(bill.amount)}
            </strong>
          </td>

          <td>
            <span class="pill ${
              bill.paid
                ? "pill-paid"
                : "pill-due"
            }">
              ${
                bill.paid
                  ? "Paid"
                  : "Upcoming"
              }
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
          ? (
              Number(card.balance) /
              Number(card.limit)
            ) * 100
          : 0;

      const cappedWidth = Math.min(
        utilization,
        100
      );

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

              <strong>
                ${currency(card.balance)}
              </strong>
            </div>

            <div class="credit-stat">
              <span>Limit</span>

              <strong>
                ${currency(card.limit)}
              </strong>
            </div>

            <div class="credit-stat">
              <span>APR</span>

              <strong>
                ${Number(card.apr).toFixed(2)}%
              </strong>
            </div>

            <div class="credit-stat">
              <span>Due</span>

              <strong>
                ${ordinal(card.dueDay)}
              </strong>
            </div>

            <div class="credit-stat">
              <span>Statement</span>

              <strong>
                ${ordinal(
                  card.statementDay
                )}
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
function renderSavingsSummary() {
  const totalSaved = state.savingsGoals.reduce(
    (sum, goal) =>
      sum + Number(goal.savedAmount),
    0
  );

  const totalTarget = state.savingsGoals.reduce(
    (sum, goal) =>
      sum + Number(goal.targetAmount),
    0
  );

  const remaining = Math.max(
    totalTarget - totalSaved,
    0
  );

  const progress =
    totalTarget > 0
      ? Math.min(
          (totalSaved / totalTarget) * 100,
          100
        )
      : 0;

  document.getElementById(
    "savingsTotalSaved"
  ).textContent = currency(totalSaved);

  document.getElementById(
    "savingsTotalTarget"
  ).textContent = currency(totalTarget);

  document.getElementById(
    "savingsRemaining"
  ).textContent = currency(remaining);

  document.getElementById(
    "savingsOverallProgress"
  ).textContent = `${progress.toFixed(0)}%`;
}
function renderSavingsGoals() {
  const list = document.getElementById(
    "savingsGoalsList"
  );

  if (!state.savingsGoals.length) {
    list.innerHTML = `
      <div class="empty-state">
        No savings goals yet.
      </div>
    `;

    return;
  }

  list.className = "list";

  list.innerHTML = state.savingsGoals
    .map((goal) => {
      const target = Number(
        goal.targetAmount
      );

      const saved = Number(
        goal.savedAmount
      );

      const progress =
        target > 0
          ? Math.min(
              (saved / target) * 100,
              100
            )
          : 0;
      
      const complete =
        target > 0 && saved >= target;

      const dateText = goal.targetDate
        ? `Target ${formatDate(goal.targetDate)}`
        : "No target date";

      return `
        <div class="list-item">
          <div class="item-main">
            <div class="item-icon">
              ◇
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(goal.name)}
              </p>

              <p class="item-meta">
                ${currency(saved)} saved of
                ${currency(target)}
                · ${dateText}
              </p>
              <div
  class="progress"
  aria-label="Savings goal progress"
  style="margin-top: 8px;"
>
  <div
    class="progress-fill"
    style="width: ${progress}%"
  ></div>
</div>
            </div>
          </div>

          <div class="item-value">
  <div>
    ${progress.toFixed(0)}%
  </div>

  ${complete
  ? `
    <span class="pill pill-paid">
      Goal reached
    </span>
  `
  : `
    <button
      class="button button-secondary button-small"
      type="button"
      data-add-savings-funds="${goal.id}"
    >
      Add funds
    </button>
  `
}

  <button
  class="button button-secondary button-small"
  type="button"
  data-edit-savings-goal="${goal.id}"
>
  Edit
</button>
<button
  class="icon-button"
  type="button"
  data-delete-savings-goal="${goal.id}"
  aria-label="Delete savings goal"
>
  Delete
</button>
</div>
        </div>
      `;
    })
    .join("");
}
function renderReportsSummary() {
  const picker = document.getElementById(
    "reportMonthPicker"
  );

  if (!picker) {
    return;
  }

  const selectedMonth = picker.value;

  const transactions =
    state.transactions.filter(
      (item) =>
        String(item.date).slice(0, 7) ===
        selectedMonth
    );

  const income = transactions
    .filter(
      (item) => item.type === "income"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const expenses = transactions
    .filter(
      (item) => item.type === "expense"
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  const netCashFlow =
    income - expenses;
  const categoryTotals = {};

transactions
  .filter(
    (item) => item.type === "expense"
  )
  .forEach((item) => {
    const category =
      item.category || "Uncategorized";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(item.amount);
  });

const categories = Object.entries(
  categoryTotals
).sort(
  (a, b) => b[1] - a[1]
);

const categoryList =
  document.getElementById(
    "reportCategoryList"
  );

if (!categories.length) {
  categoryList.className = "";

  categoryList.innerHTML = `
    <div class="empty-state">
      No expenses for this month.
    </div>
  `;
} else {
  categoryList.className = "list";

  categoryList.innerHTML = categories
    .map(([category, amount]) => {
      const percentage =
        expenses > 0
          ? (amount / expenses) * 100
          : 0;

      return `
        <div class="list-item">
          <div class="item-main">
            <div class="item-icon">
              $
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(category)}
              </p>

              <p class="item-meta">
                ${percentage.toFixed(0)}%
                of monthly spending
              </p>
            </div>
          </div>

          <div class="item-value">
            ${currency(amount)}
          </div>
        </div>
      `;
    })
    .join("");
}

  document.getElementById(
    "reportIncomeTotal"
  ).textContent = currency(income);

  document.getElementById(
    "reportExpenseTotal"
  ).textContent = currency(expenses);

  document.getElementById(
    "reportNetCashFlow"
  ).textContent = currency(netCashFlow);

  document.getElementById(
    "reportTransactionCount"
  ).textContent = transactions.length;
}
function renderAll() {
  setGreeting();
  renderDashboard();
  renderTransactionsTable();
  renderPaychecks();
  renderBillsTable();
  renderCards();
  renderSavingsSummary();
  renderSavingsGoals();
  renderReportsSummary();
}
