registerInteractions();
registerFormHandlers();

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
