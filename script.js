window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled'); // CSS වලින් .scrolled එකට background color එකක් දෙන්න
    } else {
        header.classList.remove('scrolled');
    }
});
window.addEventListener('scroll', function () {
    const header = document.querySelector('.main-header');

    // Scroll එක 50px ට වඩා පහළට ගියොත් 'scrolled' class එක එකතු කරනවා
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
document.querySelectorAll('.dest-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        const location = this.getAttribute('data-loc');

        // 1. Map එකේ opacity වැඩි කරනවා
        document.getElementById('main-map').style.filter = "grayscale(0) opacity(1)";

        // 2. අදාළ Dot එක පෙන්වනවා
        const activeDot = document.getElementById(`dot-${location}`);
        if (activeDot) {
            activeDot.style.display = 'block';
            activeDot.classList.add('animate-pulse'); // පොඩි animation එකක්
        }
    });

    item.addEventListener('mouseleave', function () {
        // 1. Map එක ආයෙත් අඳුරු කරනවා
        document.getElementById('main-map').style.filter = "grayscale(1) opacity(0.5)";

        // 2. ඔක්කොම dots හංගනවා
        document.querySelectorAll('.map-dot').forEach(dot => {
            dot.style.display = 'none';
        });
    });
});

// Journey Section Hover Logic
document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.journey-category');
    const banner = document.getElementById('journeyBanner');
    const bannerTitle = document.getElementById('bannerTitle');

    categories.forEach(cat => {
        cat.addEventListener('mouseenter', () => {
            // Remove active from all
            categories.forEach(c => c.classList.remove('active'));
            // Add active to current
            cat.classList.add('active');

            // Update banner background and text
            const bgUrl = cat.getAttribute('data-bg');
            const bannerText = cat.getAttribute('data-banner-text');

            if (banner && bannerTitle) {
                banner.style.backgroundImage = `url('${bgUrl}')`;
                bannerTitle.textContent = bannerText;
            }
        });
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn-wrap');
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when link is clicked
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});
