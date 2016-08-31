/*!
 * jQuery attrajax
 * https://github.com/genesos/AttrAjax
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // using AMD; register as anon module
    define(['jquery', 'jquery-form'], factory);
  } else {
    // no AMD; invoke directly
    factory((typeof(jQuery) !== 'undefined') ? jQuery : window.Zepto);
  }
}(function (jQuery) {
  'use strict';
  var $ = jQuery;

  $.attrAjax = $.attrAjax || {};

  $.extend($.attrAjax, {
    COMMON_PREFIX: 'data-aa-',
    OPTION: {
      'url': null, // url string
      'event': 'click', // event type string
      'method': 'get', // method string
      'timeout': null, // integer (milli seconds)

      'disable-in-working': true,
      'sync': null, // sync id
      'datatype': 'json', // text, json string
      'stoppropagation': false, // true or false string

      'confirm': null, // string

      'param': null, // query string
      'param-form': null, // css selector

      'result-to': null, // css selector
      'tmpl-with': null,
      'result-append': false, // true or false string

      'oncomplete-alert': false,  // true or false string
      'oncomplete-msg': null,

      'onerror-alert': false, // true or false string
      'onerror-msg': 'failed: unknown server error',

      'success-if-result-is': null,
      'onsuccess-msg': null,
      'onsuccess-url': null,
      'onsuccess-alert': false,

      'onfail-alert': false,
      'onfail-msg': 'failed',

      'onempty-msg': null,

      'alert-type': 'alert', // alert, value or text string
      'alert-target': null // css selector
    },
    CALLBACK: [
      'oncustomparam', // function name string
      'onsubmit', // function name string
      'onsuccess', // function name string
      'onerror', // function name string
      'oncomplete' // function name string
    ],
    MUTEX: {},
    printMsg: function (options, msg) {
      var alertMethod = options['alert-type'];
      var alertTarget = options['alert-target'];
      var myWindow;
      if (alertMethod === 'alert') {
        alert(msg);
      } else if (alertMethod === 'text') {
        $(alertTarget).text(msg);
      } else if (alertMethod === 'html') {
        $(alertTarget).html(msg);
      } else if (alertMethod === 'value' || alertMethod === 'val') {
        $(alertTarget).val(msg);
      } else if (alertMethod === 'popup') {
        myWindow = window.open('', '', 'width=400,height=300');
        myWindow.document.write(msg);
      }
    }
  });

  $.fn.extend({
    attrAjax: function (jsOptions) {
      $(this).each(function () {
        var selectedDom = $(this);
        var tagName = selectedDom.prop('tagName');
        var isForm = (tagName === 'FORM');
        var isButton = (tagName === 'BUTTON' || (tagName === 'INPUT' && selectedDom.attr('type') === 'button'));
        var isButtonWithValue = (isButton && selectedDom.attr('name') && selectedDom.attr('value'));
        var param;
        var paramDict = [];

        var ajaxEvent = isForm ? 'submit' : $.attrAjax.OPTION.event;
        ajaxEvent = (selectedDom.attr($.attrAjax.COMMON_PREFIX + 'event') || ajaxEvent);
        selectedDom.off(ajaxEvent);
        selectedDom.on(ajaxEvent,
          function (e) {
            var options = $.attrAjax.OPTION;
            var inputs;
            var paramName;
            var paramValue;
            var customParam;
            var ajaxParam;

            if ($(this).attr($.attrAjax.COMMON_PREFIX + '-in-disable') === 'true') {
              return false;
            }

            if (e.preventDefault) {
              e.preventDefault();
            } else {
              e.returnValue = false;
            }

            if (selectedDom.attr($.attrAjax.COMMON_PREFIX + 'stoppropagation') !== undefined) {
              if (e.stopPropagation) {
                e.stopPropagation();
              } else {
                e.returnValue = false;
              }
              e.stopPropagation();
            }

            if (isForm) {
              if (selectedDom.attr($.attrAjax.COMMON_PREFIX + 'action') !== undefined) {
                options.url = selectedDom.attr($.attrAjax.COMMON_PREFIX + 'action');
              }
              if (selectedDom.attr($.attrAjax.COMMON_PREFIX + 'method') !== undefined) {
                options.method = selectedDom.attr($.attrAjax.COMMON_PREFIX + 'method');
              }
            }

            $.each(options, function (key) {
              var attrOfSelectedDom = selectedDom.attr($.attrAjax.COMMON_PREFIX + key);
              if (attrOfSelectedDom === '') {
                options[key] = true;
              } else if (attrOfSelectedDom !== undefined) {
                options[key] = attrOfSelectedDom;
              }
            });

            if (typeof jsOptions === 'object') {
              $.each(jsOptions, function (key, value) {
                options[key] = value;
              });
            }

            $.each($.attrAjax.CALLBACK, function (key, value) {
              if (selectedDom.attr($.attrAjax.COMMON_PREFIX + value)) {
                options[value] = eval(selectedDom.attr($.attrAjax.COMMON_PREFIX + value));
              }
            });

            // sync
            if (options.sync) {
              if ($.attrAjax.MUTEX[options.sync]) {
                return false;
              }
              $.attrAjax.MUTEX[options.sync] = true;
            }

            // confirm
            if (options.confirm) {
              if (!confirm(options.confirm)) {
                return true;
              }
            }

            // build params & validate inputs
            param = options.param || '';

            if (!$.ajaxSubmit) {
              if (isForm || options['param-form']) {
                if (isForm || options['param-form'] === '' || options['param-form'] === 'this') {
                  inputs = selectedDom.find('input[type!=submit][type!=button], textarea, select');
                } else {
                  inputs = $(options['param-form']).find('input[type!=submit][type!=button], textarea, select');
                }
                if (inputs.length) {
                  paramDict = inputs.serializeArray();
                }
              }
              if (isButtonWithValue) {
                paramName = selectedDom.attr('name');
                paramValue = selectedDom.attr('value');
                if (paramName.toString().length) {
                  paramDict.push(
                    {
                      name: paramName,
                      value: paramValue
                    }
                  );
                }
              }
            }

            if (param) {
              param += '&';
            }
            param += $.param(paramDict);

            if (options.oncustomparam) {
              if (param) {
                param += '&';
              }
              customParam = options.oncustomparam(selectedDom);
              if (typeof customParam === 'object') {
                param += $.param(customParam);
              } else {
                param += customParam;
              }
            }

            // callback before ajax
            if (options.onsubmit) {
              if (options.onsubmit(selectedDom) === false) {
                return true;
              }
            }

            if (options['disable-in-working']) {
              selectedDom.attr('in-disable', 'true');
              if (isForm) {
                selectedDom.find('input[type=button], input[type=submit]').attr('disabled', 'disabled').css('opacity', '0.5');
              } else {
                selectedDom.attr('disabled', 'disabled').css('opacity', '0.5');
              }
            }

            if (options['result-to'] && !options['result-append']) {
              $(options['result-to']).empty();
            }
            ajaxParam = {
              url: options.url,
              type: options.method,
              dataType: options.datatype,
              data: param,
              timeout: options.timeout,
              error: function (xhr) {
                if (options['onerror-alert']) {
                  if (!xhr.responseText) {
                    $.attrAjax.printMsg(options, options['onerror-msg']);
                  } else {
                    $.attrAjax.printMsg(options, xhr.responseText);
                  }
                } else if (options.onerror) {
                  options.onerror(selectedDom);
                }
              },
              success: function (dataInput) {
                var data = dataInput;
                var success = false;
                var msg;
                if (data) {
                  if (options.datatype === 'text') {
                    if (typeof data !== 'undefined') {
                      data = data.toString();
                    }
                    if (options['success-if-result-is'] == data) {
                      success = true;
                    }
                    msg = data;
                  } else if (options.datatype === 'json') {
                    success = data.success;
                    msg = data.msg;
                    if (typeof msg !== 'undefined') {
                      msg = msg.toString();
                    }
                  }
                }

                if (success) {
                  if (options['onsuccess-alert']) {
                    $.attrAjax.printMsg(options, msg);
                  }
                  if (options['onsuccess-msg']) {
                    $.attrAjax.printMsg(options, options['onsuccess-msg']);
                  }
                  if (options.onsuccess) {
                    options.onsuccess(selectedDom, data);
                  }
                  if (options['onsuccess-url']) {
                    window.location.href = options['onsuccess-url'];
                  }
                } else {
                  if (options['onfail-alert']) {
                    $.attrAjax.printMsg(options, msg);
                  } else if (options['onfail-msg']) {
                    $.attrAjax.printMsg(options, options['onfail-msg']);
                  }
                }

                if (options.oncomplete) {
                  options.oncomplete(data);
                }
                if (options['oncomplete-msg']) {
                  $.attrAjax.printMsg(options, options['oncomplete-msg']);
                }
                if (options['oncomplete-alert']) {
                  $.attrAjax.printMsg(options, msg);
                }

                if (data) {
                  if (options['tmpl-with'] && $(options['tmpl-with']).length && options['result-to']) {
                    $(options['result-to']).append($(options['tmpl-with']).tmpl($.parseJSON(data)));
                  } else {
                    if (options['result-to']) {
                      $(options['result-to']).append(data);
                    }
                  }
                } else if (options['onempty-msg']) {
                  $.attrAjax.printMsg(options, options['onempty-msg']);
                }
              },
              complete: function () {
                // sync
                if (options.sync) {
                  $.attrAjax.MUTEX[options.sync] = false;
                }

                if (options['disable-in-working']) {
                  selectedDom.removeAttr('in-disable');
                  if (isForm) {
                    selectedDom.find('input[type=button], input[type=submit]').removeAttr('disabled').css('opacity', '1.0');
                  } else {
                    selectedDom.removeAttr('disabled').css('opacity', '1.0');
                  }
                }
              },
              fail: function (xhr) {
                alert(xhr.responseText);
              }
            };
            if (isForm && $.ajaxSubmit) {
              $.ajaxSubmit(ajaxParam);
            } else {
              if (options.url === null) {
                ajaxParam.url = window.location.pathname;
              }
              $.ajax(ajaxParam);
            }
            return true;
          });
      });
    }
  });
}));
