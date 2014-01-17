#jQuery Attribute Ajax Plugin

Easy ajax using HTML attributes and additional functions in ajax, for jQuery and jQuery template.

- Various ajax attributes.
- Synchronous ajax requests.
- Fake form.
- Support jQuery Template.
- Disable tags in ajax.
- Support all events.
- Every tags can do ajax request.
- Easy validation for input values.

##Overview
The jQuery Attribute Ajax Plugin saves your time to write lots of Ajax codes and provides various additional functions needed in Ajax. The main idea comes from using HTML attributes. If your website needs many ajax requests, just call the main method "attrAjax()" with few Ajax attributes.

##Example

Just add <code>data-aa-url</code> attribute on a tag to do ajax request.
````html
<form id="attrAjax" data-aa-url="http://ajaxurl.com">
  <input type="submit" value="ajax request!" />
</form>
````

and call <code>attrAjax()</code> on javascript code. That's it!
````javascript
$("#attrAjax").attrAjax();
````

Here is too many HTML tags with <code>data-aa-url</code> attribute for Ajax requests..
````html
<form class="attrAjax" data-aa-url="http://ajaxurl.com">
  <input type="submit" value="ajax request!" />
</form>
<div class="attrAjax" data-aa-url="http://ajaxurl.com">Ajax!</div>
<span class="attrAjax" data-aa-url="http://ajaxurl.com">Ajax!</span>
<input class="attrAjax" type="button" value="Ajax!" data-aa-url="http://ajaxurl.com" />
...
...

````
but don't worry, just call <code>attrAjax()</code>! then all tags could be ajax requestors!
````javascript
$(".attrAjax").attrAjax();
````

If you don't like to use many attributes,
just add 'options' argument when calling <code>attrAjax(options)</code>.
````html
<form id="attrAjax">
  <input type="submit" value="ajax request!" />
</form>
````
````javascript
$("#attrAjax").attrAjax({"data-aa-url" : "http://ajaxurl.com" });
````

##Methods
###attrAjax()
Binds events for ajax request.

####Code example:
#####by attribute
HTML
````html
<input class="ajax" data-aa-url="http://ajaxurl.com" type="button" value="ajax request!" />
````
Javascript
````javascript
$(".ajax").attrAjax();
````

#####by javascript
HTML
````html
<input class="ajax" type="button" value="ajax request!" />
````
Javascript
````javascript
$(".ajax").attrAjax({"data-aa-url" : "http://ajaxurl.com" });
````

##Options (attribute keys)
###data-aa-url
Specifies url to send ajax request.
- Mandatory
- Type: String
- Default: null

###data-aa-event
Specifies event to fire ajax request.
- Optional
- Type: String
- Default: "click"

###data-aa-method
Specifies the HTTP method to use.
- Optional
- Type: String
- Default: "get"

###data-aa-timeout
Specifies the timeout(milli seconds) of ajax request.
- Optional
- Type: Integer
- Default: 5000

###data-aa-disableinajax
Specifies whether the tag binded with ajax evnet should be disabled in ajax request.
- Optional
- Type: Boolean
- Default: true

###data-aa-sync
Specifies same id on the tags that you want to bind synchronously.
- Optional
- Type: String
- Default: null
- 
####Code example:

###data-aa-param
###data-aa-subform
###data-aa-stoppropagation
###data-aa-datainit
###data-aa-datatype
###data-aa-successtext
###data-aa-resulttarget
###data-aa-tmpltarget
###data-aa-msg-confirm
###data-aa-msg-complete
###data-aa-msg-error
###data-aa-msg-success
###data-aa-msg-fail
###data-aa-msg-empty
###data-aa-alert-error
###data-aa-alert-fail
###data-aa-alert-success
###data-aa-alerttype
###data-aa-alerttarget
###data-aa-focus-error
###data-aa-focus-success

##Events
###data-aa-onerror
###data-aa-onsuccess
###data-aa-oncomplete
###data-aa-onbefore
###data-aa-oncustomparam

##Form validation
###data-aa-msg-valid
###data-aa-input-name
###data-aa-valid-number
###data-aa-valid-email
###data-aa-valid-letter
###data-aa-valid-notempty
###data-aa-valid-regexp

