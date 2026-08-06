function renderDashboard() {
  const totals = getMonthlyTotals();
  const credit = getCreditTotals();

  const availableElement =
    document.getElementById("availableValue");

  availableElement.textContent =
    currency(totals.available);

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
  ).textContent =
    `${credit.utilization.toFixed(1)}%`;

  const monthlyTransactions =
    state.transactions.filter(
      (item) => isCurrentMonth(item.date)
    );

  const incomeCount =
    monthlyTransactions.filter(
      (item) => item.type === "income"
    ).length;

  const expenseCount =
    monthlyTransactions.filter(
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
    ? `${currency(
        credit.totalBalance
      )} across ${state.cards.length} ${
        state.cards.length === 1
          ? "card"
          : "cards"
      }`
    : "No cards entered";

  document.getElementById(
    "flowIncomeValue"
  ).textContent = currency(totals.income);

  document.getElementById(
    "flowExpenseValue"
  ).textContent = currency(totals.expenses);

  const difference =
    totals.income - totals.expenses;

  const differenceElement =
    document.getElementById(
      "flowDifferenceValue"
    );

  differenceElement.textContent =
    currency(difference);

  differenceElement.classList.toggle(
    "negative",
    difference < 0
  );

  differenceElement.classList.toggle(
    "positive",
    difference >= 0
  );

  const combined =
    totals.income + totals.expenses;

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
      (a, b) =>
        Number(a.dueDay) -
        Number(b.dueDay)
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
                bill.name
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(bill.name)}
              </p>

              <p class="item-meta">
                Due on the
                ${ordinal(bill.dueDay)}
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

  const transactions =
    [...state.transactions]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
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
              ${
                item.type === "income"
                  ? "+"
                  : "−"
              }
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(item.name)}
              </p>

              <p class="item-meta">
                ${escapeHtml(
                  item.category
                )} ·
                ${formatDate(item.date)}
              </p>
            </div>
          </div>

          <div class="item-value ${
            item.type === "income"
              ? "positive"
              : ""
          }">
            ${
              item.type === "income"
                ? "+"
                : "−"
            }${currency(item.amount)}
          </div>
        </div>
      `
    )
    .join("");
}
