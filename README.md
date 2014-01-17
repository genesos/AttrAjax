#jQuery Attribute Ajax Plugin

The easiest way to send Ajax request using HTML attributes and additional functions in ajax, for jQuery and jQuery template.

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

#### The shortest code for Ajax request using HTML attribute.
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

#### The way to bind Ajax request with many tags.
Here is too many HTML tags with <code>data-aa-url</code> attribute for Ajax requests..
(The attrAjax function supports all tags.)
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

#### Without attributes
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
The tags have same <code>data-aa-sync</code> id could be synchronous.
- Optional
- Type: String
- Default: null

#####Code example:
````html
//sync group 1
<input data-aa-sync="sync_group1" data-aa-url="ajaxtest.php" class="ajax" type="button" value="ajax request!" />
<input data-aa-sync="sync_group1" data-aa-url="ajaxtest.php" class="ajax" type="button" value="ajax request!" />
//sync group 2
<input data-aa-sync="sync_group2" data-aa-url="ajaxtest.php" class="ajax" type="button" value="ajax request!" />
<input data-aa-sync="sync_group2" data-aa-url="ajaxtest.php" class="ajax" type="button" value="ajax request!" />
````

###data-aa-param
Specifies params as query param string of GET method's url.
- Optional
- Type: String
- Default: null

#####Code example:
````html
<input data-aa-param="param1=test&param2=test2" data-aa-url="ajaxtest.php" class="ajax" 
  type="button" value="ajax request!" />
````

###data-aa-subform
Specifies css selector of the fake form that you want to use like form tag.
All input data with name attribute in the selected fake form will be sended to the server and be validated automatically.
- Optional
- Type: String (css selector of only block element, ex: "#subformid")
- Default: null

#####Code example:
````html
<form action="realform.com">
	<input type="hidden" name="realform_input1" />
	<input type="text" name="realform_input2" />
	<div id="fakeform" >
		<input type="hidden" name="fakeform_input1" />
		<input type="text" name="fakeform_input2" />
		<select name="fakeform_input3">
			<option value="1">test1</option>
			<option value="2">test2</option>
		</select>
		<input data-aa-subform="#fakeform" data-aa-url="fakeform.com" class="ajax" 
			type="button" value="test fake form!" />
	</div>
</form>
````
````javascript
$(".ajax").attrAjax();
````

###data-aa-stoppropagation
Specifies whether prevent further propagation of an event of the tag using attrAjax().
- Optional
- Type: Boolean
- Default: false

#####Code example:
The event calling <code>originEvent()</code> function will be ignored by <code>data-aa-stoppropagation</code>
````javascript
function originEvent() {
	alert("called originEvnet()");
}

$(function () {
	$(".ajax").on("click", originEvent);
	$(".ajax").attrAjax();
});
````
````html
<input data-aa-stoppropagation="true" data-aa-url="ajaxtest.php" 
	class="ajax" type="button"value="test stop propagation">
````

###data-aa-datainit
Specifies whether prevent further propagation of an event of the tag using attrAjax().
- Optional
- Type: Boolean
- Default: false

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

