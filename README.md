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

##Requirements
- jQuery
- jQuery template (optional)

##Example

#### The shortest code for Ajax request.
You don't need to add any option attributes.
````html
<form id="attrAjax">
  <input type="submit" value="ajax request!" />
</form>
````

Just call <code>attrAjax()</code> on the tag for Ajax request! That's it!!
````javascript
$("#attrAjax").attrAjax();
````
From now on the onsubmit event of the above form tag is bound with a ajax request.

#### The way to bind many tags with ajax requests.
Here is too many HTML tags for Ajax requests..
(The attrAjax function supports all tags.)
````html
<form class="attrAjax">
  <input type="submit" value="ajax request!" />
</form>
<div class="attrAjax">Ajax!</div>
<span class="attrAjax">Ajax!</span>
<input class="attrAjax" type="button" value="Ajax!" />
...
...
<input class="attrAjax" type="button" value="Ajax2!" />

````
but don't worry, just call <code>attrAjax()</code>! then all tags could be ajax requestors!
````javascript
$(".attrAjax").attrAjax();
````

##Methods
###attrAjax()
Binds the tags with ajax requests.

####Code example:
#####by attribute

````html
<input class="ajax" data-aa-url="http://ajaxurl.com" type="button" value="ajax request!" />
````
````javascript
$(".ajax").attrAjax();
````

#####by javascript
````html
<input class="ajax" type="button" value="ajax request!" />
````
````javascript
$(".ajax").attrAjax({"data-aa-url" : "http://ajaxurl.com" });
````

