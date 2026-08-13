async function loadCurrentHousehold() {
  const householdStatus =
    document.getElementById(
      "householdStatus"
    );

  const createHouseholdForm =
    document.getElementById(
      "createHouseholdForm"
    );

  const joinHouseholdForm =
    document.getElementById(
      "joinHouseholdForm"
    );

  if (!householdStatus) {
    return;
  }

  householdStatus.innerHTML = `
    <div class="empty-state">
      Loading family account...
    </div>
  `;

  const {
    data: { user },
    error: userError
  } =
    await supabaseClient.auth.getUser();

  if (userError || !user) {
    return;
  }

  const {
    data: membership,
    error: membershipError
  } =
    await supabaseClient
      .from("household_members")
      .select(
        "household_id, role"
      )
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

  if (membershipError) {
    householdStatus.innerHTML = `
      <div class="empty-state">
        Could not load family account.
      </div>
    `;

    console.error(
      membershipError
    );

    return;
  }

  if (!membership) {
    householdStatus.innerHTML = `
      <div class="empty-state">
        No family account connected yet.
      </div>
    `;

    return;
  }

  const {
    data: household,
    error: householdError
  } =
    await supabaseClient
      .from("households")
      .select("id, name")
      .eq(
        "id",
        membership.household_id
      )
      .single();

  if (householdError) {
    householdStatus.innerHTML = `
      <div class="empty-state">
        Could not load family account.
      </div>
    `;

    console.error(
      householdError
    );

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
              household.name
            )}
          </p>

          <p class="item-meta">
            ${
              membership.role ===
              "owner"
                ? "Family owner"
                : "Family member"
            }
          </p>
        </div>
      </div>
    </div>
  `;

  if (createHouseholdForm) {
    createHouseholdForm.hidden =
      true;
  }

  if (joinHouseholdForm) {
    joinHouseholdForm.hidden =
      true;
  }
}

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

  loadCurrentHousehold();

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

      const { error } =
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

      createHouseholdForm.reset();

      showToast(
        "Family account created."
      );

      await loadCurrentHousehold();
    }
  );
}
