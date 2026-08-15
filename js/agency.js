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

    var serviceImages = {
        product: ($carousel.data('product-images') || '').split('|'),
        development: ($carousel.data('development-images') || '').split('|'),
        solution: ($carousel.data('solution-images') || '').split('|')
    };
    var solutionDescriptions = [
        {
            title: 'Hull Cleaning',
            items: [
                'Removal and recovery of attached marine growth such as oyster shells and barnacles.',
                'Before-and-after cleaning comparison with video documentation.'
            ]
        },
        {
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
            title: 'Pipeline Inspection',
            items: [
                'Close visual inspection of submerged sections.',
                'Mooring line inspection.',
                'Measurement of mooring line riser angles.',
                'Subsea cable inspection.',
                'Magnetic survey of buried cables.'
            ]
        }
    ];
    var currentService = 'product';
    var currentIndex = 0;
    var autoTimer;

    function updateDescription() {
        var $description = $('.service-carousel-description');

        if (currentService !== 'solution') {
            $description
                .addClass('is-empty')
                .empty();
            return;
        }

        var description = solutionDescriptions[currentIndex] || solutionDescriptions[0];
        var items = description.items.map(function(item) {
            return '<li>' + item + '</li>';
        }).join('');

        $description
            .removeClass('is-empty')
            .html('<h3>' + description.title + '</h3><ul>' + items + '</ul>');
    }

    function updateImage() {
        var images = serviceImages[currentService] || [];
        var src = images[currentIndex];

        if (!src) {
            return;
        }

        $('.service-carousel-image')
            .attr('src', src)
            .attr('alt', $('.service-tab[data-service="' + currentService + '"]').text().trim());
        updateDescription();
    }

    function showService($tab) {
        currentService = $tab.data('service');
        currentIndex = 0;

        $('.service-tab')
            .removeClass('active')
            .attr('aria-selected', 'false');

        $tab
            .addClass('active')
            .attr('aria-selected', 'true');

        updateImage();
    }

    function stepCarousel(direction) {
        var images = serviceImages[currentService] || [];

        if (!images.length) {
            return;
        }

        currentIndex = (currentIndex + direction + images.length) % images.length;
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
