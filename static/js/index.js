// import 'core-js/stable';
// import 'regenerator-runtime/runtime';


// UPDATE THE YEAR IN THE FOOTER
const yearEl = document.querySelector('.year');
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

// MOBILE NAV
const mobNav = document.querySelector('.nav__list--links');
const openBtn = document.querySelector('.nav__btn--mob');
const closeBtn = document.querySelector('.nav__btn--mob-close');

openBtn.addEventListener('click', function() {
    mobNav.classList.add('nav-open');
});

closeBtn.addEventListener('click', function() {
    mobNav.classList.remove('nav-open');
});

// SMOOTH SCROLLING ANIMATION
const allLinks = document.querySelectorAll('.scroll-to');

allLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        // Scroll back to top if clicked href='#'
        if (href === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }

        //  Scroll to other links
        if (href !== '#' && href.startsWith('#')) {
            const sectionEl = document.querySelector(href);
            sectionEl.scrollIntoView({ behavior: 'smooth' });
        }

        mobNav.classList.remove('nav-open');
    });
});

// CONTACT FORM SEND
const form = document.querySelector('.contact__form');
const nameEl = document.getElementById('full-name');
const emailEl = document.getElementById('email');
const phoneEl = document.getElementById('phone');
const messageEl = document.getElementById('msg');

const overlay = document.querySelector('.overlay');


function reqTimeout(seconds) {
    return new Promise(function(_, reject) {
        setTimeout(function() {
            reject('Request timeout!');
        }, seconds * 1000);
    });
}

function clearInputs() {
    nameEl.value = '';
    emailEl.value = '';
    phoneEl.value = '';
    messageEl.value = '';

    nameEl.blur();
    emailEl.blur();
    phoneEl.blur();
    messageEl.blur();
}

function showOverlay() {
    overlay.classList.remove('hidden');
}

function hideOverlay() {
    setTimeout(function() {
        overlay.classList.add('hidden');
        clearOverlay();
    }, 2400);
}

function clearOverlay() {
    overlay.innerHTML = '';
}

function renderSpinner() {
    clearOverlay();

    const markup = `
        <div class="spinner">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M11 2v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM11 18v4c0 0.552 0.448 1 1 1s1-0.448 1-1v-4c0-0.552-0.448-1-1-1s-1 0.448-1 1zM4.223 5.637l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM15.533 16.947l2.83 2.83c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-2.83-2.83c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414zM2 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM18 13h4c0.552 0 1-0.448 1-1s-0.448-1-1-1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1zM5.637 19.777l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0zM16.947 8.467l2.83-2.83c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-2.83 2.83c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0z"></path>
            </svg>
        </div>
    `;

    overlay.insertAdjacentHTML('afterbegin', markup);
}

function renderError() {
    clearOverlay();

    const markup = `
        <div class="message">
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Close Circle</title><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192M192 320l128-128"/></svg>
            <h2 class="heading-2 gold">Odesláni zprávy se nezdařilo</h2>
        </div>
    `;

    overlay.insertAdjacentHTML('afterbegin', markup);
}

function renderSuccess() {
    clearOverlay();

    const markup = `
        <div class="message">
            <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Mail Unread</title><path d="M320 96H88a40 40 0 00-40 40v240a40 40 0 0040 40h334.73a40 40 0 0040-40V239" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M112 160l144 112 87-65.67"/><circle cx="431.95" cy="128.05" r="47.95"/><path d="M432 192a63.95 63.95 0 1163.95-63.95A64 64 0 01432 192zm0-95.9a32 32 0 1031.95 32 32 32 0 00-31.95-32z"/></svg>
            <h2 class="heading-2 gold">Vaše zpráva se odeslala úspěšně</h2>
        </div>
    `;

    overlay.insertAdjacentHTML('afterbegin', markup);
}

async function sendData(name, email, phone, message) {
    try {
        showOverlay();
        renderSpinner();

        const reqPromise = fetch('https://www.retailnova.cz/api/v1/email/75909844-a941-4023-837c-fd143daa1fd0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_key: 'c4b9f7e8-ae7a-4494-97ad-c2f7dc362982',
                name: name,
                email: email,
                phone: phone,
                message: message
            })
        });

        const res = await Promise.race([reqPromise, reqTimeout(10)]);
        
        if (res.ok) {
            // console.log('Success');
            renderSuccess();
            hideOverlay();
            clearInputs();
        } else {
            throw new Error('Failed');
        }
    } catch (error) {
        // console.log('Failed:', error);
        renderError();
        hideOverlay();
    }
}

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullName = nameEl.value;
    const email = emailEl.value;
    const phone = phoneEl.value;
    const message = messageEl.value;    

    sendData(fullName, email, phone, message);
    // console.log(fullName, email, phone, message);
});

// FADE IN ANIMATIONS
const allSections = document.querySelectorAll('section');

function revealSection(entries, observer) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            
            entry.target.classList.remove('section--hidden');

            observer.unobserve(entry.target);
        }        
    });
}

const optiSec = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px 0px 0px'
};

const sectionObserver = new IntersectionObserver(revealSection, optiSec);

allSections.forEach(function(section) {
    // Attach an observer to each section
    sectionObserver.observe(section);
    
    // Hide all sections
    section.classList.add('section--hidden');
});
