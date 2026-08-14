window.STORAGE_KEY = "ledger-family-budget-v1";

window.demoState = {
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
],

  savingsGoals: []
};

window.loadState = function loadState() {
  try {
    const saved = localStorage.getItem(
      window.STORAGE_KEY
    );

    const loaded = saved
      ? JSON.parse(saved)
      : structuredClone(window.demoState);

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
  : [],

savingsGoals: Array.isArray(loaded.savingsGoals)
  ? loaded.savingsGoals
  : []
    };
  } catch (error) {
    console.error(
      "Could not load saved data",
      error
    );

    return structuredClone(window.demoState);
  }
};

window.state = window.loadState();

window.saveState = function saveState() {
  localStorage.setItem(
    window.STORAGE_KEY,
    JSON.stringify(window.state)
  );

  if (
    typeof window
      .savePersonalFinancialData ===
      "function"
  ) {
    void window
      .savePersonalFinancialData();
  }
};
