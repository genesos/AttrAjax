(function ($) {
    $.attrAjax = $.attrAjax || {};

    $.extend($.attrAjax, {
        OPTION: {
            "data-aa-url": window.location.pathname, // url string
            "data-aa-event": "click", // event type string
            "data-aa-method": "get", // method string
            "data-aa-timeout": null, // integer (milli seconds)

            "data-aa-disable-in-working": true,
            "data-aa-sync": null, // sync id
            "data-aa-datatype": "json", // text, json string
            "data-aa-stoppropagation": false, // true or false string

            "data-aa-confirm": null, // string

            "data-aa-param": null, // query string
            "data-aa-param-form": null, // css selector

            "data-aa-result-to": null, // css selector
            "data-aa-tmpl-with": null,

            "data-aa-oncomplete-alert": false, //true or false string
            "data-aa-oncomplete-msg": null,
            "data-aa-oncomplete-focus": null,

            "data-aa-onerror-alert": false, //true or false string
            "data-aa-onerror-msg": "failed: unknown server error",
            "data-aa-onerror-focus": null, // css selector

            "data-aa-success-if-result-is": null,
            "data-aa-onsuccess-msg": null,
            "data-aa-onsuccess-alert": false,
            "data-aa-onsuccess-clear-input": true, // true or false string
            "data-aa-onfail-alert": false,
            "data-aa-onfail-msg": "failed",

            "data-aa-onempty-msg": null,

            "data-aa-alert-type": "alert", //alert, value or text string
            "data-aa-alert-target": null //css selector
        },
        CALLBACK: [
            "data-aa-oncustomparam", // function name string
            "data-aa-onsubmit", // function name string
            "data-aa-onsuccess", // function name string
            "data-aa-onerror", // function name string
            "data-aa-oncomplete" // function name string
        ],
        VALIDATION_REGEXP: {
            "data-aa-valid-number": "^[0-9]*$",
            "data-aa-valid-email": "^(.+@.+[.].+)$",
            "data-aa-valid-letter": "^[a-zA-Z]*$",
            "data-aa-valid-notempty": "^(.|\n)+$",
            "data-aa-valid-regexp": ""
        },
        MUTEX: {},
        //"data-aa-msg-valid"	//validation error message of input in form or subform
        //"data-aa-input-name"	//input name of input in form or subform
        printMsg: function (options, msg) {
            var alert_method = options["data-aa-alert-type"];
            var alert_target = options["data-aa-alert-target"];
            if (alert_method == "alert") {
                alert(msg);
            } else if (alert_method == "text") {
                $(alert_target).text(msg);
            } else if (alert_method == "html") {
                $(alert_target).html(msg);
            } else if (alert_method == "value" || alert_method == "val") {
                $(alert_target).val(msg);
            } else if (alert_method == "popup") {
                var myWindow = window.open('', '', 'width=400,height=300');
                myWindow.document.write(msg);
            }
        }
    });

    $.fn.extend({
        attrAjax: function (option) {
            $(this).each(function () {
                var $this = $(this);
                var tag_name = $this.prop("tagName");
                var isForm = tag_name == "FORM";

                var ajax_event = isForm ? "submit" : $.attrAjax.OPTION["data-aa-event"];
                ajax_event = $this.attr("data-aa-event") || ajax_event;
                $this.off(ajax_event);
                $this.on(ajax_event, ajax_event_function);
                function ajax_event_function(e) {
                    var key;
                    var inputs;
                    if ($(this).attr("data-aa-in-disable") == "true") {
                        return false;
                    }

                    if (e.preventDefault) {
                        e.preventDefault();
                    } else {
                        e.returnValue = false;
                    }

                    if ($this.attr("data-aa-stoppropagation") !== undefined) {
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        } else {
                            e.returnValue = false;
                        }
                        e.stopPropagation();
                    }

                    var options = {};

                    for (var name in $.attrAjax.OPTION) {
                        if (!$.attrAjax.OPTION.hasOwnProperty(name))
                            continue;
                        if ($this.attr(name) === undefined)
                            options[name] = $.attrAjax.OPTION[name];
                        else if ($this.attr(name) === '')
                            options[name] = true;
                        else
                            options[name] = $this.attr(name);
                    }

                    for (var i in $.attrAjax.CALLBACK) {
                        if (!$.attrAjax.CALLBACK.hasOwnProperty(i))
                            continue;
                        key = $.attrAjax.CALLBACK[i];
                        if ($this.attr(key)) {
                            options[key] = eval($this.attr(key));
                        } else {
                            options[key] = null;
                        }
                    }

                    //sync
                    if (options["data-aa-sync"]) {
                        if ($.attrAjax.MUTEX[options["data-aa-sync"]]) {
                            return false;
                        } else {
                            $.attrAjax.MUTEX[options["data-aa-sync"]] = true;
                        }
                    }

                    //build params & validate inputs
                    var param = options["data-aa-param"] || "";

                    if (options["data-aa-param-form"]) {
                        if (options["data-aa-param-form"] === "" || options["data-aa-param-form"] == "this") {
                            inputs = $this.find("input[type!=submit][type!=button], textarea, select");
                        } else {
                            inputs = $(options["data-aa-param-form"]).find("input[type!=submit][type!=button], textarea, select");
                        }
                        if (inputs.length) {
                            if (!$(options["data-aa-param-form"]).validate(options)) {
                                return false;
                            }
                            if (param) param += "&";
                            param += inputs.serialize();
                        }
                    }

                    if (isForm) {
                        inputs = $(this).find("input[type!=submit][type!=button], textarea, select");
                        if (inputs.length) {
                            if (!$this.validate(options)) {
                                return false;
                            }
                            if (param) param += "&";
                            param += $this.serialize();
                        }
                    }

                    if (options["data-aa-oncustomparam"]) {
                        if (param) param += "&";
                        var custrom_param = options["data-aa-oncustomparam"]($this)
                        if (typeof custrom_param == 'object')
                            param += $.param(custrom_param);
                        else
                            param += custrom_param;
                    }

                    //confirm
                    if (options["data-aa-confirm"]) {
                        if (!confirm(options["data-aa-confirm"])) {
                            return true;
                        }
                    }

                    //callback before ajax
                    if (options["data-aa-onsubmit"]) {
                        var ret = options["data-aa-onsubmit"]($this);
                        if (ret === false) {
                            return true;
                        }
                    }

                    if (options["data-aa-disable-in-working"]) {
                        $this.attr("data-aa-in-disable", "true");
                        if (isForm) {
                            $this.find("input[type=button], input[type=submit]").attr("disabled", "disabled").css("opacity", "0.5");
                        } else {
                            $this.attr("disabled", "disabled").css("opacity", "0.5");
                        }
                    }

                    if (options["data-aa-onsuccess-clear-input"] && options["data-aa-result-to"]) {
                        $(options["data-aa-result-to"]).empty();
                    }

                    $.ajax({
                        url: options["data-aa-url"],
                        type: options["data-aa-method"],
                        dataType: options["data-aa-datatype"],
                        data: param,
                        timeout: options["data-aa-timeout"],
                        error: function (xhr, ajaxOptions, thrownError) {
                            if (options["data-aa-onerror-alert"]) {
                                if (!xhr.responseText) {
                                    $.attrAjax.printMsg(options, options["data-aa-onerror-msg"]);
                                } else {
                                    $.attrAjax.printMsg(options, xhr.responseText);
                                }
                            }
                            else if (options["data-aa-onerror"]) {
                                options["data-aa-onerror"]($this);
                            }

                            if (options["data-aa-onerror-focus"]) {
                                $(options["data-aa-onerror-focus"]).focus();
                            }
                        },
                        success: function (data) {

                            if (data) {
                                if (options["data-aa-datatype"] == 'text') {
                                    if (typeof data !== "undefined") {
                                        data = data.toString();
                                    }
                                    if (options["data-aa-success-if-result-is"]) {
                                        if (options["data-aa-success-if-result-is"] == data) {
                                            if (options["data-aa-onsuccess-alert"])
                                                $.attrAjax.printMsg(options, data);
                                            else if (options["data-aa-onsuccess-msg"])
                                                $.attrAjax.printMsg(options, options["data-aa-onsuccess-msg"]);
                                            if (options["data-aa-onsuccess"]) {
                                                options["data-aa-onsuccess"]($this, data);
                                            }
                                        } else {
                                            if (options["data-aa-onfail-alert"])
                                                $.attrAjax.printMsg(options, data);
                                            else if (options["data-aa-onfail-msg"])
                                                $.attrAjax.printMsg(options, options["data-aa-onfail-msg"]);
                                        }
                                    }
                                }
                                else if (options["data-aa-datatype"] == 'json') {
                                    var success = data.success;
                                    var msg = data.msg;
                                    if (typeof msg !== "undefined") {
                                        msg = msg.toString();
                                    }
                                    if (success) {
                                        if (options["data-aa-onsuccess-alert"])
                                            $.attrAjax.printMsg(options, msg);
                                        else if (options["data-aa-onsuccess-msg"])
                                            $.attrAjax.printMsg(options, options["data-aa-onsuccess-msg"]);
                                        if (options["data-aa-onsuccess"]) {
                                            options["data-aa-onsuccess"]($this, data);
                                        }
                                    } else {
                                        if (options["data-aa-onfail-alert"])
                                            $.attrAjax.printMsg(options, msg);
                                        else if (options["data-aa-onfail-msg"])
                                            $.attrAjax.printMsg(options, options["data-aa-onfail-msg"]);
                                    }
                                }
                            }

                            if (options["data-aa-oncomplete"]) {
                                options["data-aa-oncomplete"](data);
                            }
                            if (options["data-aa-oncomplete-msg"]) {
                                $.attrAjax.printMsg(options, options["data-aa-oncomplete-msg"]);
                            }
                            if (options["data-aa-oncomplete-alert"]) {
                                $.attrAjax.printMsg(options, data);
                            }
                            if (options["data-aa-oncomplete-focus"]) {
                                $(options["data-aa-oncomplete-focus"]).focus();
                            }

                            if (data) {
                                if (options["data-aa-tmpl-with"] && $(options["data-aa-tmpl-with"]).length && options["data-aa-result-to"]) {
                                    $(options["data-aa-result-to"]).append($(options["data-aa-tmpl-with"]).tmpl($.parseJSON(data)));
                                } else {
                                    if (options["data-aa-result-to"]) {
                                        $(options["data-aa-result-to"]).append(data);
                                    }
                                }
                            }
                            else {
                                if (options["data-aa-onempty-msg"]) {
                                    $.attrAjax.printMsg(options, options["data-aa-onempty-msg"]);
                                }
                            }
                        }
                        ,
                        complete: function (jqxhr) {
                            //sync
                            if (options["data-aa-sync"]) {
                                $.attrAjax.MUTEX[options["data-aa-sync"]] = false;
                            }

                            if (options["data-aa-disable-in-working"]) {
                                $this.removeAttr("data-aa-in-disable");
                                if (isForm) {
                                    $this.find("input[type=button], input[type=submit]").removeAttr("disabled").css("opacity", "1.0");
                                } else {
                                    $this.removeAttr("disabled").css("opacity", "1.0");
                                }
                            }
                        }
                        ,
                        fail: function (xhr, status, error) {
                            alert(xhr.responseText);
                        }
                    });
                    return true;
                }
            });
        },
        validate: function (options) {
            var inputs = $(this).find("input[type!=submit][type!=button], textarea, select");
            if (!inputs.length) {
                return true;
            }
            var isInvalidation = false;
            inputs.each(inputs_function);
            function inputs_function() {
                if (!$(this).attr("name")) {
                    return true;
                }
                var $this = $(this);
                for (var key in $.attrAjax.VALIDATION_REGEXP) {
                    if (!$.attrAjax.VALIDATION_REGEXP.hasOwnProperty(key))
                        continue;
                    if ($this.attr(key) !== undefined) {
                        var regexp = null;
                        if (key == "regexp") {
                            regexp = new RegExp($this.attr(key));
                        } else {
                            regexp = new RegExp($.attrAjax.VALIDATION_REGEXP[key]);
                        }
                        if (!regexp.test($this.val())) {
                            var msg;
                            if ($this.attr("data-aa-msg-valid")) {
                                msg = $this.attr("data-aa-msg-valid");
                                $.attrAjax.printMsg(options, msg);
                            } else if ($this.attr("data-aa-input-name")) {
                                msg = "Please enter valid " + $this.attr("data-aa-input-name") + " value";
                                $.attrAjax.printMsg(options, msg);
                            }
                            $this.focus();
                            isInvalidation = true;
                            return false;
                        }
                    }
                }
                return true;
            }

            return !isInvalidation;

        }
    });
}(jQuery));
