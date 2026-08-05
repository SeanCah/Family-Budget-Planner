function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle(
      "active",
      page.id === pageId
    );
  });

  document
    .querySelectorAll("[data-page]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );
    });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
