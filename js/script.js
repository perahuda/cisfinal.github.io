$(document).ready(function () {
    if ($('.burger').length > 0) {
        var responsiveBurger = debounce(function () {
            if ($(window).width() < '992') {
                $(".burger").off('click', burgerMenu)

                setTimeout(function () {
                    $('.burger').on('click', burgerMenu)
                }, 100)
            } else {
                $('.burger').off('click', burgerMenu)
                closeMobMenu();
            }
        }, 250);

        if ($(window).width() < '992') {
            $('.burger').on('click', burgerMenu)
        }

        $(window).on('resize', responsiveBurger);
    }

    if ($('.slideItem').length > 0) {
        $('.slideHead').map(function () {
            var slideHead = $(this),
                slideBody = slideHead.siblings('.slideContent'),
                slideItem = slideHead.parent('.slideItem');

            slideHead.on('click', function () {
                if (!slideHead.hasClass('slideOpened')) {
                    slideItem.siblings('.slideItem').children('.slideHead.slideOpened')
                        .removeClass('slideOpened').siblings('.slideContent').stop().slideUp();

                    slideHead.addClass('slideOpened');
                    slideBody.stop().slideDown();

                    setTimeout(function () {
                        $('html, body').animate({
                            scrollTop: slideHead.offset().top
                        }, 600);
                    }, 400)


                } else {
                    slideHead.removeClass('slideOpened');
                    slideBody.stop().slideUp()
                }
            })
        })
    }

    if ($('.scrollingLink').length > 0) {
        $('.scrollingLink').map(function () {
            $(this).on('click', function (event) {
                event.preventDefault();
                var id = $(this).attr('href'),
                    top = $(id).offset().top;

                $('body,html').stop().animate({ scrollTop: top }, 1000);

                if ($(window).width() < '992') {
                    closeMobMenu()
                }
            })
        })
    }

    $('.phoneMask').inputmask({ showMaskOnHover: false });

    if ($('.linkModal').length > 0) {
        $(".linkModal").map(function () {
            $(this).fancybox({
                btnTpl: {
                    smallBtn: '<span data-fancybox-close class="fancybox-close-small modal-close icon-cancel"></span>'
                },
                closeBtn: false,
                autoFocus: false,
                touch: false,
                onActivate: function () {
                    if ($('.mobWrapper').hasClass('activeMobMenu')) {
                        closeMobMenu()
                    }
                },
                beforeLoad: function () {
                    $('body').addClass('bodyModal')
                },
                beforeClose: function () {
                    $('body').removeClass('bodyModal')
                },
            });
        })
    }

    if ($('.galleryLink').length > 0) {
        $(".galleryLink").fancybox({
            buttons: [
                "zoom",
                "close"
            ],
            btnTpl: {
                zoom:
                    '<span data-fancybox-zoom class="fancybox-button fancybox-button--zoom icon-loupe"></span>',
                close: '<span data-fancybox-close class="fancybox-button fancybox-button--close icon-cancel"></span>',
                arrowLeft:
                    '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left icon-left-arrow"></button>',

                arrowRight:
                    '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right icon-right-arrow"></button>',
            },
            transitionEffect: "slide",
        });
    }

    $('.validate').map(function () {
        $(this).validate({
            rules: {
                clientMail: {
                    required: true
                },
                clientMessage: {
                    required: true
                },
                clientPhone: {
                    required: true
                }
            },
            messages: {
                clientMessage: "Ошибка, необходимо написать сообщение",
                clientMail: "Ошибка, e-mail введен некорректно",
                clientPhone: "Ошибка, телефон введен некорректно"
            },
            submitHandler: function (form) {
                var str = $(form).serialize();
                $(form).addClass('active');
                $(form).find("input:not([type='submit']), textarea").val("");
                $.ajax({
                    type: "post",
                    url: "mail.php",
                    data: str,
                    success: function (res) {
                        if (res == "") {
                            if ($(form).hasClass('active')) {
                                $(form).find(".btnMain").fadeOut().parents(".btnWrapper").addClass('success').html("<p>Спасибо! Заявка отправлена, мы с вами свяжемся в ближайшее время</p>");
                            }

                        } else {
                            if ($(form).hasClass('active')) {
                                $(form).find(".btnMain").fadeOut().parents(".btnWrapper").addClass('error').html("<p>Ошибка! Попробуйте <a href='/'>перезагрузить страницу</a> или повторить позже</p>");
                            }
                        }
                    }, error: function (response) {
                        if ($(form).hasClass('active')) {
                            $(form).find(".btnMain").fadeOut().parents(".btnWrapper").addClass('error').html("<p>Ошибка! Попробуйте <a href='/'>перезагрузить страницу</a> или повторить позже</p>");
                        }

                    }
                });
            }
        });
    })
})

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var burgerMenu = function () {
    if (!$(".burger").hasClass('openedBurger')) {
        openMobMenu();
    } else {
        closeMobMenu()
    }
    console.log('click')
}

var openMobMenu = function () {
    $('.burger').addClass('openedBurger');
    $('.mobWrapper').addClass('activeMobMenu');
    $('body').addClass('bodyMenu');

    setTimeout(function () {
        $('body').on(
            'click',
            {
                el: $('.mobWrapper'),
                func: closeMobMenu.bind(this)
            },
            clickOutToClose
        )
    }, 100)
}

var closeMobMenu = function () {
    $('.burger').removeClass('openedBurger');
    $('.mobWrapper').removeClass('activeMobMenu');
    $('body').off('click', clickOutToClose);
    $('body').removeClass('bodyMenu');
    $('.mobWrapper').scrollTop(0);
}

var clickOutToClose = function (e) {
    console.log('out')
    if (!$(e.data.el).is(e.target)
        && $(e.data.el).has(e.target).length === 0) {
        e.data.func()
    }
}

var loadMap = function () {
    ymaps.ready(function () {
        var myMap = new ymaps.Map(
            'map',
            {
                center: [52.097345, 23.730984],
                zoom: 15,
                controls: ['zoomControl']
            }),
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
                '<div class="markPlace" style="color: #FFFFFF;">$[properties.iconContent]</div>'
            ),
            myPlacemark = new ymaps.Placemark(myMap.getCenter(),
                {
                    iconContent: '<img src ="img/logo.svg">'
                },
                {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: '',
                    iconImageSize: [60, 48],
                    iconImageOffset: [-30, -48],
                    iconContentLayout: MyIconContentLayout
                }
            );
        myMap.geoObjects.add(myPlacemark);

        myMap.behaviors.disable('drag');
    });
}