const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginMessage.textContent = "";
  loginMessage.classList.remove("error", "success");
  if (!loginForm.reportValidity()) return;

  const formData = new FormData(loginForm);
  const submitButton = loginForm.querySelector("[type='submit']");
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || "")
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "로그인에 실패했습니다.");

    loginForm.reset();
    loginMessage.textContent = `${result.user.nickname}님, 로그인 정보를 확인했습니다. 세션 기능은 아직 연결되지 않았습니다.`;
    loginMessage.classList.add("success");
  } catch (error) {
    loginMessage.textContent = error.message || "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.";
    loginMessage.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});