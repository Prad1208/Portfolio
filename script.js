
//   1. PARTICLE BACKGROUND ENGINE


document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("bgCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");

        let W, H;
        let particles = [];
        const mouse = { x: -9999, y: -9999 };

        const COUNT = 80;
        const MAX_DIST = 130;
        const MOUSE_RADIUS = 120;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }

        function Particle() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.r = Math.random() * 1.5 + 0.5;
        }

        Particle.prototype.update = function () {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS && dist > 0) {
                const force =
                    ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.8;

                this.vx += (dx / dist) * force;
                this.vy += (dy / dist) * force;
            }

            this.vx *= 0.97;
            this.vy *= 0.97;

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = W;
            if (this.x > W) this.x = 0;
            if (this.y < 0) this.y = H;
            if (this.y > H) this.y = 0;
        };

        function init() {
            resize();
            particles = Array.from(
                { length: COUNT },
                () => new Particle()
            );
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < MAX_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        ctx.strokeStyle =
                            `rgba(255,255,255,${(1 - distance / MAX_DIST) * 0.08})`;

                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(particle => {
                particle.update();

                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    particle.y,
                    particle.r,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "rgba(255,255,255,0.25)";
                ctx.fill();
            });

            requestAnimationFrame(draw);
        }

        window.addEventListener("resize", resize);

        window.addEventListener("mousemove", event => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        window.addEventListener("mouseleave", () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        init();
        draw();
    }
});


