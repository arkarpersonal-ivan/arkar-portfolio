/* =========================================================
   ARKAR TUN — PORTFOLIO JAVASCRIPT
========================================================= */


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

// Header element (used by scroll calculations)
const header = document.getElementById('site-header') || document.querySelector('.navbar');

/* Smooth scroll polyfill for in-page links */
document.documentElement.style.scrollBehavior = 'smooth';

// Track recent clicks so IntersectionObserver doesn't immediately fight
// the user's explicit click (prevents flicker/delays).
let lastClick = { id: null, time: 0 };

// Mobile breakpoint (matches CSS at max-width: 900px)
const MOBILE_BREAKPOINT = 900;

// Desktop: vertical rail on the left, no top offset needed.
// Mobile: fixed top header needs a top offset.
const computeHeaderHeight = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) return 0;
    return header ? header.offsetHeight : 64;
};

// Make nav anchors scroll precisely to the top of each section,
// accounting for the fixed header height. Also set the clicked link
// active immediately so the UI responds without waiting for scroll.
navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;
    link.addEventListener('click', (e) => {
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        // Immediately update active state for responsive feedback
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // record the click so observer knows to defer overrides briefly
        lastClick.id = id;
        lastClick.time = Date.now();

        const headerHeight = computeHeaderHeight();
        // Prefer scrolling to the section's intro (or first child) so internal padding
        // does not create an excessive gap below the fixed header.
        const focusEl = target.querySelector('.section-intro') || target.firstElementChild || target;
        // Use native scrollIntoView which respects CSS `scroll-margin-top`
        focusEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update hash without adding a history entry
        history.replaceState(null, '', `#${id}`);
        // close mobile drawer properly if open so scroll lock is restored
        if (document.body.classList.contains('mobile-open')) closeMobileDrawerForNavigation();
    });
});

/* Header depth on scroll — toggles .scrolled class for refined shadow/blur */
window.addEventListener('scroll', () => {
    if (!header) return;
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
}, { passive: true });

// Active navigation using IntersectionObserver for robustness.
// This replaces the scroll-based hard-coded offset approach.
if ('IntersectionObserver' in window) {
    const observerOptions = () => {
        const topOffset = computeHeaderHeight() + 12;
        return {
            root: null,
            rootMargin: `-${topOffset}px 0px -40% 0px`,
            threshold: 0.15
        };
    };

    let io = null;

    const createObserver = () => {
        if (io) io.disconnect();
        io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // If a nav click happened very recently, prefer the click state
                    // to avoid flicker/delays while smooth scrolling completes.
                    const timeSinceClick = lastClick.time ? (Date.now() - lastClick.time) : Infinity;
                    if (timeSinceClick < 600) return;

                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => link.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                    // sync mobile overlay links if present
                    const mobLink = document.querySelector(`.mobile-overlay a[href="#${id}"]`);
                    if (mobLink) {
                        document.querySelectorAll('.mobile-overlay a').forEach(a => a.classList.remove('active'));
                        mobLink.classList.add('active');
                    }
                }
            });
        }, observerOptions());

        sections.forEach(s => io.observe(s));
    };

    // initialize
    createObserver();

    // Recreate observer on resize to account for header height changes
    window.addEventListener('resize', () => {
        createObserver();
        if (window.innerWidth > MOBILE_BREAKPOINT) document.body.classList.remove('mobile-open');
    });

} else {
    // Fallback to scroll-based detection if IntersectionObserver not available
    window.addEventListener("scroll", () => {
        // If a nav click occurred recently, do not override the immediate click active state
        if (lastClick.time && (Date.now() - lastClick.time) < 600) return;
        let currentSection = "";
        const computedHeaderHeight = (window.innerWidth > MOBILE_BREAKPOINT) ? 0 : (header ? header.offsetHeight : 64);
        const offset = computedHeaderHeight + 12;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
        // sync mobile overlay links
        if (document.querySelector('.mobile-overlay')) {
            document.querySelectorAll('.mobile-overlay a').forEach(a => a.classList.remove('active'));
            const mob = document.querySelector(`.mobile-overlay a[href="#${currentSection}"]`);
            if (mob) mob.classList.add('active');
        }
    });
}


/* =========================================================
   MOBILE MENU TOGGLE
   - Toggle `body.mobile-open` to display the mobile overlay nav
   - Close on link click, ESC, or resize to desktop width
========================================================= */

const mobileToggle = document.querySelector('.mobile-toggle');
if (mobileToggle) {
    // initial state
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('open');

    mobileToggle.addEventListener('click', () => {
        const isOpen = !document.body.classList.contains('mobile-open');
        if (isOpen) openMobileDrawer(); else closeMobileDrawer();
    });

    // close mobile drawer when a desktop nav link is clicked (safety)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (document.body.classList.contains('mobile-open')) closeMobileDrawerForNavigation();
        });
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileDrawer();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) closeMobileDrawer();
    });

}


/* =========================================================
   GITHUB PLACEHOLDER
========================================================= */

const githubLinks =
    document.querySelectorAll(".github-link");

githubLinks.forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        alert(
            "GitHub profile will be added soon."
        );

    });

});


/* =========================================================
   LINKEDIN PLACEHOLDER
========================================================= */

