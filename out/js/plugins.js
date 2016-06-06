// Avoid `console` errors in browsers that lack a console.
(function() {
    var method,
        noop = function () {},
        methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ],
        length = methods.length,
        console = (window.console = window.console || {});
    while (length--) {
        method = methods[length];
        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());
// Place any jQuery/helper plugins in here.

;(function ( $, window, document, undefined ) {
    // Create the defaults once
    var pluginName  =   "krdForm",
        defaults    =   {
            error_class: 'validation-failed',
            error_class_empty: 'is-empty',
            error_msg: 'single-error',
            input_email: 'input[name=email]',
            input_nip: 'input[name=NIP]',
            input_firstname: 'input[name=firstname]',
            input_lastname: 'input[name=lastname]',
            input_phone: 'input[name=phone]',
            select_product: 'select[name=product]',
            checkboxes_container: '.js-checkbox-fields',
            checkbox_company: '.js-checkbox-fields--company',
            checkbox_person: '.js-checkbox-fields--person',
            empty_format: 'Uzupełnij dane.',
            tel_format: 'Nieprawidłowy numer telefonu.',
            text_format: 'Uzupełnij dane',
            checkbox_format: 'Musisz wyrazić zgodę.',
            select_format: 'Uzupełnij dane',
            email_format: 'Nieprawidłowy adres e-mail',
            nip_format: 'Uzupełnij dane',
            field_support: true,
            copy_firstname: true
        };

    // The actual plugin constructor
    function Plugin ( element, options ) {
        this.element    =   element;
        this.$element   =   $(this.element)
        this.settings   =   $.extend( {}, defaults, options );
        this._defaults  =   defaults;
        this._name =        pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.formValidation();
            this.errorMessageToggling();
            this.fieldToggling();
            this.realTimeValidation();
        },
        fieldToggling: function () {
            var that = this;
            $(that.settings.select_product).on('change', function () {
                that.removeErrorMessages();
                if ($(this).val() === "102") {
                    that.currentClientFields();
                } else {
                    that.newClientFields();
                }
                if ($(this).val() === "103") {
                    $(that.settings.checkbox_company).hide();
                    $(that.settings.checkbox_person).show().find("input").addClass("validate");
                } else if ($(this).val() !== "102") {
                    $(that.settings.checkbox_company).show().find("input").addClass("validate");
                    $(that.settings.checkbox_person).hide();
                }
            }).trigger('change');
        },
        currentClientFields: function () {
            if (this.settings.field_support) {
                $(this.settings.input_email).parent().addClass("hidden");
                $(this.settings.input_nip).parent().removeClass("hidden");
            } else {
                $(this.settings.input_email).addClass("hidden");
                $(this.settings.input_nip).removeClass("hidden");
            }
            $(this.settings.input_email).removeClass("validate");
            $(this.settings.input_nip).addClass("validate");
            $(this.settings.checkboxes_container).hide().find("input").removeClass("validate");
        },
        newClientFields: function () {
            if (this.settings.field_support) {
                $(this.settings.input_email).parent().removeClass("hidden");
                $(this.settings.input_nip).parent().addClass("hidden")
            } else {
                $(this.settings.input_email).removeClass("hidden");
                $(this.settings.input_nip).addClass("hidden");
            }
            $(this.settings.input_email).addClass("validate");
            $(this.settings.input_nip).removeClass("validate");
        },
        errorMessageToggling: function () {
            var that = this;
            that.$element.on("click", '.' + that.settings.error_msg, function(e) {
                var $clickedElement = $(this),
                    $element = $clickedElement.siblings('.' + that.settings.error_class);
                if ($element.is('input') || $element.is('select')) {
                    that.resetField($element);
                } else {
                    $clickedElement.remove();
                }
            });
        },
        removeErrorMessages: function () {
            this.$element.find('.' + this.settings.error_class).removeClass(this.settings.error_class);
            this.$element.find('.' + this.settings.error_msg).remove();
        },
        validateNIP: function (fieldValue) {
            var verificator_nip = new Array(6,5,7,2,3,4,5,6,7),
                nip = fieldValue.replace(/[\ \-]/gi, ''),
                nipError = false;
            if (nip.length != 10) {
                nipError = true;
            } else {
                var n = 0;
                for (var i=0; i<9; i++) {   n += nip[i] * verificator_nip[i]; }
                n %= 11;
                if (n != nip[9]) { nipError = true; }
            }
            return !nipError;
        },
        validatePhone: function (fieldValue) {
            return !(fieldValue.match(/^\d{9}$/) ==  null)
        },
        validateEmail: function (fieldValue) {
            return !(fieldValue.match(/^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+\.)+[a-zA-Z0-9.-]{2,4}$/) ==  null)
        },
        copyLastName: function () {
            var copyName = this.$element.find(this.settings.input_firstname).val();
            this.$element.find(this.settings.input_lastname).val(copyName);
        },
        formValidation: function () {
            var that = this;
            that.$element.on('submit', function (e) {
                that.removeErrorMessages();
                if (that.settings.copy_firstname) {
                    that.copyLastName();
                }
                that.$element.find('.validate').each(function () {
                    that.fieldValidation($(this));
                });
                if (that.$element.find('.validation-failed').length > 0) {
                    e.preventDefault();
                    that.addErrorMessages();
                }
            });
        },
        addErrorMessages: function () {
            var that = this;
            that.$element.find('.validation-failed').each(function () {
                var $this = $(this);
                if ($this.is(':text')) {
                    if ($this.is('.' + that.settings.error_class_empty)) {
                        that.addErrorMessage($this, that.settings.empty_format);
                    } else {
                        if ($this.is('.validate-phone')) {
                            that.addErrorMessage($this, that.settings.tel_format);
                        } else if ($this.is('.validate-email')) {
                            that.addErrorMessage($this, that.settings.email_format);
                        } else if ($this.is('.validate-nip')) {
                            that.addErrorMessage($this, that.settings.nip_format);
                        } else {
                            that.addErrorMessage($this, that.settings.text_format)
                        }
                    }
                } else if ($this.is('select')) {
                    that.addErrorMessage($this, that.settings.select_format)
                } else if ($this.is(':checkbox')) {
                    that.addErrorMessage($this, that.settings.checkbox_format);
                }
                that.addFieldErrorHandler($this);
            });
        },
        addErrorMessage: function ($element, message) {
            $element.siblings('.' + this.settings.error_msg).remove();
            $element.parent().append('<span class="' + this.settings.error_msg + '">' + message + '</span>');
        },
        fieldValidation: function ($field) {
            var field_validation_flag = true,
                that = this;
            if ($field.is(':checkbox')) {
                $field.parent().siblings('.' + that.settings.error_msg).remove();
                $field.removeClass(this.settings.error_class);
            } else {
                that.resetField($field);
            }
            if ($field.is('.validate-required') && $field.is(':visible')) {
                if ($field.is(':text') && $field.val().length <= 0) {
                    field_validation_flag = false;
                    $field.addClass('is-empty');
                } else if ($field.is(':checkbox') && !$field.prop('checked')) {
                    field_validation_flag = false;
                } else if ($field.is('select') && ($field.val() == -1)) {
                    field_validation_flag = false;
                }
            }
            if (field_validation_flag && $field.is('.validate-nip') && $field.is(':visible')) {
                field_validation_flag = that.validateNIP($field.val());
            }
            if (field_validation_flag && $field.is('.validate-phone') && $field.is(':visible')) {
                field_validation_flag = that.validatePhone($field.val());
            }
            if ($field.is('.validate-email')) {
                field_validation_flag = that.validateEmail($field.val());
            }
            if (!field_validation_flag) {
                $field.addClass(that.settings.error_class);
            }
        },
        addFieldErrorHandler: function ($field) {
            var that = this;
            $field.off('keyup.val change.val').on('keyup.val change.val', function () {
                if (!$field.is('checkbox')) {
                    that.fieldValidation($field);
                    that.addErrorMessages();
                }
            });
        },
        resetField: function ($field) {
            $field.removeClass(this.settings.error_class + ' ' + this.settings.error_class_empty);
            $field.siblings('.' + this.settings.error_msg).remove();
            $field.off('keyup.val change.val');
        },
        realTimeValidation: function () {
            var that = this;
            that.$element.find('.validate').each(function () {
                var $thisInput = $(this);
                $thisInput.off('focusout.val').on('focusout.val', function () {
                    that.fieldValidation($thisInput);
                    if (that.$element.find('.validation-failed').length > 0) {
                        that.addErrorMessages();
                    }
                });

            });
        }
    };
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };
})( jQuery, window, document );


