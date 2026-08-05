function openModal(modalId) {
  const modal = document.getElementById(modalId);

  if (!modal) {
    return;
  }

  modal.classList.add("open");

  document.body.style.overflow = "hidden";

  const firstInput = modal.querySelector(
    "input, select"
  );

  if (firstInput) {
    setTimeout(() => firstInput.focus(), 0);
  }
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("open");

  document.body.style.overflow = "";
}

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  window.clearTimeout(showToast.timeout);

  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
