import './style.css';
import { isOpen, whatsappUrl, mapsUrl } from './business.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll('[data-whatsapp]').forEach(link => { link.href = whatsappUrl(link.dataset.message); });
document.querySelectorAll('[data-maps]').forEach(link => { link.href = mapsUrl; });
const status = document.querySelector('#open-status');
function updateHours() {
    const open = isOpen();
    status.textContent = open ? 'Aberto neste horário' : 'Fechado neste horário';
    status.classList.toggle('is-open', open);
}
updateHours();
const hoursTimer = setInterval(updateHours, 60000);

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const header = document.querySelector('.header');
const pageEvents = new AbortController();
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); if (navigation.contains(document.activeElement)) menu.focus(); } }, { signal: pageEvents.signal });

const revealItems = [...document.querySelectorAll('[data-reveal]')];
let revealObserver;
function showAllMotionContent() { revealItems.forEach(item => item.classList.add('is-visible')); }
if (reducedMotion.matches) {
    showAllMotionContent();
} else {
    revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: .18, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
    document.documentElement.classList.add('motion-ready');
}
reducedMotion.addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.remove('motion-ready');
        showAllMotionContent();
        revealObserver?.disconnect();
    }
}, { signal: pageEvents.signal });

const navSections = [...document.querySelectorAll('[data-nav-section]')];
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];
let scrollFrame = 0;
function updateScrollState() {
    scrollFrame = 0;
    header.classList.toggle('is-scrolled', scrollY > 18);
    const marker = innerHeight * .38;
    let activeSection = navSections[0];
    navSections.forEach(section => { if (section.getBoundingClientRect().top <= marker) activeSection = section; });
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${activeSection.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}
function scheduleScrollState() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
}
window.addEventListener('scroll', scheduleScrollState, { passive: true, signal: pageEvents.signal });
window.addEventListener('resize', scheduleScrollState, { passive: true, signal: pageEvents.signal });
updateScrollState();

const stage = document.querySelector('#product-stage');
let disposeScene;
function fallback() {
    stage.classList.add('fallback');
    stage.setAttribute('aria-busy', 'false');
    document.querySelector('.model-loading').textContent = '';
    document.querySelector('#model-help').textContent = 'Uma nova perspectiva para você.';
}
import('./glasses.js').then(({ initGlasses }) => {
    disposeScene = initGlasses(stage, fallback);
}).catch(fallback);

window.addEventListener('pagehide', event => {
    if (!event.persisted) {
        clearInterval(hoursTimer); cancelAnimationFrame(scrollFrame); revealObserver?.disconnect(); pageEvents.abort(); disposeScene?.();
    }
});