/* ======================================================
   2. RULE-BASED CHAT ASSISTANT
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const KB = [
        {
            keys: ["hi", "hello", "hey", "hlo", "hii", "sup", "yo"],
            reply:
                "Hey there! 👋 I'm Praduman's assistant. Ask me about his projects, skills, education, or how to get in touch!"
        },
        {
            keys: ["who are you", "who is praduman", "introduce", "about praduman"],
            reply:
                "I'm Praduman Dwivedi's portfolio assistant! 🚀 Praduman is a B.Tech Computer Science (AI/ML) student graduating in 2028. He's learning Java, DSA, full-stack development, and AI/ML."
        },
        {
            keys: ["project", "projects", "work", "built", "portfolio"],
            reply:
                "Here are Praduman's projects:\n\n" +
                "💼 JOBS 24 — A job-tracking application built with React, Spring Boot, MySQL, and Docker.\n\n" +
                "🚇 AI Metro — A planned AI/ML project exploring intelligent metro-related solutions.\n\n" +
                "Explore the Projects section for more details!"
        },
        {
            keys: ["jobs 24", "job tracker", "job tracking"],
            reply:
                "💼 JOBS 24 is a full-stack job-tracking application built using React, Spring Boot, MySQL, and Docker. It supports job management, CRUD operations, search, status filtering, and dark mode."
        },
        {
            keys: ["ai metro", "metro project"],
            reply:
                "🚇 AI Metro is Praduman's planned AI/ML project. The goal is to explore how intelligent systems and machine learning can help solve real-world metro-related problems. The project is still planned, not completed."
        },
        {
            keys: ["skill", "skills", "tech stack", "technology", "technologies"],
            reply:
                "Praduman's learning and development stack includes:\n\n" +
                "☕ Programming: Java, Python\n" +
                "🧠 CS: Data Structures and Algorithms\n" +
                "⚡ Backend: Spring Boot, JDBC, JPA\n" +
                "🎨 Frontend: HTML, CSS, JavaScript, React\n" +
                "🗄️ Database: MySQL\n" +
                "🐳 Tools: Git, GitHub, Docker\n" +
                "🤖 Interests: AI/ML"
        },
        {
            keys: ["java", "dsa", "leetcode", "data structures", "algorithms"],
            reply:
                "☕ Praduman is working on Java and Data Structures & Algorithms. His practice includes arrays, strings, recursion, backtracking, hashing, and dynamic programming."
        },
        {
            keys: ["ai", "machine learning", "ml", "artificial intelligence"],
            reply:
                "🤖 Praduman is a Computer Science (AI/ML) student interested in machine learning and intelligent applications. AI Metro is one of his planned project ideas."
        },
        {
            keys: ["backend", "spring", "spring boot", "mysql", "docker"],
            reply:
                "⚡ Praduman is learning backend development with Java and Spring Boot. JOBS 24 combines Spring Boot, MySQL, React, and Docker to demonstrate full-stack development."
        },
        {
            keys: ["frontend", "react", "javascript", "html", "css"],
            reply:
                "🎨 Praduman works with frontend technologies including HTML, CSS, and JavaScript, and is building full-stack skills with React."
        },
        {
            keys: ["education", "college", "university", "study", "degree"],
            reply:
                "🎓 Praduman is pursuing a B.Tech in Computer Science with an AI/ML focus. His expected graduation year is 2028."
        },
        {
            keys: ["contact", "reach", "email", "hire", "connect", "message"],
            reply:
                "📬 You can contact Praduman through the Contact section of this portfolio. Fill out the form to send a message."
        },
        {
            keys: ["internship", "opportunity", "job", "career"],
            reply:
                "🚀 Praduman is developing his skills in Java, DSA, full-stack development, and AI/ML. Use the Contact section to discuss potential opportunities."
        },
        {
            keys: ["github", "code", "repo", "repository", "source"],
            reply:
                "🐙 You can explore Praduman's code on GitHub:\nhttps://github.com/Prad1208"
        },
        {
            keys: ["resume", "résumé", "cv", "download"],
            reply:
                "📄 Look for the Résumé button in the hero section of the portfolio. If a résumé file is linked there, you can download it directly."
        },
        {
            keys: ["command", "palette", "keyboard shortcut", "navigate"],
            reply:
                "⌨️ Open the Command Palette using Ctrl+K on Windows or Cmd+K on Mac. You can also click the command-palette button in the navbar."
        },
        {
            keys: ["thank", "thanks", "bye", "goodbye", "see you"],
            reply:
                "Thanks for visiting! 🙌 Feel free to explore Praduman's projects and get in touch through the Contact section."
        }
    ];

    const FALLBACK = [
        "I'm not sure about that yet. 🤔 Try asking about Praduman's projects, skills, or education.",
        "Interesting question! 😊 Ask me about JOBS 24, Java, DSA, or AI/ML.",
        "I don't have that information right now. You can also contact Praduman through the Contact section. 📬"
    ];

    function getReply(input) {
        const lower = input.toLowerCase().trim();

        // Match longer phrases before shorter words.
        const entries = [...KB].sort((a, b) => {
            const lengthA = Math.max(...a.keys.map(key => key.length));
            const lengthB = Math.max(...b.keys.map(key => key.length));
            return lengthB - lengthA;
        });

        for (const entry of entries) {
            if (entry.keys.some(key => {
                if (key.length <= 3) {
                    return new RegExp(
                        `(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|\\s|[?!.,])`,
                        "i"
                    ).test(lower);
                }

                return lower.includes(key);
            })) {
                return entry.reply;
            }
        }

        return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    }

    const toggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const closeBtn = document.getElementById("chatClose");
    const body = document.getElementById("chatBody");
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("chatSend");

    if (!toggle || !chatWindow || !body || !input || !sendBtn) {
        return;
    }

    let opened = false;

    function addMsg(text, type) {
        const div = document.createElement("div");
        div.className = `chat-msg ${type}`;
        div.textContent = text;

        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement("div");

        typing.className = "chat-typing";
        typing.innerHTML =
            "<span></span><span></span><span></span>";

        body.appendChild(typing);
        body.scrollTop = body.scrollHeight;

        return typing;
    }

    function botReply(text) {
        const typing = showTyping();

        setTimeout(() => {
            typing.remove();
            addMsg(text, "bot");
        }, 700 + Math.random() * 400);
    }

    function sendMessage() {
        const message = input.value.trim();

        if (!message) return;

        addMsg(message, "user");
        input.value = "";

        botReply(getReply(message));
    }

    toggle.addEventListener("click", () => {
        opened = !opened;

        chatWindow.classList.toggle("open", opened);

        if (opened && body.children.length === 0) {
            setTimeout(() => {
                botReply(
                    "Hey! 👋 I'm Praduman's assistant. Ask me about his projects, skills, education, or how to get in touch!"
                );
            }, 300);
        }

        if (opened) {
            setTimeout(() => input.focus(), 350);
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            opened = false;
            chatWindow.classList.remove("open");
        });
    }

    sendBtn.addEventListener("click", sendMessage);

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});


/* ======================================================
   3. NAVBAR, CURSOR, TILT, TYPING, REVEAL,
      EMAILJS AND COMMAND PALETTE
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    // 3.1 NAVBAR SCROLL SHADOW

    const navbar = document.querySelector(".navbar");

    function updateNavbar() {
        if (navbar) {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        }
    }

    window.addEventListener("scroll", updateNavbar);
    updateNavbar();


    // 3.2 CUSTOM CURSOR AND FOLLOWER

    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");

    if (
        window.matchMedia("(pointer: fine)").matches &&
        cursor &&
        follower
    ) {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        document.addEventListener("mousemove", event => {
            mouseX = event.clientX;
            mouseY = event.clientY;

            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateFollower);
        }

        animateFollower();

        const hoverables = document.querySelectorAll(
            "a, button, .tilt-card"
        );

        hoverables.forEach(element => {
            element.addEventListener("mouseenter", () => {
                follower.style.transform =
                    "translate(-50%, -50%) scale(1.6)";

                follower.style.backgroundColor =
                    "rgba(255,255,255,0.1)";

                follower.style.borderColor =
                    "rgba(255,255,255,0.5)";
            });

            element.addEventListener("mouseleave", () => {
                follower.style.transform =
                    "translate(-50%, -50%) scale(1)";

                follower.style.backgroundColor =
                    "rgba(255,255,255,0.02)";

                follower.style.borderColor =
                    "rgba(255,255,255,0.2)";
            });
        });
    }


    // 3.3 PROJECT CARD 3D TILT

    const cards = document.querySelectorAll(".tilt-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 30;
            const rotateY = (x - centerX) / 30;

            card.style.transform =
                `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transition =
                "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease";

            card.style.transform =
                "perspective(1200px) rotateX(0deg) rotateY(0deg)";

            setTimeout(() => {
                card.style.transition = "";
            }, 500);
        });
    });


    // 3.4 TYPING ANIMATION

    const typeTarget = document.querySelector(".type-effect");

    if (typeTarget) {
        const words = [
            "Java Developer.",
            "DSA Enthusiast.",
            "AI/ML Explorer.",
            "Full-Stack Developer."
        ];

        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function type() {
            const current = words[wordIdx];

            if (isDeleting) {
                charIdx--;
            } else {
                charIdx++;
            }

            typeTarget.textContent =
                current.substring(0, charIdx);

            let speed = isDeleting ? 50 : 110;

            if (!isDeleting && charIdx === current.length) {
                speed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                speed = 400;
            }

            setTimeout(type, speed);
        }

        setTimeout(type, 800);
    }


    // 3.5 SCROLL REVEAL

    const reveals = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, {
            threshold: 0.1
        });

        reveals.forEach(element => observer.observe(element));
    } else {
        reveals.forEach(element => {
            element.classList.add("active");
        });
    }


    // 3.6 EMAILJS CONTACT FORM

    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const formStatus = document.getElementById("formStatus");

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (typeof emailjs === "undefined") {
                formStatus.textContent =
                    "Email service is not initialized. Please try again later.";

                formStatus.style.color = "#ff4d4d";
                return;
            }

            const originalText = submitBtn.textContent;

            submitBtn.textContent = "TRANSMITTING...";
            submitBtn.disabled = true;

            emailjs.sendForm(
                "service_xl5ir1g",
                "template_5i79puq",
                this
            )
            .then(() => {
                formStatus.textContent =
                    "MESSAGE SENT SUCCESSFULLY!";

                formStatus.style.color = "#ffffff";

                contactForm.reset();
            })
            .catch(error => {
                formStatus.textContent =
                    "MESSAGE FAILED. PLEASE TRY AGAIN.";

                formStatus.style.color = "#ff4d4d";

                console.error("EmailJS error:", error);
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }


    // 3.7 COMMAND PALETTE

    const cmdOverlay = document.getElementById("cmdOverlay");
    const cmdInput = document.getElementById("cmdInput");
    const cmdResults = document.getElementById("cmdResults");
    const cmdTrigger = document.querySelector(".cmd-palette");

    if (!cmdOverlay || !cmdInput || !cmdResults) {
        return;
    }

    const COMMANDS = [
        {
            group: "Navigate",
            items: [
                {
                    icon: "🏠",
                    title: "Go to Home",
                    sub: "Jump to the top",
                    action: () => scrollToSection("#home")
                },
                {
                    icon: "💼",
                    title: "Go to Projects",
                    sub: "Explore my projects",
                    action: () => scrollToSection("#projects")
                },
                {
                    icon: "🎓",
                    title: "Go to Education",
                    sub: "Academic background",
                    action: () => scrollToSection("#education")
                },
                {
                    icon: "⚡",
                    title: "Go to Skills",
                    sub: "Technologies and skills",
                    action: () => scrollToSection("#skills")
                },
                {
                    icon: "✉️",
                    title: "Go to Contact",
                    sub: "Send me a message",
                    action: () => scrollToSection("#contact")
                }
            ]
        },
        {
            group: "Projects",
            items: [
                {
                    icon: "💼",
                    title: "JOBS 24",
                    sub: "React, Spring Boot, MySQL, Docker",
                    action: () => scrollToSection("#projects")
                },
                {
                    icon: "🚇",
                    title: "AI Metro",
                    sub: "Planned AI/ML project",
                    action: () => scrollToSection("#projects")
                }
            ]
        },
        {
            group: "Source Code",
            items: [
                {
                    icon: "🐙",
                    title: "GitHub Profile",
                    sub: "github.com/Prad1208",
                    action: () => window.open(
                        "https://github.com/Prad1208",
                        "_blank",
                        "noopener,noreferrer"
                    )
                },
                {
                    icon: "🐙",
                    title: "JOBS 24 Repository",
                    sub: "Find JOBS 24 on GitHub",
                    action: () => window.open(
                        "https://github.com/Prad1208?tab=repositories",
                        "_blank",
                        "noopener,noreferrer"
                    )
                }
            ]
        }
    ];

    function scrollToSection(selector) {
        const section = document.querySelector(selector);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth"
            });
        }
    }

    let activeIdx = -1;
    let flatItems = [];

    function openPalette() {
        cmdOverlay.classList.add("open");
        cmdInput.value = "";

        renderResults("");

        setTimeout(() => cmdInput.focus(), 50);
    }

    function closePalette() {
        cmdOverlay.classList.remove("open");
        activeIdx = -1;
    }

    function renderResults(query) {
        const q = query.trim().toLowerCase();

        cmdResults.innerHTML = "";
        flatItems = [];

        COMMANDS.forEach(group => {
            const matched = group.items.filter(item =>
                item.title.toLowerCase().includes(q) ||
                item.sub.toLowerCase().includes(q) ||
                group.group.toLowerCase().includes(q)
            );

            if (!matched.length) return;

            const label = document.createElement("div");

            label.className = "cmd-group-label";
            label.textContent = group.group;

            cmdResults.appendChild(label);

            matched.forEach(item => {
                const element = document.createElement("div");

                element.className = "cmd-item";

                const icon = document.createElement("div");
                icon.className = "cmd-item-icon";
                icon.textContent = item.icon;

                const textContainer = document.createElement("div");
                textContainer.className = "cmd-item-text";

                const title = document.createElement("div");
                title.className = "cmd-item-title";
                title.textContent = item.title;

                const subtitle = document.createElement("div");
                subtitle.className = "cmd-item-sub";
                subtitle.textContent = item.sub;

                const arrow = document.createElement("div");
                arrow.className = "cmd-item-arrow";
                arrow.textContent = "↗";

                textContainer.append(title, subtitle);
                element.append(icon, textContainer, arrow);

                element.addEventListener("click", () => {
                    item.action();
                    closePalette();
                });

                cmdResults.appendChild(element);

                flatItems.push({
                    el: element,
                    action: item.action
                });
            });
        });

        if (!flatItems.length) {
            const noResults = document.createElement("div");

            noResults.className = "cmd-no-results";
            noResults.textContent = `No results for "${query}"`;

            cmdResults.appendChild(noResults);
        }

        activeIdx = -1;
    }

    function setActive(index) {
        flatItems.forEach(({ el }) => {
            el.classList.remove("active");
        });

        if (index >= 0 && index < flatItems.length) {
            flatItems[index].el.classList.add("active");

            flatItems[index].el.scrollIntoView({
                block: "nearest"
            });
        }

        activeIdx = index;
    }

    if (cmdTrigger) {
        cmdTrigger.addEventListener("click", openPalette);
    }

    cmdOverlay.addEventListener("click", event => {
        if (event.target === cmdOverlay) {
            closePalette();
        }
    });

    cmdInput.addEventListener("input", event => {
        renderResults(event.target.value);
    });

    cmdInput.addEventListener("keydown", event => {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            setActive(
                Math.min(activeIdx + 1, flatItems.length - 1)
            );
        } else if (event.key === "ArrowUp") {
            event.preventDefault();

            setActive(
                Math.max(activeIdx - 1, 0)
            );
        } else if (event.key === "Enter" && activeIdx >= 0) {
            flatItems[activeIdx].action();
            closePalette();
        } else if (event.key === "Escape") {
            closePalette();
        }
    });

    document.addEventListener("keydown", event => {
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {
            event.preventDefault();

            if (cmdOverlay.classList.contains("open")) {
                closePalette();
            } else {
                openPalette();
            }
        }

        if (
            event.key === "Escape" &&
            cmdOverlay.classList.contains("open")
        ) {
            closePalette();
        }
    });

    // Display the initial command list.
    renderResults("");
});