/*!
 * jquery.customSelect() - v0.5.1
 * http://adam.co/lab/jquery/customselect/
 * 2014-03-19
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License
 */

(function ($) {
    'use strict';

    $.fn.extend({
        customSelect: function (options) {
            // filter out <= IE6
            if (typeof document.body.style.maxHeight === 'undefined') {
                return this;
            }
            var defaults = {
                    customClass: 'customSelect',
                    mapClass:    true,
                    mapStyle:    true
            },
            options = $.extend(defaults, options),
            prefix = options.customClass,
            changed = function ($select,customSelectSpan) {
                var currentSelected = $select.find(':selected'),
                customSelectSpanInner = customSelectSpan.children(':first'),
                html = currentSelected.html() || '&nbsp;';

                customSelectSpanInner.html(html);

                if (currentSelected.attr('disabled')) {
                    customSelectSpan.addClass(getClass('DisabledOption'));
                } else {
                    customSelectSpan.removeClass(getClass('DisabledOption'));
                }

                setTimeout(function () {
                    customSelectSpan.removeClass(getClass('Open'));
                    $(document).off('mouseup.customSelect');
                }, 60);
            },
            getClass = function(suffix){
                return prefix + suffix;
            };

            return this.each(function () {
                var $select = $(this),
                    customSelectInnerSpan = $('<span />').addClass(getClass('Inner')),
                    customSelectSpan = $('<span />');

                $select.after(customSelectSpan.append(customSelectInnerSpan));

                customSelectSpan.addClass(prefix);

                if (options.mapClass) {
                    customSelectSpan.addClass($select.attr('class'));
                }
                if (options.mapStyle) {
                    customSelectSpan.attr('style', $select.attr('style'));
                }

                $select
                    .addClass('hasCustomSelect')
                    .on('render.customSelect', function () {
                        changed($select,customSelectSpan);
                        $select.css('width','');
                        var selectBoxWidth = parseInt($select.outerWidth(), 10) -
                                (parseInt(customSelectSpan.outerWidth(), 10) -
                                    parseInt(customSelectSpan.width(), 10));

                        // Set to inline-block before calculating outerHeight
                        customSelectSpan.css({
                            display: 'inline-block'
                        });

                        var selectBoxHeight = customSelectSpan.outerHeight();

                        if ($select.attr('disabled')) {
                            customSelectSpan.addClass(getClass('Disabled'));
                        } else {
                            customSelectSpan.removeClass(getClass('Disabled'));
                        }

                        customSelectInnerSpan.css({
                            width:   selectBoxWidth,
                            display: 'inline-block'
                        });

                        $select.css({
                            '-webkit-appearance': 'menulist-button',
                            width:                customSelectSpan.outerWidth(),
                            position:             'absolute',
                            opacity:              0,
                            height:               selectBoxHeight,
                            fontSize:             customSelectSpan.css('font-size')
                        });
                    })
                    .on('change.customSelect', function () {
                        customSelectSpan.addClass(getClass('Changed'));
                        changed($select,customSelectSpan);
                    })
                    .on('keyup.customSelect', function (e) {
                        if(!customSelectSpan.hasClass(getClass('Open'))){
                            $select.trigger('blur.customSelect');
                            $select.trigger('focus.customSelect');
                        }else{
                            if(e.which==13||e.which==27){
                                changed($select,customSelectSpan);
                            }
                        }
                    })
                    .on('mousedown.customSelect', function () {
                        customSelectSpan.removeClass(getClass('Changed'));
                    })
                    .on('mouseup.customSelect', function (e) {

                        if( !customSelectSpan.hasClass(getClass('Open'))){
                            // if FF and there are other selects open, just apply focus
                            if($('.'+getClass('Open')).not(customSelectSpan).length>0 && typeof InstallTrigger !== 'undefined'){
                                $select.trigger('focus.customSelect');
                            }else{
                                customSelectSpan.addClass(getClass('Open'));
                                e.stopPropagation();
                                $(document).one('mouseup.customSelect', function (e) {
                                    if( e.target != $select.get(0) && $.inArray(e.target,$select.find('*').get()) < 0 ){
                                        $select.trigger('blur.customSelect');
                                    }else{
                                        changed($select,customSelectSpan);
                                    }
                                });
                            }
                        }
                    })
                    .on('focus.customSelect', function () {
                        customSelectSpan.removeClass(getClass('Changed')).addClass(getClass('Focus'));
                    })
                    .on('blur.customSelect', function () {
                        customSelectSpan.removeClass(getClass('Focus')+' '+getClass('Open'));
                    })
                    .on('mouseenter.customSelect', function () {
                        customSelectSpan.addClass(getClass('Hover'));
                    })
                    .on('mouseleave.customSelect', function () {
                        customSelectSpan.removeClass(getClass('Hover'));
                    })
                    .trigger('render.customSelect');
            });
        }
    });
})(jQuery);

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input');
    var isTextareaSupported = 'placeholder' in document.createElement('textarea');
    var prototype = $.fn;
    var valHooks = $.valHooks;
    var propHooks = $.propHooks;
    var hooks;
    var placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value;
                }

                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);

                var $passwordInput = $element.data('placeholder-password');
                if ($passwordInput) {
                    return $passwordInput[0].value = value;
                }

                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != safeActiveElement()) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        if (!isInputSupported) {
            valHooks.input = hooks;
            propHooks.value = hooks;
        }
        if (!isTextareaSupported) {
            valHooks.textarea = hooks;
            propHooks.value = hooks;
        }

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.placeholder').each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {};
        var rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this;
        var $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == safeActiveElement() && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement;
        var input = this;
        var $input = $(input);
        var id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': $input,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

    function safeActiveElement() {
        // Avoid IE9 `document.activeElement` of death
        // https://github.com/mathiasbynens/jquery-placeholder/pull/99
        try {
            return document.activeElement;
        } catch (err) {}
    }

}(this, document, jQuery));
