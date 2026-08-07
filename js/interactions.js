function registerInteractions() {
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

    openModal(
      modalButton.dataset.openModal
    );
  }

  const closeButton = event.target.closest(
    "[data-close-modal]"
  );

  if (closeButton) {
    closeModal(
      closeButton.closest(
        ".modal-backdrop"
      )
    );
  }

  if (
    event.target.classList.contains(
      "modal-backdrop"
    )
  ) {
    closeModal(event.target);
  }

  const transactionDelete =
    event.target.closest(
      "[data-delete-transaction]"
    );

  if (transactionDelete) {
    state.transactions =
      state.transactions.filter(
        (item) =>
          item.id !==
          transactionDelete.dataset
            .deleteTransaction
      );

    saveState();
    renderAll();
    showToast("Transaction removed");
  }

  const paycheckEdit =
    event.target.closest(
      "[data-edit-paycheck]"
    );

  if (paycheckEdit) {
    editPaycheck(
      paycheckEdit.dataset.editPaycheck
    );
  }

  const paycheckToggle =
    event.target.closest(
      "[data-toggle-paycheck]"
    );

  if (paycheckToggle) {
    const schedule = state.paychecks.find(
      (item) =>
        item.id ===
        paycheckToggle.dataset
          .togglePaycheck
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

  const paycheckDelete =
    event.target.closest(
      "[data-delete-paycheck]"
    );

  if (paycheckDelete) {
    state.paychecks =
      state.paychecks.filter(
        (item) =>
          item.id !==
          paycheckDelete.dataset
            .deletePaycheck
      );

    saveState();
    renderAll();

    showToast(
      "Paycheck schedule removed"
    );
  }

  const billToggle = event.target.closest(
    "[data-toggle-bill]"
  );

  if (billToggle) {
    const bill = state.bills.find(
      (item) =>
        item.id ===
        billToggle.dataset.toggleBill
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
        item.id !==
        billDelete.dataset.deleteBill
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
        item.id !==
        cardDelete.dataset.deleteCard
    );

    saveState();
    renderAll();

    showToast("Credit card removed");
  }
  const savingsFundsButton =
  event.target.closest(
    "[data-add-savings-funds]"
  );

if (savingsFundsButton) {
  document.getElementById(
    "savingsContributionGoalId"
  ).value =
    savingsFundsButton.dataset
      .addSavingsFunds;

  document.getElementById(
    "savingsContributionAmount"
  ).value = "";

  openModal(
    "savingsContributionModal"
  );
}
  const savingsGoalDelete =
  event.target.closest(
    "[data-delete-savings-goal]"
  );

if (savingsGoalDelete) {
  state.savingsGoals =
    state.savingsGoals.filter(
      (goal) =>
        goal.id !==
        savingsGoalDelete.dataset
          .deleteSavingsGoal
    );

  saveState();
  renderAll();

  showToast("Savings goal removed");
}
});

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      document
        .querySelectorAll(
          ".modal-backdrop.open"
        )
        .forEach(closeModal);
    }
  }
);
}
