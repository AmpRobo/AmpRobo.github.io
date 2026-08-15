/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        var $target = $($anchor.attr('href'));
        var navHeight = $('.navbar-fixed-top').outerHeight() || 0;
        var targetTop;

        if (!$target.length) {
            return;
        }

        targetTop = Math.max(0, $target.offset().top - navHeight);

        $('html, body').stop().animate({
            scrollTop: targetTop
        }, 1500, 'easeInOutExpo', function() {
            $('.navbar-nav li').removeClass('active');
            $anchor.parent('li').addClass('active');
        });
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top',
    offset: ($('.navbar-fixed-top').outerHeight() || 0) + 10
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$('div.modal').on('show.bs.modal', function() {
	var modal = this;
	var hash = modal.id;
	window.location.hash = hash;
	window.onhashchange = function() {
		if (!location.hash){
			$(modal).modal('hide');
		}
	}
});

// Services selector and image carousel.
$(function() {
    var $carousel = $('.services-carousel');

    if (!$carousel.length) {
        return;
    }

    var slides = [
        {
            service: 'product',
            src: ($carousel.data('product-images') || '').split('|')[0],
            alt: 'Product Service'
        },
        {
            service: 'development',
            src: ($carousel.data('development-images') || '').split('|')[0],
            alt: 'Development Service',
            title: 'Development Service',
            items: [
                'For partners building their own underwater robot systems, Amp.Robo offers reference designs and software platforms that accelerate development.'
            ]
        },
        {
            service: 'solution',
            src: ($carousel.data('solution-images') || '').split('|')[0],
            alt: 'Hull Cleaning',
            title: 'Hull Cleaning',
            items: [
                'Removal and recovery of attached marine growth such as oyster shells and barnacles.',
                'Before-and-after cleaning comparison with video documentation.'
            ]
        },
        {
            service: 'solution',
            src: ($carousel.data('solution-images') || '').split('|')[1],
            alt: 'Dam Inspection',
            title: 'Dam Inspection',
            items: [
                'Close visual inspection of vertical and horizontal construction joints.',
                'Crack dimension measurement.',
                'Intake screen inspection.',
                'Removal of submerged driftwood.',
                'Gate door inspection.'
            ]
        },
        {
            service: 'solution',
            src: ($carousel.data('solution-images') || '').split('|')[2],
            alt: 'Pipeline Inspection',
            title: 'Pipeline Inspection',
            items: [
                'Close visual inspection of submerged sections.',
                'Mooring line inspection.',
                'Measurement of mooring line riser angles.',
                'Subsea cable inspection.',
                'Magnetic survey of buried cables.'
            ]
        }
    ].filter(function(slide) {
        return slide.src;
    });
    var currentIndex = 0;
    var autoTimer;

    function updateDescription() {
        var $description = $('.service-carousel-description');
        var slide = slides[currentIndex];

        if (!slide || !slide.items) {
            $description
                .addClass('is-empty')
                .empty();
            return;
        }

        var items = slide.items.map(function(item) {
            return '<li>' + item + '</li>';
        }).join('');

        $description
            .removeClass('is-empty')
            .html('<h3>' + slide.title + '</h3><ul>' + items + '</ul>');
    }

    function updateActiveTab() {
        var service = slides[currentIndex] && slides[currentIndex].service;

        $('.service-tab')
            .removeClass('active')
            .attr('aria-selected', 'false');

        $('.service-tab[data-service="' + service + '"]')
            .addClass('active')
            .attr('aria-selected', 'true');
    }

    function updateImage() {
        var slide = slides[currentIndex];

        if (!slide) {
            return;
        }

        $('.service-carousel-image')
            .attr('src', slide.src)
            .attr('alt', slide.alt);
        updateActiveTab();
        updateDescription();
    }

    function showService($tab) {
        var service = $tab.data('service');
        var targetIndex = 0;

        $.each(slides, function(index, slide) {
            if (slide.service === service) {
                targetIndex = index;
                return false;
            }
        });

        currentIndex = targetIndex;
        updateImage();
    }

    function stepCarousel(direction) {
        if (!slides.length) {
            return;
        }

        currentIndex = (currentIndex + direction + slides.length) % slides.length;
        updateImage();
    }

    function restartAutoPlay() {
        window.clearInterval(autoTimer);
        autoTimer = window.setInterval(function() {
            stepCarousel(1);
        }, 4000);
    }

    $('.service-tab').on('click mouseenter focus', function() {
        showService($(this));
        restartAutoPlay();
    });

    $('.service-carousel-prev').on('click', function() {
        stepCarousel(-1);
        restartAutoPlay();
    });

    $('.service-carousel-next').on('click', function() {
        stepCarousel(1);
        restartAutoPlay();
    });

    updateImage();
    restartAutoPlay();
});
