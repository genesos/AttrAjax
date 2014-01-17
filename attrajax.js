(function ($) {
	$.attrAjax = $.attrAjax || {};

	$.extend($.attrAjax, {
		OPTION: {
			"data-aa-url": window.location.pathname, // url string
			"data-aa-event": "click", // event type string
			"data-aa-method": "get", // method string
			"data-aa-timeout": 5000, // integer (milli seconds)

			"data-aa-disableinajax": "true",
			"data-aa-sync": null, // sync id

			"data-aa-param": null, // query string
			"data-aa-subform": null, // css selector

			"data-aa-stoppropagation": "false", // true or false string

			"data-aa-datainit": "true", // true or false string
			"data-aa-datatype": "text", // text, json string
			"data-aa-successtext": null,
			"data-aa-resulttarget": null, // css selector
			"data-aa-tmpltarget": null,

			"data-aa-msg-confirm": null, // string
			"data-aa-msg-complete": null,
			"data-aa-msg-error": "failed:  unknown server error",
			"data-aa-msg-success": null,
			"data-aa-msg-fail": "failed",
			"data-aa-msg-empty": null,

			"data-aa-alert-error": "false", //true or false string
			"data-aa-alert-fail": "false",
			"data-aa-alert-success": "false",

			"data-aa-alerttype": "alert", //alert, value or text string
			"data-aa-alerttarget": null, //css selector

			"data-aa-focus-error": null, // css selector
			"data-aa-focus-success": null
		},
		CALLBACK: [
			"data-aa-onerror", // function name string
			"data-aa-onsuccess", // function name string
			"data-aa-oncomplete", // function name string
			"data-aa-onbefore", // function name string
			"data-aa-oncustomparam" // function name string
		],
		VALIDATION_REGEXP: {
			"data-aa-valid-number": "^[0-9]*$",
			"data-aa-valid-email": "^(.+@.+[.].+)$",
			"data-aa-valid-letter": "^[a-z]*$",
			"data-aa-valid-notempty": "^.+$",
			"data-aa-valid-regexp": ""
		},
		MUTEX: {},
		//"data-aa-msg-valid"	//validation error message of input in form or subform
		//"data-aa-input-name"	//input name of input in form or subform
		printMsg: function (options, msg) {
			var alert_method = options["data-aa-alerttype"];
			var alert_target = options["data-aa-alerttarget"];
			if (alert_method == "alert") {
				alert(msg);
			} else if (alert_method == "text") {
				$(alert_target).text(msg);
			} else if (alert_method == "value") {
				$(alert_target).val(msg);
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
				$this.on(ajax_event, function (e) {
					if ($(this).attr("data-aa-in-disable") == "true") {
						return;
					}

					if (e.preventDefault) {
						e.preventDefault();
					} else {
						e.returnValue = false;
					}

					if ($this.attr("data-aa-stoppropagation") == "true") {
						if (e.stopPropagation) {
							e.stopPropagation();
						} else {
							e.returnValue = false;
						}
						e.stopPropagation();
					}

					var options = {};

					for (var name in $.attrAjax.OPTION) {
						options[name] = $this.attr(name) ? $this.attr(name) : $.attrAjax.OPTION[name];
					}

					for (var i in $.attrAjax.CALLBACK) {
						var key = $.attrAjax.CALLBACK[i];
						if ($this.attr(key)) {
							eval("options[key] = " + $this.attr(key));
						} else {
							options[key] = null;
						}
					}

					for (var key in option) {
						if (option[key] === true || option[key] === false) {
							options[key] = option[key] === true ? "true" : "false";
						} else {
							options[key] = option[key];
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

					if (options["data-aa-subform"]) {
						var inputs;
						if (options["data-aa-subform"] == "this") {
							inputs = $this.find("input[type!=submit]input[type!=button], textarea, select");
						} else {
							inputs = $(options["data-aa-subform"]).find("input[type!=submit]input[type!=button], textarea, select");
						}
						if (inputs.length) {
							if (!$(options["data-aa-subform"]).validate(options)) {
								return false;
							}
							if (param) param += "&";
							param += inputs.serialize();
						}
					}

					if (isForm) {
						var inputs = $(this).find("input[type!=submit]input[type!=button], textarea, select");
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
						param += options["data-aa-oncustomparam"]($this);
					}

					//confirm
					if (options["data-aa-msg-confirm"]) {
						if (!confirm(options["data-aa-msg-confirm"])) {
							return;
						}
					}

					//callback before ajax
					if (options["data-aa-onbefore"]) {
						var ret = options["data-aa-onbefore"]($this);
						if (ret === false) {
							return;
						}
					}

					if (options["data-aa-disableinajax"] == "true") {
						$this.attr("data-aa-in-disable", "true");
						if (isForm) {
							$this.find("input[type=button], input[type=submit]").attr("disabled", "disabled").css("opacity", "0.5");
						} else {
							$this.attr("disabled", "disabled").css("opacity", "0.5");
						}
					}

					if (options["data-aa-datainit"] == "true" && options["data-aa-resulttarget"]) {
						$(options["data-aa-resulttarget"]).empty();
					}

					$.ajax({
						url: options["data-aa-url"],
						type: options["data-aa-method"],
						dataType: options["data-aa-datatype"],
						data: param,
						timeout: options["data-aa-timeout"],
						error: function () {
							if (options["data-aa-onerror"]) {
								options["data-aa-onerror"]($this);
							}
							if (options["data-aa-alert-error"] == "true") {
								$.attrAjax.printMsg(options, options["data-aa-msg-error"]);
							}
							if (options["data-aa-focus-error"]) {
								$(options["data-aa-focus-error"]).focus();
							}
						},
						success: function (data) {
							if (options["data-aa-alert-success"] == "true") {
								alert(data);
							}
							if (options["data-aa-onsuccess"]) {
								options["data-aa-onsuccess"]($this, data);
							}
							if (options["data-aa-msg-success"]) {
								if (options["data-aa-successtext"]) {
									if (options["data-aa-successtext"] == data) {
										$.attrAjax.printMsg(options, options["data-aa-msg-success"]);
									} else {
										if (options["data-aa-alert-fail"] == "true") {
											$.attrAjax.printMsg(options, options["data-aa-msg-fail"]);
										}
									}
								} else {
									$.attrAjax.printMsg(options, options["data-aa-msg-success"]);
								}
							}

							if (data) {
								if (options["data-aa-tmpltarget"] && $(options["data-aa-tmpltarget"]).length && options["data-aa-resulttarget"]) {
									$(options["data-aa-resulttarget"]).append($(options["data-aa-tmpltarget"]).tmpl(data));
								} else {
									if (options["data-aa-resulttarget"]) {
										$(options["data-aa-resulttarget"]).append(data);
									}
								}
							} else {
								if (options["data-aa-msg-empty"]) {
									$(options["data-aa-resulttarget"]).append(options["data-aa-msg-empty"]);
								}
							}
						},
						complete: function () {
							//sync
							if (options["data-aa-sync"]) {
								$.attrAjax.MUTEX[options["data-aa-sync"]] = false;
							}

							if (options["data-aa-oncomplete"]) {
								options["data-aa-oncomplete"]($this);
							}
							if (options["data-aa-msg-complete"]) {
								$.attrAjax.printMsg(options, options["data-aa-msg-complete"]);
							}
							if (options["data-aa-focus-success"]) {
								$(options["data-aa-focus-success"]).focus();
							}
							if (options["data-aa-disableinajax"] == "true") {
								$this.removeAttr("data-aa-in-disable");
								if (isForm) {
									$this.find("input[type=button], input[type=submit]").removeAttr("disabled").css("opacity", "1.0");
								} else {
									$this.removeAttr("disabled").css("opacity", "1.0");
								}
							}
						}
					});
				});
			});
		},
		validate: function (options) {
			var inputs = $(this).find("input[type!=submit]input[type!=button], textarea, select");
			if (!inputs.length) {
				return true;
			}
			var isInvalidation = false;
			inputs.each(function () {
				if (!$(this).attr("name")) {
					return true;
				}
				var $this = $(this);
				for (var key in $.attrAjax.VALIDATION_REGEXP) {
					if ($this.attr(key) !== undefined) {
						var regexp = null;
						if (key == "regexp") {
							regexp = new RegExp($this.attr(key));
						} else {
							regexp = new RegExp($.attrAjax.VALIDATION_REGEXP[key]);
						}
						if (!regexp.test($this.val())) {
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
			});
			if (isInvalidation) {
				return false;
			}
			return true;
		}
	});
}(jQuery) );