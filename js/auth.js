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