const linkedinLinks =
    document.querySelectorAll(".linkedin-link");

linkedinLinks.forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        alert(
            "LinkedIn profile will be added soon."
        );

    });

});


/* =========================================================
   PROJECT PLACEHOLDERS
========================================================= */

const projectLinks =
    document.querySelectorAll(".project-link");

projectLinks.forEach(link => {

    link.addEventListener("click", event => {

        const href =
            link.getAttribute("href");

        if (href === "#") {

            event.preventDefault();

            alert(
                "Project details and GitHub repository will be added soon."
            );

        }

    });

});

/* =========================================================
   MOBILE DRAWER — create a right-side drawer with backdrop
   and clone nav items into it so desktop layout is untouched.
========================================================= */
const createMobileOverlay = () => {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';

    // Drawer container
    const drawer = document.createElement('div');
    drawer.className = 'drawer';

    // Drawer header (logo + close)
    const headerRow = document.createElement('div');
    headerRow.className = 'drawer-header';
    const brand = document.createElement('div');
    brand.className = 'drawer-brand';
    brand.innerHTML = document.querySelector('.logo') ? document.querySelector('.logo').innerHTML : 'ARKAR.';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'drawer-close';
    closeBtn.setAttribute('aria-label', 'Close navigation menu');
    closeBtn.innerHTML = '&#10005;';
    closeBtn.addEventListener('click', () => {
        closeMobileDrawer();
    });
    headerRow.appendChild(brand);
    headerRow.appendChild(closeBtn);

    // Navigation container
    const nav = document.createElement('nav');
    nav.className = 'drawer-nav';

    // clone nav items into drawer nav
    navLinks.forEach((dl, idx) => {
        const a = document.createElement('a');
        a.href = dl.getAttribute('href');
        a.className = dl.className.replace('active', '');
        // Use the structured label content from desktop nav if available
        const labelEl = dl.querySelector('.nav-label');
        const indexEl = dl.querySelector('.nav-index');
        if (labelEl) {
            const idxSpan = document.createElement('span');
            idxSpan.className = 'drawer-nav-index';
            idxSpan.textContent = indexEl ? indexEl.textContent.trim() : '';
            const lblSpan = document.createElement('span');
            lblSpan.className = 'drawer-nav-label';
            lblSpan.textContent = labelEl.textContent.trim();
            a.appendChild(idxSpan);
            a.appendChild(lblSpan);
        } else {
            a.textContent = dl.textContent.trim();
        }
        // give index for stagger
        a.dataset.index = String(idx);
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href') || '';
            if (!href.startsWith('#')) return;
            const id = href.slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();

            // immediate active update
            navLinks.forEach(l => l.classList.remove('active'));
            const desktopLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (desktopLink) desktopLink.classList.add('active');
            // mobile drawer links
            nav.querySelectorAll('a').forEach(x => x.classList.remove('active'));
            a.classList.add('active');

            lastClick.id = id;
            lastClick.time = Date.now();

            // close drawer (restore immediately) so page can scroll
            closeMobileDrawerForNavigation();

            const headerHeight = computeHeaderHeight();
            const focusEl = target.querySelector('.section-intro') || target.firstElementChild || target;
            // small delay to allow drawer visuals to start closing, then scroll into view
            setTimeout(() => focusEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
            history.replaceState(null, '', `#${id}`);
        });
        nav.appendChild(a);
    });

    drawer.appendChild(headerRow);
    drawer.appendChild(nav);
    overlay.appendChild(drawer);
    document.body.appendChild(overlay);

    // close when clicking outside the drawer (click anywhere on overlay not inside drawer)
    overlay.addEventListener('click', (e) => {
        if (!drawer.contains(e.target)) closeMobileDrawer();
    });

    return overlay;
};

const mobileOverlay = createMobileOverlay();

// helper: open/close and scroll lock
let _savedBodyScroll = 0;
const openMobileDrawer = () => {
    document.body.classList.add('mobile-open');
    mobileOverlay.classList.add('open');
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    // scroll lock
    _savedBodyScroll = window.scrollY || document.documentElement.scrollTop;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_savedBodyScroll}px`;
    // stagger nav items
    mobileOverlay.querySelectorAll('.drawer-nav a').forEach(a => {
        const i = parseInt(a.dataset.index || '0', 10);
        a.style.transitionDelay = `${i * 40}ms`;
    });
};

const closeMobileDrawer = () => {
    document.body.classList.remove('mobile-open');
    mobileOverlay.classList.remove('open');
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    // release scroll lock after animation
    setTimeout(() => {
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, _savedBodyScroll);
    }, 360);
    // remove stagger delays
    mobileOverlay.querySelectorAll('.drawer-nav a').forEach(a => a.style.transitionDelay = '');
};

// Close drawer for navigation: close visuals, immediately restore page scroll
const closeMobileDrawerForNavigation = () => {
    document.body.classList.remove('mobile-open');
    mobileOverlay.classList.remove('open');
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    // immediately restore body positioning; do NOT restore scroll here —
    // the caller will perform the desired scroll (so we don't overwrite it).
    document.body.style.position = '';
    document.body.style.top = '';
    // remove stagger delays
    mobileOverlay.querySelectorAll('.drawer-nav a').forEach(a => a.style.transitionDelay = '');
};