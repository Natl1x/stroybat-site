const navigationList = document.querySelector("nav ul");
const activeLink = navigationList?.querySelector("a.active");
const menuButton = document.querySelector(".menu-toggle");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const navigation = document.querySelector("#site-navigation");

const closeMenu = () => {
    navigation?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
    if (!navigation) return;
    navigation.classList.remove("is-open");
    void navigation.offsetWidth;
    requestAnimationFrame(() => navigation.classList.add("is-open"));
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
});

menuCloseButtons.forEach((button) => button.addEventListener("click", closeMenu));
navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
});

if (navigationList && activeLink) {
    const listBounds = navigationList.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();

    navigationList.style.setProperty("--glow-left", `${linkBounds.left - listBounds.left + 12}px`);
    navigationList.style.setProperty("--glow-width", `${linkBounds.width - 24}px`);
    requestAnimationFrame(() => navigationList.classList.add("has-active"));
}
