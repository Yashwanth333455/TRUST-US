const servicesData = [{
        name: "Electronics",
        /* Name shown on the card */
        icon: "💻",
        /* Emoji icon */
        desc: "Discover top-rated gadgets, smartphones, laptops & accessories from trusted sellers.",
        url: "https://www.amazon.com/b?node=172282",
        /* Redirect URL */
        tag: "Amazon Electronics" /* Label shown in the Visit link */
    },
    {
        name: "Medicines",
        icon: "💊",
        desc: "Order genuine medicines, vitamins & health products from certified pharmacies online.",
        url: "https://www.1mg.com",
        tag: "1mg Pharmacy"
    },
    {
        name: "Food",
        icon: "🍔",
        desc: "Get fresh, delicious meals delivered fast from restaurants you love, right to your door.",
        url: "https://www.swiggy.com",
        tag: "Swiggy Delivery"
    },
    {
        name: "Fashion",
        icon: "👗",
        desc: "Explore the latest trends in clothing, footwear & accessories for every style.",
        url: "https://www.myntra.com",
        tag: "Myntra Fashion"
    },
    {
        name: "Fertilizers",
        icon: "🌱",
        desc: "Source quality fertilizers, seeds & farming supplies for healthier crops and bigger yields.",
        url: "https://www.bigbasket.com",
        tag: "BigBasket Agri"
    },
    {
        name: "About Us",
        icon: "🤝",
        desc: "Learn more about the Trust Us mission, our values, and why customers choose us.",
        url: "#info",
        /* Internal link — scrolls to the #info section */
        tag: "Our Story"
    }
];


/* ================================================================
   2. NAVBAR — Scroll Effect + Hamburger Toggle

   When user scrolls down, we add a "scrolled" CSS class to the
   navbar which triggers a darker background (see style.css).
   
   The hamburger button opens/closes the mobile nav menu.
================================================================ */

/* --- Select elements from the DOM (Document Object Model) ---
   getElementById('id') returns the HTML element with that id. */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

/* ---- Scroll Effect on Navbar ---- */
/* 
   window.addEventListener('event', callback):
   - 'scroll' fires every time the user scrolls.
   - The callback function runs when the event fires.
*/
window.addEventListener('scroll', function() {
    /* window.scrollY = how many pixels the user has scrolled down */
    if (window.scrollY > 50) {
        /* classList.add() adds a CSS class to the element */
        navbar.classList.add('scrolled');
    } else {
        /* classList.remove() removes a CSS class */
        navbar.classList.remove('scrolled');
    }
});

/* ---- Hamburger Button Toggle ---- */
/*
   When the hamburger button is clicked:
   - Toggle the "open" class on the button (animates bars to X)
   - Toggle the "open" class on the nav-links (shows/hides the menu)
   - Toggle aria-expanded for accessibility
*/
hamburger.addEventListener('click', function() {
    /* classList.toggle() adds the class if absent, removes if present */
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');

    /* Update aria-expanded: tells screen readers if menu is open */
    const isOpen = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
});

/* Close mobile menu when any nav link is clicked */
/*
   querySelectorAll('.nav-link') returns ALL elements with class "nav-link"
   as a NodeList (similar to an array).
   We use forEach to loop through and attach a click listener to each.
*/
document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function() {
        /* Close the menu by removing the "open" class */
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    });
});

/* Close mobile menu when clicking outside of it */
document.addEventListener('click', function(event) {
    /* event.target = the element that was actually clicked */
    /* .contains() checks if the element is INSIDE another element */
    const clickedInsideNav = navLinks.contains(event.target);
    const clickedOnHamburger = hamburger.contains(event.target);

    /* If clicked outside both the nav and hamburger: close the menu */
    if (!clickedInsideNav && !clickedOnHamburger) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
    }
});


/* ================================================================
   3. SMOOTH SCROLL
   
   This function handles smooth scrolling for internal anchor links.
   Example: clicking <a href="#services"> scrolls to id="services".
   
   Note: CSS `scroll-behavior: smooth` handles most of this already,
   but JavaScript gives us extra control (like accounting for the
   navbar height offset).
================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    /* 'a[href^="#"]' selects all <a> tags whose href STARTS WITH '#' */

    anchor.addEventListener('click', function(event) {
        /* Get the href value, e.g. "#services" */
        const href = this.getAttribute('href');

        /* If it's just "#" (empty anchor), do nothing special */
        if (href === '#') return;

        /* Try to find the target element on the page */
        const targetElement = document.querySelector(href);

        /* Only proceed if the target actually exists */
        if (targetElement) {
            /* Prevent the browser's default jump-to-anchor behavior */
            event.preventDefault();

            /* Get the navbar height to offset the scroll position */
            const navHeight = navbar.offsetHeight; /* offsetHeight = rendered height in pixels */

            /* Calculate the element's position from the top of the page */
            /* getBoundingClientRect() returns position relative to the viewport */
            const elementTop = targetElement.getBoundingClientRect().top;

            /* window.pageYOffset = current scroll position from top */
            const offsetPosition = elementTop + window.pageYOffset - navHeight;

            /* Smoothly scroll to the target position */
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' /* The smooth scrolling magic */
            });
        }
    });
});