##Options (attribute keys)
###data-aa-url
Specifies url to send ajax request.
If you don't add this option, it will send a ajax request to current site.
- Optional
- Type: String
- Default: window.location.pathname (Current site uri, ex: "/test" of http://www.google.com/test)

###data-aa-event
Specifies event to fire ajax request.
- Optional
- Type: String
- Default: "click"

#####Code example:
````html
//The ajax request of this text tag will be fired by keyup event.
<input data-aa-event="keyup" data-aa-url="ajaxtest.php" type="text" value="Keyup Event!" />

//The ajax request of this button tag will be fired by click event by default.
<input data-aa-url="ajaxtest.php" type="button" value="Click Event!" />
````

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

###data-aa-disable-in-working
Specifies whether the tag should be disabled in ajax request.
If you don't want to send duplicated ajax requests in a ajax request, write 'true' on the value of this option.
- Optional
- Type: Boolean
- Default: true

#####Code example:
````html
//This tag will be disabled in ajax request.
<span data-aa-url="disabletest.com">Disable in ajax</span>

//This tag could be duplicately called in ajax request.
<span data-aa-disable-in-working="false" data-aa-url="disabletest.com">Enable in ajax</span>
````

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

###data-aa-param-form
Specifies css selector of the fake form that you want to use like form tag.
All input data with name attribute in the selected fake form will be sended to the server and be validated automatically.
You can use the fake forms in the real form tag.
- Optional
- Type: String (css selector of only block element, ex: "#subformid")
- Default: null

#####Code example:
````html
<form action="realform.com">
	<input type="hidden" name="realform_input1" />
	<input type="text" name="realform_input2" />
	
	//The input data in this div tag will be sended to the server.
	<div id="fakeform" >
		<input type="hidden" name="fakeform_input1" />
		<input type="text" name="fakeform_input2" />
		<select name="fakeform_input3">
			<option value="1">test1</option>
			<option value="2">test2</option>
		</select>
		<input data-aa-param-form="#fakeform" data-aa-url="fakeform.com" class="ajax" 
			type="button" value="test fake form!" />
	</div>
</form>
````
````javascript
$(".ajax").attrAjax();
````

###data-aa-stoppropagation
Specifies whether to prevent further propagation of an event of the tag using attrAjax().
- Optional
- Type: Boolean
- Default: false

#####Code example:
The <code>originEvent()</code> function will be ignored by <code>data-aa-stoppropagation</code>
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

###data-aa-onsuccess-clear-input
Specifies whether to remove(initialize) the data that was displayed after Ajax request.
- Optional
- Type: Boolean
- Default: true

#####Code example:
````html
<div id="setBox">This text will be replaced with response text.</div>
<input data-aa-resulttarget="#setBox" data-aa-url="ajaxtest.php" type="button" value="Set new text!" />

<div id="addBox">New response text will be added under this text.</div>
<input data-aa-onsuccess-clear-input="false" data-aa-resulttarget="#addBox" data-aa-url="ajaxtest.php" 
	type="button" value="Add new text!" />
````

###data-aa-datatype
Specifies data type of response data after Ajax request.
- Optional
- Type: String ("text", "json", "xml", "script", "html", "jsonp")
- Default: "text"

###data-aa-success-if-result-is
The meaning of this text is the success of ajax request.
When you set "success" text on this option, if response data is "success" text, the success message could be displayed.
This option has to be used with <code>data-aa-onsuccess-msg</code> option.
- Optional
- Type: String
- Default: null

#####Code example:
````html
//If the response data is "success" text, "you did it!!" text will be displayed.
<input data-aa-success-if-result-is="success" data-aa-onsuccess-msg="You did it!!" data-aa-url="ajaxtest.php" 
	type="button" value="Test success text!" />
````

###data-aa-resulttarget
Specifies the css selector of target element that the response data will be displayed in.
- Optional
- Type: String (css selector)
- Default: null

#####Code example:
````html
<div id="resultBox">This text will be replaced with response text.</div>
<input data-aa-resulttarget="#resultBox" type="button" value="Display response data in result box!" />
````

###data-aa-tmpltarget
Specifies the css selector of the script tag for jQuery Template.
- Optional
- Type: String (css selector)
- Default: null

#####Code example:
````html
<form ajax data-aa-url="ajaxtest.php" data-aa-datatype="json" data-aa-resulttarget="#result_target"
	data-aa-tmpltarget="#script">
	<input type="text" name="text1"/>
	<input type="text" name="text2"/>
	<input type="submit" value="test"/>
</form>
<div id="result_target">
</div>
<script id="script" type="text/x-jquery-tmpl">
	${text1}, ${text2}
</script>
````

###data-aa-confirm
Specifies the message for confirm dialog.
This option opens a confirm dialog with the message of it before Ajax Request.
- Optional
- Type: String (Message for confirm dialog)
- Default: null

###data-aa-oncomplete-msg
Specifies the message that you want to display when Ajax Request is completed.
- Optional
- Type: String
- Default: null

###data-aa-onerror-msg
Specifies the message that will be displayed when error occur on Ajax Request.
- Optional
- Type: String
- Default: "failed: unknown server error"
````html
<input data-aa-success-if-result-is="success" data-aa-onfail-msg="You didn't it" 
data-aa-onsuccess-msg="You did it!!" data-aa-url="ajaxtest.php" 
	type="button" value="Test success text!" />
````

###data-aa-onsuccess-msg
Specifies the message that will be displayed when Ajax Request is succeeded that occurs before complete event.
- Optional
- Type: String
- Default: null

###data-aa-onfail-msg
Specifies the message that will be displayed when Ajax Request is failed that occurs before complete event.
- Optional
- Type: String
- Default: "failed"

#####Code example:
````html
//If a error occur, "error occurred!" text will be displayed.
<input data-aa-onerror-msg="error occurred!" data-aa-onerror-alert="true" type="button" value="error test" />
````

###data-aa-onempty-msg
Specifies the message that will be displayed in the result target if the response data is empty.
- Optional
- Type: String
- Default: null

#####Code example:
````html
<input data-aa-onempty-msg="data is empty!!" data-aa-resulttarget="#result_target" />
<div id="result_target"></div>
````

###data-aa-onerror-alert
Specifies whether to display error message when error occur.
- Optional
- Type: Boolean
- Default: false

###data-aa-onerror-focus
Specifies whether to display the response data.
- Optional
- Type: Boolean
- Default: false

###data-aa-alerttype
Specifies type of message that will be displayed.
- Optional
- Type: String (ex: alert, value(inline tags), text(block tags))
- Default: "alert"

#####Code example:
````html
//This input opens a alert dialog with the response data.
<input data-aa-alerttype="alert" data-aa-onsuccess-alert="true" type="button" value="alert test" />

//This input appends the response data to #result_target.
<input data-aa-alerttype="text" data-aa-alerttarget="#result_target" data-aa-onsuccess-alert="true"
	type="button" value="alert test in result target"/>
<div id="result_target"></div>
````

###data-aa-alerttarget
Specifies the selector that messages will be displayed on.
- Optional
- Type: String (css selector)
- Default: null

#####Code example:
````html
//This input appends the response data to #result_target.
<input data-aa-alerttarget="#result_target" data-aa-alerttype="text"  data-aa-onsuccess-alert="true"
	type="button" value="alert test in result target"/>
<div id="result_target"></div>
````

###data-aa-onerror-focus
Specifies the selector that will focus when a error occur.
- Optional
- Type: String (css selector)
- Default: null

###data-aa-oncomplete-focus
Specifies the selector that will focus on the complete event after Ajax Request.
- Optional
- Type: String (css selector)
- Default: null

##Events

###Event flow
1. data-aa-oncustomparam
2. data-aa-onbefore
3. Ajax Request
4. data-aa-onerror, data-aa-onsuccess
5. data-aa-oncomplete

###data-aa-oncustomparam
Specifies the function name to make the custom parameters.
You have to return the query param.
- Optional
- Type: String (function name)
- Default: null

#####Code example:
````javascript
function onCustomParam($this) {
	var customParam = parseInt($this.attr("data-val")) + 1;
	var param = "custom_param=" + customParam;
	
	// The "custom_param" param will be sended to the server.
	return param;
}
````
````html
<input data-aa-oncustomparam="onCustomParam" data-val="1" type="text" value="test custom param" />
````

###data-aa-onbefore
Specifies the function name to call before Ajax Request.
- Optional
- Type: String (function name)
- Default: null

###data-aa-onerror
Specifies the function name to call when a error occur.
- Optional
- Type: String (function name)
- Default: null

###data-aa-onsuccess
Specifies the function name to call when Ajax Reuqest is succeeded.
- Optional
- Type: String (function name)
- Default: null

###data-aa-oncomplete
Specifies the function name to call when Ajax Reuqest is completed after the success event.
- Optional
- Type: String (function name)
- Default: null

##Form validation
This attributes are effective on input tags in Form tag or subform tag(fake form).

###data-aa-msg-valid
Specifies the message to display when the value of a input tag is invalid.
- Optional
- Type: String
- Default: null

###data-aa-input-name
Specifies the input name to display with default message when the value of a input tag is invalid.
- Optional
- Type: String
- Default: null

###data-aa-valid-number
The input with this option can only have numbers.
- Optional

#####Code example:
````html
<form>
	// This input can only have numbers.
	<input data-aa-valid-number type="text" />
</form>
````

###data-aa-valid-email
The input with this option can only email string.
- Optional

###data-aa-valid-letter
The input with this option can only have letters.
- Optional

###data-aa-valid-notempty
The input with this option cannot be empty.
- Optional

###data-aa-valid-regexp
Specifies the custom regular expression to validate the value of a input.
- Optional
- Type: String (Regular Expression)
- Default: null

#####Code example:
````html
<form>
	// This input can only have 0-9 numbers and a-z string.
	<input data-aa-valid_regexp="^[a-z0-9]+$" type="text" />
</form>
````
