(function () {
  /* HERO TYPEWRITER: letter writing animation in hero section */

  var typewriter = document.getElementById('typewriter');
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typewriter) {
    var roles = ['Web Developer', 'IT Technician', 'Software Testing Consultant'];

    // Keep a complete, meaningful role visible if motion is disabled or JS exits early.
    typewriter.textContent = roles[0];

    if (!prefersReducedMotion) {
      var roleIndex = 0;
      var characterIndex = 0;
      var deleting = false;

      function tick() {
        var role = roles[roleIndex];

        if (deleting) {
          characterIndex -= 1;
          typewriter.textContent = role.slice(0, characterIndex);

          if (characterIndex === 0) {
            roleIndex = (roleIndex + 1) % roles.length;
            deleting = false;
            window.setTimeout(tick, 350);
            return;
          }
        } else {
          characterIndex += 1;
          typewriter.textContent = role.slice(0, characterIndex);

          if (characterIndex === role.length) {
            deleting = true;
            window.setTimeout(tick, 1400);
            return;
          }
        }

        window.setTimeout(tick, deleting ? 45 : 85);
      }

      // Start by writing the first role so the animation is immediately apparent.
      typewriter.textContent = '';
      window.setTimeout(tick, 500);
    }
  }

  // Back-to-top control
  var backToTop = document.querySelector('.to-top');

  if (backToTop) {
    var scrollThreshold = 400;

    function updateBackToTop() {
      var isVisible = window.scrollY > scrollThreshold;
      backToTop.classList.toggle('visible', isVisible);
      backToTop.disabled = !isVisible;
      backToTop.setAttribute('aria-hidden', String(!isVisible));
    }

    window.addEventListener('scroll', updateBackToTop, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });

    updateBackToTop();
  }

  // My Works carousel controls
  var carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    var track = carousel.querySelector('.track');
    var slides = carousel.querySelector('.slides');
    var previousButton = carousel.querySelector('.arrow-btn.prev');
    var nextButton = carousel.querySelector('.arrow-btn.next');

    if (track && slides && previousButton && nextButton) {
      function updateCarouselButtons() {
        var maxScroll = track.scrollWidth - track.clientWidth;
        previousButton.disabled = track.scrollLeft <= 1;
        nextButton.disabled = track.scrollLeft >= maxScroll - 1;
      }

      function scrollCarousel(direction) {
        var firstSlide = slides.querySelector('.slide');
        var slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : track.clientWidth;
        var gap = parseFloat(window.getComputedStyle(slides).columnGap) || 0;
        var behavior = prefersReducedMotion ? 'auto' : 'smooth';

        if (track.scrollBy) {
          track.scrollBy({ left: direction * (slideWidth + gap), behavior: behavior });
        } else {
          track.scrollLeft += direction * (slideWidth + gap);
        }
      }

      previousButton.addEventListener('click', function () {
        scrollCarousel(-1);
      });
      nextButton.addEventListener('click', function () {
        scrollCarousel(1);
      });
      track.addEventListener('scroll', updateCarouselButtons, { passive: true });
      window.addEventListener('resize', updateCarouselButtons);
      updateCarouselButtons();
    }
  }

  // Keep the first two blog excerpts at the same visible height as the third.
  var blogGrid = document.querySelector('.blog-grid');

  if (blogGrid) {
    var blogExcerpts = blogGrid.querySelectorAll('.excerpt');
    var referenceExcerpt = blogExcerpts[2];
    var measureFrame = null;

    if (referenceExcerpt && blogExcerpts.length > 2) {
      function matchBlogExcerptHeights() {
        measureFrame = null;
        blogGrid.style.setProperty('--blog-excerpt-height', referenceExcerpt.getBoundingClientRect().height + 'px');
        blogExcerpts[0].classList.add('match-third-height');
        blogExcerpts[1].classList.add('match-third-height');
      }

      function scheduleBlogExcerptMeasurement() {
        if (measureFrame !== null) {
          return;
        }
        measureFrame = window.requestAnimationFrame ? window.requestAnimationFrame(matchBlogExcerptHeights) : window.setTimeout(matchBlogExcerptHeights, 0);
      }

      scheduleBlogExcerptMeasurement();
      window.addEventListener('resize', scheduleBlogExcerptMeasurement);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleBlogExcerptMeasurement);
      }
    }
  }
})();
