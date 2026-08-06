registerInteractions();

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