/* ================================================================
   4. AUTO-PLAYING SLIDER
   
   How it works:
   - All slides sit side-by-side on a "track" div.
   - We move the track left using CSS transform: translateX(-N%).
   - -100% moves to slide 2, -200% to slide 3, etc.
   - We use setInterval to auto-advance every 4 seconds.
   - Dot indicators are generated and updated dynamically.
================================================================ */

/* Select slider elements */
const sliderTrack = document.getElementById('sliderTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const dotsContainer = document.getElementById('sliderDots');

let currentSlide = 0; /* Index of the currently visible slide (starts at 0) */
let autoPlayTimer; /* Will store the interval timer so we can reset it */

/* Count how many slides there are */
/* children = direct child elements of sliderTrack */
const totalSlides = sliderTrack.children.length;

/* --- Create Dot Indicators ---
   We generate one dot per slide and append them to the dots container. */
function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        /* Create a new <span> element */
        const dot = document.createElement('span');
        dot.classList.add('dot'); /* Add CSS class */

        /* Make the first dot active by default */
        if (i === 0) dot.classList.add('active');

        /* Clicking a dot jumps to that slide */
        dot.addEventListener('click', function() {
            goToSlide(i); /* i = the index of this dot (matches slide index) */
            resetAutoPlay();
        });

        /* appendChild adds the dot to the DOM inside dotsContainer */
        dotsContainer.appendChild(dot);
    }
}

/* --- Go To a Specific Slide ---
   index = the slide number we want to show (0, 1, 2, 3...) */
function goToSlide(index) {
    /* Clamp index: if it goes below 0, wrap to the last slide.
       If it goes above the last, wrap back to the first. */
    if (index < 0) index = totalSlides - 1; /* Wrap to end */
    if (index >= totalSlides) index = 0; /* Wrap to start */

    currentSlide = index;

    /* Move the slider track: 
       translateX(-100%) moves 1 slide width to the left.
       translateX(-200%) moves 2 slide widths, etc. */
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    /* Template literal: backticks `` allow embedding variables with ${} */

    /* Update dot indicators */
    updateDots();
}

/* --- Update Which Dot is Active ---
   Remove "active" from all dots, then add it to the current one. */
function updateDots() {
    /* Get all dot elements */
    const dots = dotsContainer.querySelectorAll('.dot');

    /* Loop through each dot */
    dots.forEach(function(dot, i) {
        /* classList.toggle(class, condition):
           If condition is true → add class. If false → remove class. */
        dot.classList.toggle('active', i === currentSlide);
    });
}

/* --- Previous Slide Button --- */
sliderPrev.addEventListener('click', function() {
    goToSlide(currentSlide - 1);
    resetAutoPlay(); /* Reset the timer so it doesn't jump unexpectedly */
});

/* --- Next Slide Button --- */
sliderNext.addEventListener('click', function() {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
});

/* --- Auto-Play ---
   setInterval(callback, milliseconds) runs the callback repeatedly.
   We advance to the next slide every 4000ms (4 seconds). */
function startAutoPlay() {
    autoPlayTimer = setInterval(function() {
        goToSlide(currentSlide + 1);
    }, 4000);
}

/* --- Reset Auto-Play ---
   When user interacts, we clear the existing timer and start fresh.
   This prevents the slide from changing 0.1s after a manual click. */
function resetAutoPlay() {
    clearInterval(autoPlayTimer); /* Stop the current timer */
    startAutoPlay(); /* Start a new 4-second countdown */
}

/* --- Pause on Hover ---
   When user hovers over the slider, pause auto-play.
   Resume when they move the mouse away. */
const sliderContainer = document.getElementById('sliderContainer');

sliderContainer.addEventListener('mouseenter', function() {
    clearInterval(autoPlayTimer); /* Pause */
});

sliderContainer.addEventListener('mouseleave', function() {
    startAutoPlay(); /* Resume */
});

/* --- Keyboard Navigation ---
   Let users navigate the slider with arrow keys (accessibility). */
document.addEventListener('keydown', function(event) {
    /* event.key tells us which key was pressed */
    if (event.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
        resetAutoPlay();
    } else if (event.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
        resetAutoPlay();
    }
});

/* --- Touch/Swipe Support for Mobile ---
   Track where the user's finger starts (touchstart) and where it ends
   (touchend). If they swiped left or right, change the slide. */
let touchStartX = 0;

sliderContainer.addEventListener('touchstart', function(event) {
    /* touches[0] = first finger position */
    touchStartX = event.touches[0].clientX;
}, {
    passive: true
});
/* passive: true improves scroll performance on mobile */

sliderContainer.addEventListener('touchend', function(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;

    /* If swipe was more than 50px, treat it as intentional */
    if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
            goToSlide(currentSlide + 1); /* Swiped left → next slide */
        } else {
            goToSlide(currentSlide - 1); /* Swiped right → prev slide */
        }
        resetAutoPlay();
    }
}, {
    passive: true
});


