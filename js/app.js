registerInteractions();
registerFormHandlers();
registerAuthHandlers();
registerHouseholdHandlers();

document.getElementById(
  "transactionDate"
).value = toDateInputValue(new Date());

document.getElementById(
  "paycheckMonthPicker"
).value = toDateInputValue(new Date()).slice(
  0,
  7
);

document.getElementById(
  "reportMonthPicker"
).value = toDateInputValue(new Date()).slice(
  0,
  7
);

resetPaycheckForm();
renderAll();
