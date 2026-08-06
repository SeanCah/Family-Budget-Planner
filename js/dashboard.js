function getMonthlyTotals() {
  const transactions = state.transactions.filter((item) =>
    isCurrentMonth(item.date)
  );

  const income = transactions
    .filter((item) => item.type === "income")
    .reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

  const unpaidBills = state.bills
    .filter((item) => !item.paid)
    .reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

  return {
    income,
    expenses,
    unpaidBills,
    available:
      income - expenses - unpaidBills
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
    totalLimit > 0
      ? (totalBalance / totalLimit) * 100
      : 0;

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

  document.getElementById(
    "greeting"
  ).textContent = greeting;

  document.getElementById(
    "todayText"
  ).textContent =
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(now);
}