/* ================================================================
   5. DYNAMIC SERVICE CARDS
   
   This function loops through the servicesData array, creates
   an HTML card element for each item, and injects them into
   the #servicesGrid container.
   
   This is what "dynamic content loading" means: data → HTML.
================================================================ */

/* Select the grid container where cards will be injected */
const servicesGrid = document.getElementById('servicesGrid');

function renderServices() {
    /* servicesData.forEach(callback):
       Loops through each item in the array.
       'service' = the current item. 'index' = its position (0, 1, 2...) */
    servicesData.forEach(function(service, index) {

        /* Create a new <a> tag for the card (makes whole card clickable) */
        const card = document.createElement('a');

        /* Set the href: if it starts with "#", it's an internal link.
           Otherwise, open in a new tab. */
        card.href = service.url;
        if (!service.url.startsWith('#')) {
            card.target = '_blank'; /* Open external links in new tab */
            card.rel = 'noopener noreferrer'; /* Security best practice */
        }

        /* Add CSS classes to the card */
        card.classList.add('service-card', 'card-animate');

        /* animation-delay: stagger each card's entrance by 100ms
           so they appear one after another rather than all at once */
        card.style.animationDelay = `${index * 100}ms`;

        /* innerHTML sets the HTML CONTENT INSIDE the element.
           Template literals (backticks ``) let us write multi-line HTML
           and embed JavaScript variables using ${variable}. */
        card.innerHTML = `
      <div class="card-icon">${service.icon}</div>
      <h3 class="card-title">${service.name}</h3>
      <p class="card-desc">${service.desc}</p>
      <span class="card-link">
        Visit ${service.tag} 
        <span aria-hidden="true">→</span>
      </span>
    `;

        /* Append the card to the grid container in the DOM */
        servicesGrid.appendChild(card);
    });
}


/* ================================================================
   6. FOOTER — AUTO-UPDATE COPYRIGHT YEAR
   
   Instead of hardcoding "2025", we get the current year from
   JavaScript so it always shows the correct year automatically.
================================================================ */

const yearSpan = document.getElementById('year');
if (yearSpan) {
    /* new Date() creates a date object with the current date/time */
    /* .getFullYear() extracts the 4-digit year, e.g. 2025 */
    yearSpan.textContent = new Date().getFullYear();
}


/* ================================================================
   7. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
   
   IntersectionObserver watches elements and fires a callback
   when they enter or leave the visible viewport.
   
   We use it to add a fade-in animation class when cards and
   sections become visible as the user scrolls down.
   
   This is more performant than listening to the 'scroll' event!
================================================================ */

/* Configuration for the observer */
const observerOptions = {
    root: null,
    /* null = use the viewport as root */
    rootMargin: '0px',
    /* No extra margin */
    threshold: 0.1 /* Trigger when 10% of the element is visible */
};

/* Create the observer */
const scrollObserver = new IntersectionObserver(function(entries, observer) {
    /* entries = array of observed elements currently being checked */
    entries.forEach(function(entry) {
        /* entry.isIntersecting = true if the element is visible */
        if (entry.isIntersecting) {
            /* Add the 'card-animate' class to trigger the CSS animation */
            entry.target.classList.add('card-animate');

            /* Stop watching this element — it's already animated */
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

/* Watch these specific section elements */
function initScrollObserver() {
    /* Observe section headers and the info section */
    document.querySelectorAll('.section-header, .info-inner, .stat').forEach(function(el) {
        /* Remove initial animation class so it can be re-triggered */
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transform = 'translateY(20px)';

        /* Custom observer for these elements */
        const simpleObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    /* Fade in and slide up */
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    simpleObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15
        });

        simpleObserver.observe(el);
    });
}


/* ================================================================
   8. INIT — INITIALIZE EVERYTHING ON PAGE LOAD
   
   document.addEventListener('DOMContentLoaded', callback):
   - 'DOMContentLoaded' fires when the browser has fully parsed
     the HTML and built the DOM (Document Object Model).
   - This ensures our code runs AFTER all HTML elements exist,
     so getElementById() etc. can find them.
   
   Think of it as: "When the page is ready, do all this setup."
================================================================ */
document.addEventListener('DOMContentLoaded', function() {

    /* 1. Build the dot indicators for the slider */
    createDots();

    /* 2. Start the auto-playing slider */
    startAutoPlay();

    /* 3. Render service cards from the data array into the DOM */
    renderServices();

    /* 4. Initialize scroll animations */
    initScrollObserver();

    /* 5. Log a friendly message for developers inspecting the console */
    console.log('%cTrust Us — Website Loaded Successfully! 🤝',
        'color: #2563c4; font-size: 14px; font-weight: bold;');
    /* %c lets you apply CSS styles to console.log output */
    console.log('Services loaded:', servicesData.length, 'categories.');
});


/* ================================================================
   BONUS: A helpful note for students

   DevTools (F12) is your best friend!
   - Console tab: see console.log() output & JavaScript errors
   - Elements tab: inspect and live-edit HTML & CSS
   - Network tab: see what files are loading
   - Sources tab: set breakpoints and step through JS code

   Happy coding! 🚀
================================================================ */