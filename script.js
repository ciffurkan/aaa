document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('main-audio');
    const playBtn = document.getElementById('play-pause-btn');
    const playIcon = playBtn.querySelector('.icon-play');
    const pauseIcon = playBtn.querySelector('.icon-pause');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    const visualContent = document.getElementById('visual-content');
    const trackBtns = document.querySelectorAll('.track-btn');

    let currentTrackId = '1';

    // --- Timelines Configuration ---
    const timelines = {
        '1': [
            { id: '1-title', start: 0, end: 3, type: 'text', content: "Diritto all'Oblio", className: 'scene-text-title', animation: 'fade-in-centered' },
            { id: '1-serena-img', start: 7, end: 10, type: 'image', src: 'serena.webp', className: 'scene-image-centered', animation: 'fade-in-centered' },
            {
                id: '1-year-countdown', start: 12, end: 14, type: 'custom',
                render: (container) => {
                    const el = document.createElement('div');
                    el.className = 'scene-text-year fade-in-centered';
                    let currentYear = 2026;
                    const endYear = 2014;
                    el.innerText = currentYear;
                    container.appendChild(el);

                    const duration = 1500;
                    const totalSteps = currentYear - endYear;
                    const stepTime = duration / totalSteps;

                    const interval = setInterval(() => {
                        currentYear--;
                        el.innerText = currentYear;
                        if (currentYear <= endYear) {
                            el.innerText = endYear;
                            clearInterval(interval);
                        }
                    }, stepTime);
                    return { element: el, cleanup: () => clearInterval(interval) };
                }
            },
            { id: '1-fiducia', start: 22, end: 24, type: 'text', content: "FIDUCIA", className: 'scene-text-fiducia', animation: 'fade-in-centered' },
            { id: '1-butterfly', start: 28, end: 30, type: 'image', src: 'icons8-farfalla.gif', className: 'scene-gif-butterfly', animation: 'fade-in-centered' },
            {
                id: '1-view-counter', start: 37, end: 40, type: 'custom',
                render: (container) => {
                    const el = document.createElement('div');
                    el.className = 'scene-counter fade-in-centered';
                    el.innerText = '0 view';
                    container.appendChild(el);

                    let startVal = 0;
                    const endVal = 100000;
                    const duration = 2800;
                    const startTime = Date.now();

                    const animate = () => {
                        const now = Date.now();
                        const progress = Math.min((now - startTime) / duration, 1);
                        const ease = 1 - Math.pow(1 - progress, 3);
                        const currentVal = Math.floor(startVal + (endVal - startVal) * ease);
                        el.innerText = currentVal.toLocaleString() + ' view';
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                    return { element: el, cleanup: () => { } };
                }
            }
        ],
        '2': [
            {
                id: '2-visto', start: 2, end: 4.5, type: 'custom',
                animation: 'fade-in-centered',
                render: (container) => {
                    const el = document.createElement('div');
                    el.className = 'text-impact';
                    el.innerHTML = "VISTO <br><span style='color:#ff3b30'>100.000+</span><br> VOLTE";
                    container.appendChild(el);
                    return { element: el, cleanup: () => { } };
                }
            },
            { id: '2-condiviso', start: 4.5, end: 7, type: 'text', content: "CONDIVISO", className: 'text-impact', animation: 'fade-in-centered' },
            { id: '2-trauma', start: 9, end: 11, type: 'text', content: "TRAUMA", className: 'text-trauma', animation: 'fade-in-centered' },
            { id: '2-ph-logo', start: 15, end: 17, type: 'image', src: 'Pornhub-logo.svg.png', className: 'scene-image-centered blur-effect', animation: 'fade-in-centered' },
            { id: '2-remove-gif', start: 18, end: 19, type: 'image', src: 'icons8-rimuovere.gif', className: 'scene-image-centered', animation: 'fade-in-centered' },
            { id: '2-retweet', start: 23, end: 24, type: 'image', src: 'icons8-retweet-100.png', className: 'scene-image-centered', animation: 'fade-in-centered' },
            {
                id: '2-glitch', start: 29, end: 32, type: 'custom',
                animation: 'fade-in-centered',
                render: (container) => {
                    const el = document.createElement('div');
                    el.className = 'glitch-text';
                    el.innerText = "NON DIMENTICA";
                    el.setAttribute('data-text', "NON DIMENTICA");
                    container.appendChild(el);
                    return { element: el, cleanup: () => { } };
                }
            }
        ],
        '3': [
            { id: '3-eu-flag', start: 3, end: 5, type: 'image', src: 'Flag_of_Europe.svg', className: 'scene-image-centered', animation: 'fade-in-centered' },
            { id: '3-not-needed', start: 7, end: 8, type: 'text', content: "NON PIÙ NECESSARI", className: 'text-impact', animation: 'fade-in-centered' },
            { id: '3-no-consent', start: 8, end: 11, type: 'text', content: "SENZA CONSENSO", className: 'text-impact', animation: 'fade-in-centered' },
            {
                id: '3-list-rules', start: 20, end: 24, type: 'custom',
                render: (container) => {
                    const ul = document.createElement('ul');
                    ul.className = 'scene-list fade-in-centered';
                    const items = [
                        "Vale per profili personali",
                        "Vecchie notizie",
                        "Informazioni obsolete che ledono la privacy"
                    ];
                    items.forEach(text => {
                        const li = document.createElement('li');
                        li.textContent = text;
                        ul.appendChild(li);
                    });
                    container.appendChild(ul);
                    return { element: ul, cleanup: () => { } };
                }
            },
            {
                id: '3-fast-time', start: 27, end: 29.5, type: 'custom',
                render: (container) => {
                    const el = document.createElement('div');
                    el.className = 'scene-date-counter fade-in-centered';
                    container.appendChild(el);

                    let date = new Date();
                    const endDate = new Date();
                    endDate.setFullYear(date.getFullYear() + 2);

                    let currentMs = date.getTime();
                    const endMs = endDate.getTime();

                    const steps = 60;
                    const increment = (endMs - currentMs) / steps;

                    let rafId;
                    const animate = () => {
                        currentMs += increment * 2;
                        const d = new Date(currentMs);
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const year = d.getFullYear();

                        el.innerText = `${day}/${month}/${year}`;

                        rafId = requestAnimationFrame(animate);
                    };
                    animate();

                    return { element: el, cleanup: () => cancelAnimationFrame(rafId) };
                }
            }
        ],
        '4': [
            { id: '4-ph-blur', start: 1, end: 3, type: 'image', src: 'Pornhub-logo.svg.png', className: 'scene-image-centered blur-effect', animation: 'fade-in-centered' },
            { id: '4-visa', start: 3, end: 5, type: 'image', src: 'Visa_Logo.png', className: 'scene-image-centered', animation: 'fade-in-centered' },
            { id: '4-unlock', start: 10, end: 12, type: 'image', src: 'icons8-sbloccare.gif', className: 'scene-image-centered', animation: 'fade-in-centered' },
            { id: '4-copy', start: 14, end: 17, type: 'image', src: 'icons8-copia-.gif', className: 'scene-image-centered', animation: 'fade-in-centered' },
            { id: '4-resp', start: 26, end: 29, type: 'text', content: "RESPONSABILITÀ PIÙ FORTI", className: 'text-impact', animation: 'fade-in-centered' },
            { id: '4-aware', start: 29, end: 31, type: 'text', content: "CONSAPEVOLEZZA", className: 'text-impact', animation: 'fade-in-centered' }
        ]
    };

    let activeEvents = {};

    function updateVisuals(currentTime) {
        const sequence = timelines[currentTrackId] || [];

        sequence.forEach(event => {
            const isActive = currentTime >= event.start && currentTime < event.end;

            if (isActive) {
                if (!activeEvents[event.id]) {
                    mountEvent(event);
                }
            } else {
                if (activeEvents[event.id]) {
                    unmountEvent(event.id);
                }
            }
        });
    }

    function mountEvent(event) {
        let element = null;
        let cleanup = () => { };

        const animClass = event.animation ? event.animation : 'fade-in';

        if (event.type === 'text') {
            element = document.createElement('div');
            element.innerText = event.content;
            element.className = `${event.className} ${animClass}`;
            visualContent.appendChild(element);
        } else if (event.type === 'image') {
            element = document.createElement('img');
            element.src = event.src;
            element.className = `${event.className} ${animClass}`;
            visualContent.appendChild(element);
        } else if (event.type === 'custom') {
            const result = event.render(visualContent);
            element = result.element;
            if (element && !element.classList.contains('fade-in-centered')) {
                if (event.animation) element.classList.add(event.animation);
                else element.classList.add('fade-in');
            }
            cleanup = result.cleanup;
        }

        activeEvents[event.id] = { element, cleanup, skipExitAnimation: event.skipExitAnimation };
    }

    function unmountEvent(id) {
        const { element, cleanup, skipExitAnimation } = activeEvents[id];

        if (element && !skipExitAnimation) {
            let exitClass = 'fade-out';
            if (element.classList.contains('fade-in-centered')) exitClass = 'fade-out-centered';

            element.classList.remove('fade-in');
            element.classList.remove('fade-in-centered');
            element.classList.add(exitClass);

            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
            }, 1000);
        } else if (element && skipExitAnimation) {
            if (element.parentNode) element.parentNode.removeChild(element);
        }

        if (cleanup) cleanup();
        delete activeEvents[id];
    }

    function clearAllVisuals() {
        Object.keys(activeEvents).forEach(id => {
            const { element, cleanup } = activeEvents[id];
            if (element && element.parentNode) element.parentNode.removeChild(element);
            if (cleanup) cleanup();
        });
        activeEvents = {};
        visualContent.innerHTML = '';
    }

    // --- Audio Player Logic ---
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            audio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    playBtn.addEventListener('click', togglePlay);

    audio.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.innerText = formatTime(currentTime);
        updateVisuals(currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
        if (!isNaN(audio.duration)) {
            durationTimeEl.innerText = formatTime(audio.duration);
        } else {
            durationTimeEl.innerText = "00:00";
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    audio.addEventListener('ended', () => {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });

    // --- Track Switcher ---
    trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;

            trackBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentTrackId = btn.getAttribute('data-track');
            const src = btn.getAttribute('data-src');

            audio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            clearAllVisuals();

            audio.src = src;
            audio.load();
        });
    });
});
