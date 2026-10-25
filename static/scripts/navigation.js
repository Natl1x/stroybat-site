const navigationList = document.querySelector("nav ul");
const activeLink = navigationList?.querySelector("a.active");
const menuButton = document.querySelector(".menu-toggle");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const navigation = document.querySelector("#site-navigation");

const closeMenu = () => {
    if (!navigation || !navigation.classList.contains("is-open")) return;

    navigation.classList.add("is-closing");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open", "menu-restored");
    sessionStorage.removeItem("stroybat-menu-open");

    window.setTimeout(() => {
        navigation.classList.remove("is-open", "is-closing");
    }, 460);
};

menuButton?.addEventListener("click", () => {
    if (!navigation) return;
    if (navigation.classList.contains("is-open")) {
        closeMenu();
        return;
    }

    navigation.classList.remove("is-closing");
    navigation.classList.remove("is-open");
    void navigation.offsetWidth;
    requestAnimationFrame(() => navigation.classList.add("is-open"));
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
});

menuCloseButtons.forEach((button) => button.addEventListener("click", closeMenu));
navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", async (event) => {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

        event.preventDefault();
        await loadPage(url, true);
    });
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

async function loadPage(url, addHistory) {
    try {
        const response = await fetch(url.href, { headers: { "X-Requested-With": "fetch" } });
        if (!response.ok) throw new Error("Page request failed");

        const html = await response.text();
        const documentView = new DOMParser().parseFromString(html, "text/html");
        const nextMain = documentView.querySelector("main");
        const currentMain = document.querySelector("main");
        if (!nextMain || !currentMain) throw new Error("Main content not found");

        currentMain.innerHTML = nextMain.innerHTML;
        document.title = documentView.title;
        navigation?.querySelectorAll("a").forEach((item) => {
            const itemUrl = new URL(item.href, window.location.href);
            const isActive = itemUrl.pathname === url.pathname;
            item.classList.toggle("active", isActive);
            item.toggleAttribute("aria-current", isActive);
        });

        if (addHistory) window.history.pushState({}, "", url.href);
        sessionStorage.setItem("stroybat-menu-open", "true");
        document.body.classList.add("menu-restored", "menu-open");
        navigation?.classList.add("is-open");
        menuButton?.setAttribute("aria-expanded", "true");
    } catch {
        window.location.href = url.href;
    }
}

window.addEventListener("popstate", () => loadPage(new URL(window.location.href), false));

if (sessionStorage.getItem("stroybat-menu-open") === "true") {
    navigation?.classList.add("is-open");
    menuButton?.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    document.body.classList.add("menu-restored");
}

if (navigationList && activeLink) {
    const listBounds = navigationList.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();

    navigationList.style.setProperty("--glow-left", `${linkBounds.left - listBounds.left + 12}px`);
    navigationList.style.setProperty("--glow-width", `${linkBounds.width - 24}px`);
    requestAnimationFrame(() => navigationList.classList.add("has-active"));
}
