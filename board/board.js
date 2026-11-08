const inquiryForm = document.querySelector("#inquiry-form");
const inquiryList = document.querySelector("#inquiry-list");
const inquiryCount = document.querySelector("#inquiry-count");
const emptyState = document.querySelector("#inquiry-empty");
const formMessage = document.querySelector("#form-message");
const categoryFilter = document.querySelector("#category-filter");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

async function loadInquiries() {
  inquiryList.setAttribute("aria-busy", "true");
  try {
    const response = await fetch("/api/inquiries");
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "문의 목록을 불러오지 못했습니다.");
    renderInquiries(result.inquiries || []);
  } catch (error) {
    inquiryCount.textContent = "!";
    inquiryList.hidden = true;
    emptyState.hidden = false;
    emptyState.querySelector("h3").textContent = "서버에 연결할 수 없어요";
    emptyState.querySelector("p").textContent = "페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.";
    formMessage.textContent = error.message;
    formMessage.classList.add("error");
  } finally {
    inquiryList.removeAttribute("aria-busy");
  }
}

function renderInquiries(inquiries) {
  const selectedCategory = categoryFilter.value;
  const filtered = inquiries.filter((item) => selectedCategory === "all" || item.category === selectedCategory);

  inquiryCount.textContent = String(filtered.length);
  emptyState.hidden = filtered.length > 0;
  inquiryList.hidden = filtered.length === 0;
  if (filtered.length === 0) {
    emptyState.querySelector("h3").textContent = "아직 등록된 문의가 없어요";
    emptyState.querySelector("p").textContent = "궁금한 점을 첫 문의로 남겨 주세요.";
  }

  inquiryList.innerHTML = filtered.map((item) => `
    <article class="inquiry-card">
      <div class="inquiry-card-top">
        <span class="inquiry-category">${escapeHtml(item.category)}</span>
        ${item.private ? '<span class="private-badge">비공개</span>' : '<span class="inquiry-status">접수</span>'}
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <div class="inquiry-card-meta"><span>${escapeHtml(item.name)}</span><time datetime="${escapeHtml(item.createdAt)}">${escapeHtml(formatDate(item.createdAt))}</time></div>
      ${item.private
        ? '<p class="inquiry-preview private-preview">비공개로 등록된 문의입니다.</p>'
        : `<p class="inquiry-preview">${escapeHtml(item.content)}</p>`}
    </article>
  `).join("");
}

categoryFilter.addEventListener("change", loadInquiries);

inquiryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.classList.remove("error");
  if (!inquiryForm.reportValidity()) return;

  const formData = new FormData(inquiryForm);
  const inquiry = {
    category: String(formData.get("category") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    private: formData.has("private")
  };
  const isCorrectionReport = inquiry.category === "정보 정정/제보";

  if (inquiry.name.length < 2 || inquiry.title.length < 2 || inquiry.content.length < 5) {
    formMessage.textContent = "작성자와 제목은 2자 이상, 문의 내용은 5자 이상 입력해 주세요.";
    formMessage.classList.add("error");
    return;
  }

  const submitButton = inquiryForm.querySelector("[type='submit']");
  submitButton.disabled = true;
  try {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "문의 저장에 실패했습니다.");

    inquiryForm.reset();
    formMessage.textContent = isCorrectionReport
      ? "제보가 접수되었습니다. 자동 반영되지는 않으며 공식 자료 확인 후 검토가 필요합니다."
      : "문의가 저장되었습니다.";
    await loadInquiries();
  } catch (error) {
    formMessage.textContent = error.message || "서버에 연결할 수 없습니다. 서버 상태를 확인해 주세요.";
    formMessage.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

loadInquiries();