// 0. Scroll Progress Bar & Back to Top Toggle
try {
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (scrollProgressBar) scrollProgressBar.style.width = scrollPercentage + '%';

        if (backToTop) {
            if (scrollTop > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });
} catch (err) {
    console.error('Scroll progress / back-to-top failed to initialize:', err);
}

// 1. Mobile Navigation Toggle
try {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
        });

        document.querySelectorAll('.nav-item').forEach(n => n.addEventListener('click', () => {
            navMenu.classList.remove('nav-active');
        }));
    }
} catch (err) {
    console.error('Mobile nav failed to initialize:', err);
}

// 2. Lightbox Functionality
try {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("expandedImg");
    const modalVid = document.getElementById("expandedVideo");
    const modalCaption = document.getElementById("modalCaption");
    const mediaItems = document.querySelectorAll(".gallery-item img, .gallery-item video");
    const closeBtn = document.getElementsByClassName("close")[0];

    if (modal && modalImg && modalVid && modalCaption && closeBtn) {
        mediaItems.forEach(media => {
            media.onclick = function(e) {
                e.preventDefault();
                modal.style.display = "flex";

                modalCaption.innerText = this.getAttribute("data-desc") || "";

                if (this.tagName === "IMG") {
                    modalImg.style.display = "block";
                    modalVid.style.display = "none";
                    modalImg.src = this.src;
                } else if (this.tagName === "VIDEO") {
                    modalImg.style.display = "none";
                    modalVid.style.display = "block";
                    modalVid.src = this.querySelector('source').src;
                }
            }
        });

        function closeModal() {
            modal.style.display = "none";
            modalVid.pause();
            modalVid.src = "";
        }

        closeBtn.onclick = closeModal;

        // Close on click outside
        modal.onclick = function(event) {
            if (event.target === modal || event.target === modalCaption) {
                closeModal();
            }
        }

        // Accessibility: Close on Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape" && modal.style.display === "flex") {
                closeModal();
            }
        });
    }
} catch (err) {
    console.error('Lightbox failed to initialize:', err);
}

// 3. Scroll Reveal Animation
try {
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // No IntersectionObserver support — just show everything, don't hide content forever
        revealElements.forEach(el => el.classList.add('active'));
    }
} catch (err) {
    console.error('Scroll reveal failed to initialize:', err);
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
}

// 4. Active Navigation Highlighting
try {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href').split('#')[0] || 'index.html';
        if (linkPath === currentPath || (linkPath === '' && currentPath === 'index.html')) {
            link.classList.add('active-link');
        }
    });

    const sections = document.querySelectorAll('.section-block[id]');
    if (sections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href && href.includes('#')) {
                            link.classList.remove('active-link');
                        }
                    });
                    const activeId = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.nav-links a[href="#${activeId}"], .nav-links a[href$="#${activeId}"]`);
                    if (activeLink) activeLink.classList.add('active-link');
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(section => navObserver.observe(section));
    }
} catch (err) {
    console.error('Active nav highlighting failed to initialize:', err);
}

// 5. 3D Models — Custom Loading Bars & HUD Controls
try {
    document.querySelectorAll('model-viewer').forEach(model => {
        model.addEventListener('progress', (event) => {
            const bar = model.querySelector('.progress-bar');
            const updateBar = model.querySelector('.update-bar');
            if (!bar || !updateBar) return;
            const pct = event.detail.totalProgress * 100;
            updateBar.style.width = `${pct}%`;
            bar.classList.toggle('hide', event.detail.totalProgress === 1);
        });
    });

    // Hero 3D HUD controls
    const heroViewer = document.getElementById('heroModelViewer');
    const resetBtn = document.getElementById('resetModelCam');
    const rotateBtn = document.getElementById('toggleModelRotate');

    if (heroViewer && resetBtn) {
        resetBtn.addEventListener('click', () => {
            heroViewer.cameraTarget = 'auto auto auto';
            heroViewer.cameraOrbit = '0deg 75deg 100%';
        });
    }

    if (heroViewer && rotateBtn) {
        rotateBtn.addEventListener('click', () => {
            if (heroViewer.hasAttribute('auto-rotate')) {
                heroViewer.removeAttribute('auto-rotate');
                rotateBtn.classList.remove('active');
            } else {
                heroViewer.setAttribute('auto-rotate', '');
                rotateBtn.classList.add('active');
            }
        });
    }

    // BWB Project Page Viewer
    const bwbViewer = document.getElementById('bwbModelViewer');
    const resetBwbBtn = document.getElementById('resetBWBModel');
    if (bwbViewer && resetBwbBtn) {
        resetBwbBtn.addEventListener('click', () => {
            bwbViewer.cameraTarget = 'auto auto auto';
            bwbViewer.cameraOrbit = '0deg 75deg 100%';
        });
    }
} catch (err) {
    console.error('Model loading bars / HUD controls failed to initialize:', err);
}

// 6. Interactive Timeline Node Switching
try {
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            nodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
        });
        node.addEventListener('mouseleave', () => {
            node.classList.remove('active');
        });
    });
} catch (err) {
    console.error('Timeline interactions failed:', err);
}

// 7. Lazy-Load model-viewer script via Intersection Observer
try {
    const modelViewers = document.querySelectorAll('model-viewer');

    const loadModelViewerScript = () => {
        if (!document.querySelector('script[src*="model-viewer.min.js"]')) {
            const script = document.createElement('script');
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
            document.body.appendChild(script);
        }
    };

    if (modelViewers.length) {
        if ('IntersectionObserver' in window) {
            const mvObserver = new IntersectionObserver((entries, observer) => {
                const shouldLoad = entries.some(entry => entry.isIntersecting);
                if (shouldLoad) {
                    loadModelViewerScript();
                    observer.disconnect(); 
                }
            }, { rootMargin: '300px' });

            modelViewers.forEach(mv => mvObserver.observe(mv));
        } else {
            loadModelViewerScript();
        }
    }
} catch (err) {
    console.error('Model-viewer lazy loader failed, loading it directly instead:', err);
    if (!document.querySelector('script[src*="model-viewer.min.js"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
        document.body.appendChild(script);
    }
}

// 8. Respect prefers-reduced-motion for auto-rotating 3D models
try {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('model-viewer[auto-rotate]').forEach(mv => {
            mv.removeAttribute('auto-rotate');
        });
    }
} catch (err) {
    console.error('Reduced-motion handling failed:', err);
}

// 9. Subtle Mouse Movement Parallax
try {
    const cards = document.querySelectorAll('.preview-card, .hero-model-container');
    
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = ((clientX - centerX) / centerX) * 2;
        const moveY = ((clientY - centerY) / centerY) * 2;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                card.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
                card.style.transition = 'transform 0.1s ease-out';
            }
        });
    });

    document.addEventListener('mouseleave', () => {
        cards.forEach(card => {
            card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
            card.style.transition = 'transform 0.5s ease-out';
        });
    });
} catch (err) {
    console.error('Parallax effect failed:', err);
}

// 10. True Smooth Scrolling for Hash Links
try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault(); 
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
} catch(err) {
    console.error('Smooth scroll fix failed to initialize:', err);
}