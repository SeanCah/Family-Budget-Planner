function registerAuthHandlers() {
  const authForm =
    document.getElementById("authForm");

  const signUpButton =
    document.getElementById("signUpButton");

  const authMessage =
    document.getElementById("authMessage");

  if (
    !authForm ||
    !signUpButton ||
    !authMessage
  ) {
    return;
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
