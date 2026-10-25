const navigationList = document.querySelector("nav ul");
const activeLink = navigationList?.querySelector("a.active");

if (navigationList && activeLink) {
    const listBounds = navigationList.getBoundingClientRect();
    const linkBounds = activeLink.getBoundingClientRect();

    navigationList.style.setProperty("--glow-left", `${linkBounds.left - listBounds.left + 12}px`);
    navigationList.style.setProperty("--glow-width", `${linkBounds.width - 24}px`);
    requestAnimationFrame(() => navigationList.classList.add("has-active"));
}
