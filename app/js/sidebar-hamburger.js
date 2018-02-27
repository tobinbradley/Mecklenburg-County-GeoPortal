
export default function toggleSidebar(el = document.querySelector('.mdl-layout__drawer-button')) {
    el.addEventListener("click", doToggle);
    document.querySelector('.mdl-layout__obfuscator').addEventListener("click", doToggle);
}

function doToggle() {
    document.querySelector('.mdl-layout__drawer').classList.toggle('is-visible');
    document.querySelector('.mdl-layout__obfuscator').classList.toggle('is-visible');
}