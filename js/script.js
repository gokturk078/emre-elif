/**
 * ════════════════════════════════════════════════════════════════
 * 💕 EMRE & ELİF - UZAK MESAFELİ AŞK WEB SİTESİ
 * Ultra Premium JavaScript
 * ════════════════════════════════════════════════════════════════
 */

// ╔══════════════════════════════════════════════════════════════╗
// ║                     CONFIGURATION                             ║
// ╚══════════════════════════════════════════════════════════════╝

const coupleInfo = {
    // ✏️ DÜZENLE: İlişki başlangıç tarihi (YYYY-MM-DD formatında)
    startDate: '2023-04-01',

    // ✏️ DÜZENLE: Bir sonraki buluşma tarihi
    reunionDate: '2026-02-14',

    // ✏️ DÜZENLE: Şehirler
    cityA: 'İstanbul',
    cityB: 'Ankara',

    // ✏️ DÜZENLE: Mesafe (km)
    distanceKm: 450
};

// Gallery images array (for lightbox navigation)
const galleryImages = [
    'images/reunion-together/12_airport_hug_reunion.png',
    'images/video-calls/05_late_night_call_male.png',
    'images/reunion-together/13_forehead_touch.png',
    'images/reunion-together/14_walking_hand_in_hand.png',
    'images/memories/19_polaroid_wall.png',
    'images/reunion-together/15_laughing_on_couch.png',
    'images/reunion-together/16_kitchen_romance.png',
    'images/travel-longing/11_sunset_thinking.png',
    'images/memories/20_looking_at_photo.png',
    'images/special/27_time_zone_clocks.png',
    'images/memories/21_scrapbook_page.png',
    'images/travel-longing/09_map_plans.png'
];

// ╔══════════════════════════════════════════════════════════════╗
// ║                     DOM ELEMENTS                              ║
// ╚══════════════════════════════════════════════════════════════╝

const elements = {
    navbar: document.getElementById('navbar'),
    navMenu: document.getElementById('nav-menu'),
    navToggle: document.getElementById('nav-toggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    particlesContainer: document.getElementById('particles-container'),
    lightbox: document.getElementById('lightbox'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxPrev: document.getElementById('lightbox-prev'),
    lightboxNext: document.getElementById('lightbox-next'),
    galleryItems: document.querySelectorAll('.gallery-item'),
    musicToggle: document.getElementById('music-toggle'),
    bgMusic: document.getElementById('bg-music'),
    heartBurstBtn: document.getElementById('heart-burst-btn'),
    heartParticles: document.getElementById('heart-particles'),
    letterParagraphs: document.querySelectorAll('.letter-content p'),
    timelineItems: document.querySelectorAll('.timeline-item')
};

// ╔══════════════════════════════════════════════════════════════╗
// ║                     INITIALIZATION                            ║
// ╚══════════════════════════════════════════════════════════════╝

document.addEventListener('DOMContentLoaded', () => {
    // Performance: Initialize lazy loading first
    initLazyLoading();

    initParticles();
    initCounters();
    initNavigation();
    initLightbox();
    initScrollAnimations();
    initGiftBox();
    initSpotifyPlayer();
    initFloatingMusicNotes();
});

// ╔══════════════════════════════════════════════════════════════╗
// ║                PROFESSIONAL LAZY LOADING                      ║
// ╚══════════════════════════════════════════════════════════════╝

function initLazyLoading() {
    // Get all images with loading="lazy" attribute
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px', // Start loading 100px before visible
            threshold: 0.01
        });

        lazyImages.forEach(img => {
            // Add skeleton class while loading
            img.classList.add('lazy-image');
            img.parentElement?.classList.add('img-skeleton');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => loadImage(img));
    }

    // Also optimize all other images
    optimizeAllImages();
}

