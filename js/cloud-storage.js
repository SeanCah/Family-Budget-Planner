function normalizePersonalFinancialData(
  data
) {
  return {
    transactions:
      Array.isArray(
        data?.transactions
      )
        ? data.transactions
        : [],

    paychecks:
      Array.isArray(
        data?.paychecks
      )
        ? data.paychecks
        : [],

    bills:
      Array.isArray(
        data?.bills
      )
        ? data.bills
        : [],

    cards:
      Array.isArray(
        data?.cards
      )
        ? data.cards
        : [],

    savingsGoals:
      Array.isArray(
        data?.savingsGoals
      )
        ? data.savingsGoals
        : []
  };
}

window.loadPersonalFinancialData =
  async function loadPersonalFinancialData(
    user
  ) {
    if (!user?.id) {
      return;
    }

    const {
      data: cloudRow,
      error: loadError
    } =
      await supabaseClient
        .from("user_financial_data")
        .select("data")
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (loadError) {
      console.error(
        "Could not load cloud data",
        loadError
      );

      showToast(
        "Could not load your saved Ledger data."
      );

      return;
    }

    if (cloudRow) {
      window.state =
        normalizePersonalFinancialData(
          cloudRow.data
        );

      localStorage.setItem(
        window.STORAGE_KEY,
        JSON.stringify(
          window.state
        )
      );

      renderAll();

      return;
    }

    const savedLocalData =
      localStorage.getItem(
        window.STORAGE_KEY
      );

    const initialState =
      savedLocalData
        ? normalizePersonalFinancialData(
            window.state
          )
        : normalizePersonalFinancialData(
            {}
          );

    const { error: createError } =
      await supabaseClient
        .from("user_financial_data")
        .insert({
          user_id: user.id,
          data: initialState
        });

    if (createError) {
      console.error(
        "Could not create cloud data",
        createError
      );

      showToast(
        "Could not connect your Ledger data to your account."
      );

      return;
    }

    window.state =
      initialState;

    localStorage.setItem(
      window.STORAGE_KEY,
      JSON.stringify(
        window.state
      )
    );

    renderAll();

    showToast(
      "Ledger data connected to your account."
    );
  };
