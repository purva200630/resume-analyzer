document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------
    const GOOGLE_FORM_URL = "PASTE_GOOGLE_FORM_LINK_HERE";

    // ---------------------------------------------------------
    // DOM Elements
    // ---------------------------------------------------------
    const elems = {
        navName: document.getElementById('nav-name'),
        heroName: document.getElementById('hero-name'),
        heroHeadline: document.getElementById('hero-headline'),
        heroLocation: document.querySelector('#hero-location span'),
        socialLinks: document.getElementById('social-links'),
        aboutText: document.getElementById('about-text'),
        skillsContainer: document.getElementById('skills-container'),
        expContainer: document.getElementById('experience-container'),
        projectsContainer: document.getElementById('projects-container'),
        contactBtn: document.getElementById('contact-btn'),
        contactEmail: document.getElementById('contact-email'),
        formContainer: document.getElementById('form-container'),
        iframeWrapper: document.getElementById('iframe-wrapper'),
        closeFormBtn: document.getElementById('close-form'),
        themeToggle: document.getElementById('theme-toggle'),
        footerName: document.getElementById('footer-name'),
        year: document.getElementById('year')
    };

    // ---------------------------------------------------------
    // Theme Management
    // ---------------------------------------------------------
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    elems.themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = elems.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // ---------------------------------------------------------
    // Data Loading
    // ---------------------------------------------------------

    // DIRECTLY EMBEDDED DATA to avoid CORS/Loading errors
    const PROFILE_DATA = {
        "name": "Purva Popli",
        "headline": "Vellore Institute of Technology | Intern at FOSSE-IIT BOMBAY | E-Cell VIT.",
        "location": "Amravati, Maharashtra, India",
        "email": "purvapopli1@gmail.com",
        "links": {
            "linkedin": "www.linkedin.com/in/purva-popli-444b3533b",
            "instagram": "",
            "topmate": "",
            "github": ""
        },
        "about": "",
        "skills": [
            "Microsoft Excel",
            "Python (Programming Language)",
            "Inkscape"
        ],
        "experience": [
            {
                "company": "E-Cell, VIT Bhopal",
                "title": "Corporate and Outreach Member",
                "dates": "December 2025\u00a0-\u00a0Present\u00a0(2 months)",
                "bullets": []
            },
            {
                "company": "FOSSEE",
                "title": "Intern",
                "dates": "October 2025\u00a0-\u00a0Present\u00a0(4 months)",
                "bullets": []
            }
        ],
        "projects": [],
        "education": [
            "Vellore Institute of Technology \u00b7\u00a0(2024\u00a0-\u00a02028)"
        ],
        "certifications": []
    };

    // Render immediately
    try {
        renderProfile(PROFILE_DATA);
    } catch (err) {
        console.error("Error rendering profile:", err);
        elems.heroHeadline.textContent = "Error rendering data.";
    }

    function renderProfile(data) {
        // Hero
        elems.navName.textContent = data.name;
        elems.heroName.textContent = `Hi, I'm ${data.name}`;
        elems.heroHeadline.textContent = data.headline;
        elems.heroLocation.textContent = data.location;
        elems.footerName.textContent = data.name;
        elems.year.textContent = new Date().getFullYear();

        // Social Links
        const socialMap = {
            linkedin: 'fa-linkedin-in',
            github: 'fa-github',
            instagram: 'fa-instagram',
            topmate: 'fa-user-astronaut' // approximation
        };

        if (data.links) {
            for (const [key, url] of Object.entries(data.links)) {
                if (url && url.trim() !== "") {
                    const a = document.createElement('a');
                    // Add http if missing
                    let href = url;
                    if (!href.startsWith('http')) {
                        href = 'https://' + href;
                    }
                    a.href = href;
                    a.target = "_blank";
                    a.innerHTML = `<i class="fab ${socialMap[key] || 'fa-link'}"></i>`;
                    elems.socialLinks.appendChild(a);
                }
            }
        }

        // About - If empty in JSON, generate a generic one or hide
        if (data.about) {
            elems.aboutText.textContent = data.about;
        } else {
            // Generate from headline/skills
            elems.aboutText.textContent = `I am a ${data.headline} based in ${data.location}. I have experience working with technologies like ${data.skills.slice(0, 3).join(', ')}.`;
        }

        // Skills
        if (data.skills && data.skills.length > 0) {
            data.skills.forEach(skill => {
                const pill = document.createElement('div');
                pill.className = 'skill-pill scroll-reveal';
                pill.textContent = skill;
                elems.skillsContainer.appendChild(pill);
            });
        }

        // Experience
        if (data.experience && data.experience.length > 0) {
            data.experience.forEach(exp => {
                const card = document.createElement('div');
                card.className = 'experience-card scroll-reveal';

                const bulletsHtml = exp.bullets && exp.bullets.length > 0
                    ? `<ul class="exp-bullets">${exp.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`
                    : '';

                card.innerHTML = `
                    <div class="exp-header">
                        <h3>${exp.title}</h3>
                        <div class="exp-company">${exp.company}</div>
                        <div class="exp-date">${exp.dates}</div>
                    </div>
                    ${bulletsHtml}
                `;
                elems.expContainer.appendChild(card);
            });
        } else {
            elems.expContainer.innerHTML = '<p class="text-center text-muted">No experience listed yet.</p>';
        }

        // Projects
        if (data.projects && data.projects.length > 0) {
            data.projects.forEach(proj => {
                const card = document.createElement('div');
                card.className = 'project-card scroll-reveal';

                const techHtml = proj.tech
                    ? `<div class="project-tech">${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>`
                    : '';

                card.innerHTML = `
                    <div>
                        <h3 class="project-title">${proj.name}</h3>
                        <p class="project-desc">${proj.description}</p>
                    </div>
                    ${techHtml}
                    ${proj.link ? `<a href="${proj.link}" target="_blank" class="btn btn-sm" style="margin-top:15px; display:inline-block; font-size:0.85rem; border:1px solid var(--border-color); padding:5px 15px; border-radius:20px;">View Project</a>` : ''}
                `;
                elems.projectsContainer.appendChild(card);
            });
        } else {
            // TODO Card
            const card = document.createElement('div');
            card.className = 'project-card scroll-reveal';
            card.style.borderStyle = 'dashed';
            card.innerHTML = `
                <div>
                    <h3 class="project-title">Project Placeholder</h3>
                    <p class="project-desc">Amazing projects coming soon!</p>
                </div>
                <div class="project-tech">
                    <span class="tech-tag">TODO</span>
                </div>
            `;
            elems.projectsContainer.appendChild(card);
        }

        // Contact Email
        if (data.email) {
            elems.contactEmail.textContent = data.email;
        }

        // Re-trigger scroll reveal observer for new elements
        initScrollReveal();
    }

    // ---------------------------------------------------------
    // Contact Form Logic
    // ---------------------------------------------------------
    elems.contactBtn.addEventListener('click', () => {
        if (GOOGLE_FORM_URL.includes("docs.google.com/forms")) {
            // Embed Logic
            elems.formContainer.classList.remove('hidden');
            if (!elems.iframeWrapper.innerHTML) {
                elems.iframeWrapper.innerHTML = `<iframe src="${GOOGLE_FORM_URL}?embedded=true" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>`;
            }
            elems.contactBtn.style.display = 'none'; // Hide button while form is open
        } else {
            // Open in new tab
            if (GOOGLE_FORM_URL !== "PASTE_GOOGLE_FORM_LINK_HERE") {
                window.open(GOOGLE_FORM_URL, '_blank');
            } else {
                alert("Please update GOOGLE_FORM_URL in script.js");
            }
        }
    });

    elems.closeFormBtn.addEventListener('click', () => {
        elems.formContainer.classList.add('hidden');
        elems.contactBtn.style.display = 'inline-block';
    });

    // ---------------------------------------------------------
    // Scroll Reveal Animation
    // ---------------------------------------------------------
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Initial call
    initScrollReveal();

    // ---------------------------------------------------------
    // Custom Cursor (Optional premium feel)
    // ---------------------------------------------------------
    const cursor = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
});
