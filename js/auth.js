function registerAuthHandlers() {
  const authForm =
    document.getElementById("authForm");

  const signUpButton =
    document.getElementById("signUpButton");

  const authMessage =
    document.getElementById("authMessage");
  
  const accountEmail =
  document.getElementById("accountEmail");

  const signOutButton =
  document.getElementById("signOutButton");
  const resetPasswordButton =
  document.getElementById(
    "resetPasswordButton"
  );

  if (
    !authForm ||
    !signUpButton ||
    !authMessage
  ) {
    return;
  }
  supabaseClient.auth.onAuthStateChange(
  (event, session) => {
    const authModal =
      document.getElementById("authModal");

    if (session) {
  if (accountEmail) {
    accountEmail.textContent =
      session.user.email;
  }

  if (signOutButton) {
    signOutButton.disabled = false;
  }

  if (resetPasswordButton) {
    resetPasswordButton.disabled = false;
  }

  closeModal(authModal);
  return;
}

if (accountEmail) {
  accountEmail.textContent =
    "Not signed in";
}

if (signOutButton) {
  signOutButton.disabled = true;
}

if (resetPasswordButton) {
  resetPasswordButton.disabled = true;
}

openModal("authModal");
  }
);

if (signOutButton) {
  signOutButton.addEventListener(
    "click",
    async () => {
      signOutButton.disabled = true;

      const { error } =
        await supabaseClient.auth.signOut({
          scope: "local"
        });

      if (error) {
        signOutButton.disabled = false;
        showToast(error.message);
        return;
      }

      showToast("Signed out");
    }
  );
}

if (resetPasswordButton) {
  resetPasswordButton.addEventListener(
    "click",
    async () => {
      resetPasswordButton.disabled = true;

      const {
        data: { user },
        error: userError
      } =
        await supabaseClient.auth.getUser();

      if (userError || !user?.email) {
        resetPasswordButton.disabled = false;

        showToast(
          "Could not find your account email."
        );

        return;
      }

      const { error } =
        await supabaseClient.auth
          .resetPasswordForEmail(
            user.email,
            {
              redirectTo:
                "https://seancah.github.io/Family-Budget-Planner/"
            }
          );

      resetPasswordButton.disabled = false;

      if (error) {
        showToast(error.message);
        return;
      }

      showToast(
        "Password reset email sent."
      );
    }
  );
}
      showToast("Signed out");
    }
  );
}
  function getCredentials() {
    return {
      email: document
        .getElementById("authEmail")
        .value
        .trim(),

      password: document
        .getElementById("authPassword")
        .value
    };
  }

  authForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const { email, password } =
        getCredentials();

      authMessage.textContent =
        "Signing in...";

      const { error } =
        await supabaseClient.auth
          .signInWithPassword({
            email,
            password
          });

      if (error) {
        authMessage.textContent =
          error.message;

        return;
      }

      authMessage.textContent =
        "Signed in successfully.";

      closeModal(
        document.getElementById(
          "authModal"
        )
      );
    }
  );

  signUpButton.addEventListener(
    "click",
    async () => {
      const { email, password } =
        getCredentials();

      authMessage.textContent =
        "Creating account...";

      const { data, error } =
        await supabaseClient.auth.signUp({
          email,
          password
        });

      if (error) {
        authMessage.textContent =
          error.message;

        return;
      }

      if (data.session) {
        authMessage.textContent =
          "Account created and signed in.";
      } else {
        authMessage.textContent =
          "Account created. Check your email to confirm your account.";
      }
    }
  );
}