function loadImage(img) {
    // Use decode() for smoother rendering
    if (img.decode) {
        img.decode()
            .then(() => {
                img.classList.add('loaded');
                img.parentElement?.classList.remove('img-skeleton');
            })
            .catch(() => {
                img.classList.add('loaded');
                img.parentElement?.classList.remove('img-skeleton');
            });
    } else {
        img.classList.add('loaded');
        img.parentElement?.classList.remove('img-skeleton');
    }
}

function optimizeAllImages() {
    // Check WebP support
    const webpSupported = checkWebPSupport();

    // Add loading="lazy" and decoding="async" to all images
    const allImages = document.querySelectorAll('img:not([loading])');
    allImages.forEach((img, index) => {
        // Skip hero background image
        if (img.closest('.hero-background')) {
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('decoding', 'sync');
            // Still try WebP for hero
            if (webpSupported) {
                switchToWebP(img);
            }
        } else {
            img.setAttribute('loading', 'lazy');
            img.setAttribute('decoding', 'async');
            // Switch to WebP if supported
            if (webpSupported) {
                switchToWebP(img);
            }
        }
    });
}

// Check WebP support
function checkWebPSupport() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
}

// Switch image src to WebP
function switchToWebP(img) {
    const src = img.getAttribute('src');
    if (src && src.endsWith('.png')) {
        const webpSrc = src.replace('.png', '.webp');
        // Preload WebP and switch on success
        const testImg = new Image();
        testImg.onload = () => {
            img.src = webpSrc;
        };
        testImg.onerror = () => {
            // Keep original PNG if WebP fails
            console.log('WebP not available for:', src);
        };
        testImg.src = webpSrc;
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     PARTICLES SYSTEM                          ║
// ╚══════════════════════════════════════════════════════════════╝

function initParticles() {
    createStars();
    createFloatingHearts();
}

function createStars() {
    const container = elements.particlesContainer;
    if (!container) return;

    const starCount = window.innerWidth < 768 ? 50 : 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
        `;
        container.appendChild(star);
    }
}

function createFloatingHearts() {
    const container = elements.particlesContainer;
    if (!container) return;

    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘'];
    const heartCount = window.innerWidth < 768 ? 8 : 15;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 15 + 15}px;
            animation-delay: ${Math.random() * 15}s;
            animation-duration: ${Math.random() * 10 + 15}s;
        `;
        container.appendChild(heart);
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     COUNTERS                                  ║
// ╚══════════════════════════════════════════════════════════════╝

function initCounters() {
    updateCounters();
    setInterval(updateCounters, 1000);
}

function updateCounters() {
    const now = new Date();
    const startDate = new Date(coupleInfo.startDate);
    const reunionDate = new Date(coupleInfo.reunionDate);

    // Together counter
    updateTogetherCounter(now, startDate);

    // Hero counter
    updateHeroCounter(now, startDate);

    // Reunion countdown
    updateReunionCounter(now, reunionDate);
}

function updateTogetherCounter(now, start) {
    const diff = now - start;

    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor((diff % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
    const days = Math.floor((diff % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    updateElement('years', years);
    updateElement('months', months);
    updateElement('days', days);
    updateElement('hours', hours);
    updateElement('minutes', minutes);
    updateElement('seconds', seconds);
}

function updateHeroCounter(now, start) {
    const diff = now - start;

    const totalDays = Math.floor(diff / (24 * 60 * 60 * 1000));
    const totalHours = Math.floor(diff / (60 * 60 * 1000));
    const displayHours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const displayMinutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const displaySeconds = Math.floor((diff % (60 * 1000)) / 1000);

    updateElement('days-together', totalDays);
    updateElement('hours-together', displayHours.toString().padStart(2, '0'));
    updateElement('minutes-together', displayMinutes.toString().padStart(2, '0'));
    updateElement('seconds-together', displaySeconds.toString().padStart(2, '0'));
}

function updateReunionCounter(now, reunion) {
    const diff = reunion - now;

    if (diff <= 0) {
        updateElement('reunion-days', '🎉');
        updateElement('reunion-hours', '');
        updateElement('reunion-minutes', '');
        updateElement('reunion-seconds', '');
        return;
    }

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((diff % (60 * 1000)) / 1000);

    updateElement('reunion-days', days);
    updateElement('reunion-hours', hours);
    updateElement('reunion-minutes', minutes);
    updateElement('reunion-seconds', seconds);
}

function updateElement(id, value) {
    const el = document.getElementById(id);
    if (el && el.textContent !== String(value)) {
        el.textContent = value;
        el.classList.add('updated');
        setTimeout(() => el.classList.remove('updated'), 300);
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     NAVIGATION                                ║
// ╚══════════════════════════════════════════════════════════════╝

function initNavigation() {
    // Scroll handler for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', () => {
            elements.navMenu.classList.toggle('active');
            elements.navToggle.classList.toggle('active');
        });
    }

    // Close menu on link click
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.navMenu.classList.remove('active');
            elements.navToggle.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     LIGHTBOX GALLERY                          ║
// ╚══════════════════════════════════════════════════════════════╝

let currentImageIndex = 0;

function initLightbox() {
    // Open lightbox on gallery item click
    elements.galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Close lightbox
    if (elements.lightboxClose) {
        elements.lightboxClose.addEventListener('click', closeLightbox);
    }

    // Click outside to close
    if (elements.lightbox) {
        elements.lightbox.addEventListener('click', (e) => {
            if (e.target === elements.lightbox) {
                closeLightbox();
            }
        });
    }

    // Navigation
    if (elements.lightboxPrev) {
        elements.lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }

    if (elements.lightboxNext) {
        elements.lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!elements.lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    elements.lightboxImg.src = galleryImages[index];
    elements.lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    elements.lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    currentImageIndex += direction;

    if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    }

    elements.lightboxImg.src = galleryImages[currentImageIndex];
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     SCROLL ANIMATIONS                         ║
// ╚══════════════════════════════════════════════════════════════╝

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe timeline items
    elements.timelineItems.forEach(item => observer.observe(item));

    // Observe letter paragraphs
    elements.letterParagraphs.forEach((p, index) => {
        p.style.animationDelay = `${index * 0.2}s`;
        observer.observe(p);
    });

    // Observe section titles
    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });

    // Observe gallery items
    elements.galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe reason cards
    document.querySelectorAll('.reason-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe love notes
    document.querySelectorAll('.love-note').forEach((note, index) => {
        note.style.animationDelay = `${index * 0.05}s`;
        observer.observe(note);
    });

    // Observe bucket items
    document.querySelectorAll('.bucket-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        observer.observe(item);
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     MUSIC PLAYER                              ║
// ╚══════════════════════════════════════════════════════════════╝

let isMusicPlaying = false;

function initMusicPlayer() {
    if (!elements.musicToggle || !elements.bgMusic) return;

    elements.musicToggle.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    if (isMusicPlaying) {
        elements.bgMusic.pause();
        elements.musicToggle.textContent = '🎵';
        elements.musicToggle.style.opacity = '0.6';
    } else {
        elements.bgMusic.play().catch(() => {
            console.log('Müzik çalınamadı. Kullanıcı etkileşimi gerekli.');
        });
        elements.musicToggle.textContent = '🎶';
        elements.musicToggle.style.opacity = '1';
    }
    isMusicPlaying = !isMusicPlaying;
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     HEART BURST EFFECT                        ║
// ╚══════════════════════════════════════════════════════════════╝

function initHeartBurst() {
    if (!elements.heartBurstBtn) return;

    elements.heartBurstBtn.addEventListener('click', createHeartBurst);
}

function createHeartBurst() {
    const container = elements.heartParticles;
    if (!container) return;

    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💜', '💙', '🧡'];
    const burstCount = 50;

    for (let i = 0; i < burstCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const angle = (Math.PI * 2 * i) / burstCount;
        const distance = Math.random() * 300 + 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        heart.style.cssText = `
            left: 50%;
            top: 50%;
            --tx: ${tx}px;
            --ty: ${ty}px;
            font-size: ${Math.random() * 20 + 15}px;
            animation-delay: ${Math.random() * 0.3}s;
        `;

        container.appendChild(heart);

        // Remove after animation
        setTimeout(() => heart.remove(), 2000);
    }

    // Add button feedback
    elements.heartBurstBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.heartBurstBtn.style.transform = '';
    }, 200);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     UTILITY FUNCTIONS                         ║
// ╚══════════════════════════════════════════════════════════════╝

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add parallax effect to hero (optional enhancement)
window.addEventListener('scroll', throttle(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const scrolled = window.pageYOffset;
    const heroHeight = hero.offsetHeight;

    if (scrolled < heroHeight) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / heroHeight);
        }
    }
}, 16));

// Add visible class styles dynamically
const style = document.createElement('style');
style.textContent = `
    .section-title,
    .gallery-item,
    .reason-card,
    .love-note,
    .bucket-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section-title.visible,
    .gallery-item.visible,
    .reason-card.visible,
    .love-note.visible,
    .bucket-item.visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .counter-value.updated {
        animation: counterPop 0.3s ease;
    }
    
    @keyframes counterPop {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// ╔══════════════════════════════════════════════════════════════╗
// ║                     SPOTIFY PLAYER                            ║
// ╚══════════════════════════════════════════════════════════════╝

function initSpotifyPlayer() {
    const audio = document.getElementById('our-song-audio');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');
    const spotifyPlayer = document.getElementById('spotify-player');

    if (!audio || !playBtn) return;

    let isPlaying = false;

    // Get SVG icons
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');

    // Set initial volume
    audio.volume = 0.7;

    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update duration when metadata loaded
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Play/Pause toggle
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.classList.remove('playing');
            spotifyPlayer.classList.remove('playing');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        } else {
            audio.play().then(() => {
                playBtn.classList.add('playing');
                spotifyPlayer.classList.add('playing');
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            }).catch(e => {
                console.log('Audio playback failed:', e);
            });
        }
        isPlaying = !isPlaying;
    });

    // Update progress bar
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // Seek on progress bar click
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });

    // When audio ends
    audio.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        spotifyPlayer.classList.remove('playing');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        isPlaying = false;
        progressFill.style.width = '0%';
    });
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     TYPEWRITER EFFECT                         ║
// ╚══════════════════════════════════════════════════════════════╝

function initTypewriterEffect() {
    const finalMessage = document.getElementById('final-message');
    if (!finalMessage) return;

    const originalText = finalMessage.textContent.trim();

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start typewriter effect
                finalMessage.textContent = '';
                finalMessage.classList.add('typewriter');

                let i = 0;
                const speed = 30; // ms per character

                function typeWriter() {
                    if (i < originalText.length) {
                        finalMessage.textContent += originalText.charAt(i);
                        i++;
                        setTimeout(typeWriter, speed);
                    } else {
                        // Add cursor at end
                        const cursor = document.createElement('span');
                        cursor.className = 'typewriter-cursor';
                        finalMessage.appendChild(cursor);
                    }
                }

                typeWriter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(finalMessage);
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     FLOATING MUSIC NOTES                      ║
// ╚══════════════════════════════════════════════════════════════╝

function initFloatingMusicNotes() {
    const container = document.getElementById('floating-notes');
    if (!container) return;

    const notes = ['🎵', '🎶', '♪', '♫', '💕', '✨'];
    const noteCount = 12;

    for (let i = 0; i < noteCount; i++) {
        const note = document.createElement('div');
        note.className = 'music-note';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${Math.random() * 20 + 15}px;
            animation-delay: ${Math.random() * 8}s;
            animation-duration: ${Math.random() * 5 + 8}s;
        `;
        container.appendChild(note);
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     FLIP CLOCK SYNC                           ║
// ╚══════════════════════════════════════════════════════════════╝

// Sync bottom numbers with top numbers for flip clock effect
function syncFlipClock() {
    const ids = ['years', 'months', 'days', 'hours', 'minutes', 'seconds',
        'reunion-days', 'reunion-hours', 'reunion-minutes', 'reunion-seconds'];

    ids.forEach(id => {
        const top = document.getElementById(id);
        const bottom = document.getElementById(`${id}-bottom`);
        if (top && bottom) {
            bottom.textContent = top.textContent;
        }
    });
}

// Override updateElement for flip clock sync
const originalUpdateElement = typeof updateElement === 'function' ? updateElement : null;

function updateElement(id, value) {
    const el = document.getElementById(id);
    const bottomEl = document.getElementById(`${id}-bottom`);

    if (el && el.textContent !== String(value)) {
        el.textContent = value;
        if (bottomEl) bottomEl.textContent = value;
        el.classList.add('updated');
        setTimeout(() => el.classList.remove('updated'), 300);
    }
}

// ╔══════════════════════════════════════════════════════════════╗
// ║                     FLIP CARD FUNCTION                        ║
// ╚══════════════════════════════════════════════════════════════╝

function flipCard(element) {
    // Toggle flipped class
    element.classList.toggle('flipped');
}

// ╔══════════════════════════════════════════════════════════════╗
// ║            ULTRA PREMIUM GIFT BOX ANIMATION                   ║
// ╚══════════════════════════════════════════════════════════════╝

function initGiftBox() {
    const giftBox = document.getElementById('gift-box');
    const modal = document.getElementById('gift-reveal-modal');
    const closeBtn = document.getElementById('close-gift-modal');
    const sparklesContainer = document.getElementById('modal-sparkles');
    const petalsContainer = document.getElementById('floating-petals');

    if (!giftBox || !modal) return;

    // Gift box click handler
    giftBox.addEventListener('click', () => {
        // Add opened class to gift box
        giftBox.classList.add('opened');

        // Open modal after animation
        setTimeout(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Create sparkle effects
            createSparkles(sparklesContainer);

            // Create floating petals
            createFloatingPetals(petalsContainer);
        }, 800);
    });

    // Close modal handler
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGiftModal);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeGiftModal();
        }
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGiftModal();
        }
    });

    function closeGiftModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear particles after modal closes
        setTimeout(() => {
            if (sparklesContainer) sparklesContainer.innerHTML = '';
            if (petalsContainer) petalsContainer.innerHTML = '';
        }, 600);
    }
}

// Create sparkle particles
function createSparkles(container) {
    if (!container) return;

    const sparkleCount = 50;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 3}s;
            animation-duration: ${Math.random() * 2 + 2}s;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
        `;
        container.appendChild(sparkle);
    }
}

// Create floating rose petals
function createFloatingPetals(container) {
    if (!container) return;

    const petals = ['🌹', '🌸', '🌺', '💮', '🏵️'];
    const petalCount = 20;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${-10 - Math.random() * 20}%;
            font-size: ${Math.random() * 1 + 1}rem;
            animation-delay: ${Math.random() * 5}s;
            animation-duration: ${Math.random() * 6 + 6}s;
        `;
        container.appendChild(petal);
    }
}

// Console easter egg 💕
console.log('%c💕 Elif & Emre 💕', 'font-size: 24px; color: #e94560; font-weight: bold;');
console.log('%cBu site aşkla yapıldı. Mesafeler gerçek değil, aşk gerçek.', 'font-size: 14px; color: #ffd700;');
console.log('%c🎵 Perfect - Ed Sheeran 🎵', 'font-size: 12px; color: #9d4edd;');
console.log('%c🎁 Hediyeni açmayı unutma! 🎁', 'font-size: 12px; color: #e94560;');
