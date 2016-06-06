/*globals jQuery, window, document */
(function ($, window, document) {
    "use strict";
    window.KRD = window.KRD || {
        $body: null,
        init: function () {
            this.$body = $('body');
            this.liveReload();
            this.placeholderPolyfill();
            this.popUps();
            $('form').krdForm({
                field_support: true,
                error_msg: 'single-error',
                tel_format: 'Nieprawidłowy numer telefonu.',
                text_format: 'Uzupełnij dane',
                checkbox_format: 'Musisz wyrazić zgodę.',
                select_format: 'Uzupełnij dane',
                email_format: 'Nieprawidłowy adres e-mail',
                nip_format: 'Uzupełnij dane',
                empty_format: 'Uzupełnij dane',
            }).find('.field--select select').customSelect();
        },
        popUps: function () {
            var $popup = $('.popup');
            $popup.find('.js-popup-close').on('click', function (e) {
                e.preventDefault();
                $popup.removeClass('visible');
            });
            $('.js-popup-open').on('click', function (e) {
                e.preventDefault();
                $popup.removeClass('visible');
                $(this.hash).addClass('visible');
            });
        },
        liveReload: function () {
            if (window.location.hostname === 'localhost') {
                this.$body.append('<script src="//localhost:9000/livereload.js"></script>');
            }
        },
        placeholderPolyfill: function () {
            $('input, textarea').placeholder();
        }
    };
    $(function () {
        window.KRD.init();
    });
}(jQuery, window, document));
