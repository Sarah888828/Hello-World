const signupForm = document.querySelector("#signup-form");
const signupMessage = document.querySelector("#signup-message");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  signupMessage.textContent = "";
  signupMessage.classList.remove("error");
  if (!signupForm.reportValidity()) return;

  const formData = new FormData(signupForm);
  const submitButton = signupForm.querySelector("[type='submit']");
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: String(formData.get("nickname") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        password: String(formData.get("password") || ""),
        gender: String(formData.get("gender") || ""),
        terms: formData.has("terms")
      })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "회원가입에 실패했습니다.");

    signupForm.reset();
    signupMessage.textContent = `${result.user.nickname}님, 가입이 완료되었습니다. 로그인 페이지에서 로그인해 주세요.`;
    signupMessage.classList.add("success");
  } catch (error) {
    signupMessage.textContent = error.message || "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.";
    signupMessage.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});