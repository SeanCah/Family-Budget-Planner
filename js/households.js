function registerHouseholdHandlers() {
  const createHouseholdForm =
    document.getElementById(
      "createHouseholdForm"
    );

  const householdStatus =
    document.getElementById(
      "householdStatus"
    );

  if (
    !createHouseholdForm ||
    !householdStatus
  ) {
    return;
  }

  createHouseholdForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const householdName =
        document
          .getElementById(
            "householdName"
          )
          .value
          .trim();

      if (!householdName) {
        showToast(
          "Enter a family name."
        );

        return;
      }

      const submitButton =
        createHouseholdForm
          .querySelector(
            'button[type="submit"]'
          );

      submitButton.disabled = true;
      submitButton.textContent =
        "Creating...";

      const { data, error } =
        await supabaseClient.rpc(
          "create_household",
          {
            household_name:
              householdName
          }
        );

      submitButton.disabled = false;
      submitButton.textContent =
        "Create family account";

      if (error) {
        showToast(error.message);
        return;
      }

      householdStatus.innerHTML = `
        <div class="list-item">
          <div class="item-main">
            <div class="item-icon">
              ◇
            </div>

            <div>
              <p class="item-title">
                ${escapeHtml(
                  householdName
                )}
              </p>

              <p class="item-meta">
                Family owner
              </p>
            </div>
          </div>
        </div>
      `;

      createHouseholdForm.reset();

      showToast(
        "Family account created."
      );

      console.log(
        "Created household:",
        data
      );
    }
  );
}
