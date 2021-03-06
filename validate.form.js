(function ($) {
    $.fn.formValidator = function () {
        if(arguments.length == 0) {
            arguments = [{}];
        }
        methods.init.apply($(this), arguments);
        $(this).each(function() {
            $(this).on('submit', function() {
                try {
                    var options = $(this).data('options');
                    methods.validate.apply($(this));
                } catch (e) {
                    $(this).trigger(events.validateFailed);
                    return false;
                }

                return true;
            });
        });
    };
    var initOptions = {
        need_validate_selector : '.need-validate',
        field_item_selector : '.field-item',
        error_field_selector : '.error'
    };

    var events = {
        beforeInit : 'beforeInit',
        afterInit : 'afterInit',
        beforeValidate : 'beforeValidate',
        afterValidate : 'afterValidate',
        validateField : 'validate.field',
        beforeValidateField : 'beforeValidateField',
        afterValidateField : 'afterValidateField',
        validateFailed : 'validateFailed'
    };

    var default_field_validator = {
        required : function() {
            $(this).trigger(events.beforeValidateField, 'required');
            var form = $(this).parents('form');
            var options = form.data('options');
            var field_item = $(this).parents(options.field_item_selector);
            var error_field = field_item.find(options.error_field_selector);
            if($(this).val() != '') {
                error_field.addClass('display-none');
                $(this).trigger(events.afterValidateField, 'required');
                return true;
            }

            $(this).data('error_message', '该字段必填');
            $(this).trigger(events.afterValidateField, ['required']);
            error_field.html($(this).data('error_message'));
            error_field.removeClass('display-none');
            throw new Error();
        },
        number : function() {
            $(this).trigger(events.beforeValidateField, 'number');
            var form = $(this).parents('form');
            var options = form.data('options');
            var field_item = $(this).parents(options.field_item_selector);
            var error_field = field_item.find(options.error_field_selector);
            if($(this).val() % 1 == 0) {
                error_field.addClass('display-none');
                $(this).trigger(events.afterValidateField, 'number');
                return true;
            }

            $(this).data('error_message', '该字段必须为数字');
            $(this).trigger(events.afterValidateField, ['number']);
            error_field.html($(this).data('error_message'));
            error_field.removeClass('display-none');
            throw new Error();
        },
        email : function() {
            $(this).trigger(events.beforeValidateField, 'email');
            var form = $(this).parents('form');
            var options = form.data('options');
            var field_item = $(this).parents(options.field_item_selector);
            var error_field = field_item.find(options.error_field_selector);
            var value = $(this).val();
            var reg = /\w+@\w+\.com/;
            if (reg.test(value)) {
                error_field.addClass('display-none');
                $(this).trigger(events.afterValidateField, 'email');
                return true;
            }

            $(this).data('error_message', '该字段必须为邮箱');
            $(this).trigger(events.afterValidateField, 'email');
            error_field.html($(this).data('error_message'));
            error_field.removeClass('display-none');
            throw new Error();
        },
        match : function () {
            $(this).trigger(events.beforeValidateField, 'match');
            var form = $(this).parents('form');
            var options = form.data('options');

            var field_item = $(this).parents(options.field_item_selector);
            var error_field = field_item.find(options.error_field_selector);
            var value = $(this).val();
            var pattern = new RegExp($(this).data('pattern'));
            if (pattern.test(value)) {
                error_field.addClass('display-none');
                $(this).trigger(events.afterValidateField, 'match');
                return true;
            }

            $(this).data('error_message', '该字段不符合需求');
            $(this).trigger(events.afterValidateField, 'match');
            error_field.html($(this).data('error_message'));
            error_field.removeClass('display-none');
            throw new Error();
        },
        ajax_validate : function() {
            $(this).trigger(events.beforeValidateField, 'ajax_validate');
            var url = $(this).data('ajax-validate-url');
            var form = $(this).parents('form');
            var field_item = $(this).parents(options.field_item_selector);
            var error_field = field_item.find(options.error_field_selector);
            var validate_message;
            $.ajax({
                type : "post",
                url : url,
                data : form.serialize(),
                async : false,
                success : function(data){
                    validate_message = data;
                }
            });

            if (validate_message == 1) {
                error_field.addClass('display-none');
                $(this).trigger(events.afterValidateField, 'ajax_validate');
                return true;
            }

            $(this).data('error_message', '该字段不符合需求');
            $(this).trigger(events.afterValidateField, 'ajax_validate');
            error_field.html($(this).data('error_message'));
            error_field.removeClass('display-none');
            throw new Error();
        },
        beforeValidateField : function() {

        },
        afterValidateField : function() {

        }
    };

    var default_filed_validator_key_selector_map = {
        required : '.required',
        number : '.number',
        email : '.email',
        match : '.match',
        ajax_validate : '.ajax-validate'
    };

    var methods = {
        init : function(params) {
            return $(this).each(function () {
                var form = $(this);
                form.trigger(events.beforeInit);
                var options = params.hasOwnProperty('form_options')?params['form_options'] : {};
                options = $.extend(initOptions, options);
                $(this).data('options', options);

                var validator_key_selector_map = params.hasOwnProperty('validator_key_selector_map')?params['validator_key_selector_map'] : {};
                validator_key_selector_map = $.extend(default_filed_validator_key_selector_map, validator_key_selector_map);

                var validator = params.hasOwnProperty('validator')?params['validator'] : {};
                validator = $.extend(default_field_validator, validator);
                $.each(validator, function(key, callback) {
                    form.find(validator_key_selector_map[key]).on(events.validateField, callback)
                        .on(events.beforeValidateField, validator.beforeValidateField)
                        .on(events.afterValidateField, validator.afterValidateField);
                });
                form.trigger(events.afterInit);
            });
        },
        validate : function() {
            var form = $(this);
            form.trigger(events.beforeValidate);
            var options = form.data('options');
            form.find(options.need_validate_selector).trigger(events.validateField);
            form.trigger(events.afterValidate);
        }
    };
})(window.jQuery);