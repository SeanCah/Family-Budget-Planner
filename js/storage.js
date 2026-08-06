var STORAGE_KEY = "ledger-family-budget-v1";

var demoState = {
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

var state = loadState();

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    const loaded = saved
      ? JSON.parse(saved)
      : structuredClone(demoState);

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
    console.error(
      "Could not load saved data",
      error
    );

    return structuredClone(demoState);
  }
}

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}
