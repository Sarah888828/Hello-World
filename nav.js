const navigationItems = [
  { label: "주차장 찾기", href: "#parking-list", match: ["/", "/parking/"] },
  { label: "전기차 충전", href: "charging/", match: ["/charging/"] },
  { label: "거리 측정", href: "distance/", match: ["/distance/"] },
  { label: "문의 게시판", href: "board/", match: ["/board/"] },
  { label: "로그인", href: "account/login/", match: ["/account/login/", "/account/signup/"] }
];

function getSiteBasePath(pathname) {
  const specialRoots = ["/parking/", "/charging/", "/account/", "/board/", "/distance/", "/guide/"];
  const root = specialRoots.find((prefix) => pathname.includes(prefix));
  if (root) return pathname.slice(0, pathname.indexOf(root) + 1);
  if (pathname.endsWith("/")) return pathname;
  return pathname.slice(0, pathname.lastIndexOf("/") + 1);
}

function mountSharedNavigation() {
  const header = document.querySelector(".topbar");
  const mount = document.querySelector("[data-site-navigation]");
  if (!header || !mount) return;

  const basePath = getSiteBasePath(window.location.pathname);
  const locationUrl = new URL("https://map.naver.com/p/search/천안%20불당동%20공영주차장");
  const menuItems = navigationItems.map((item) => {
    const href = item.href.startsWith("#") ? `${basePath}${item.href}` : `${basePath}${item.href}`;
    const currentRelativePath = window.location.pathname.slice(basePath.length);
    const active = item.match.some((prefix) => {
      if (prefix === "/") return currentRelativePath === "" || currentRelativePath === "index.html";
      return window.location.pathname.startsWith(`${basePath}${prefix.slice(1)}`);
    });
    return `<a class="nav-link${active ? " active" : ""}" href="${href}"${active ? ' aria-current="page"' : ""}>${item.label}</a>`;
  }).join("");

  mount.innerHTML = `
    <a class="brand" href="${basePath}" aria-label="천안 주차 메인">
      <span class="brand-mark" aria-hidden="true">P</span>
      <span>천안<span class="brand-light">주차</span></span>
    </a>
    <button class="mobile-menu-toggle" type="button" aria-expanded="false" aria-controls="main-navigation">메뉴 <span aria-hidden="true">☰</span></button>
    <nav id="main-navigation" class="topnav" aria-label="주 메뉴">${menuItems}</nav>
    <a class="location-pill" href="${locationUrl.href}" target="_blank" rel="noreferrer">
      <span class="location-dot" aria-hidden="true"></span> 천안시 불당동
    </a>
  `;

  const menuToggle = header.querySelector(".mobile-menu-toggle");
  const mainNavigation = header.querySelector("#main-navigation");
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNavigation.classList.toggle("is-open", !isOpen);
  });
}

mountSharedNavigation();