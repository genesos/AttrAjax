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

#### The way to bind Ajax request with many tags.
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

###data-aa-disableinajax
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
<span data-aa-disableinajax="false" data-aa-url="disabletest.com">Enable in ajax</span>
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

###data-aa-subform
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
		<input data-aa-subform="#fakeform" data-aa-url="fakeform.com" class="ajax" 
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

###data-aa-datainit
Specifies whether to remove(initialize) the data that was displayed after Ajax request.
- Optional
- Type: Boolean
- Default: true

#####Code example:
````html
<div id="setBox">This text will be replaced with response text.</div>
<input data-aa-resulttarget="#setBox" data-aa-url="ajaxtest.php" type="button" value="Set new text!" />

<div id="addBox">New response text will be added under this text.</div>
<input data-aa-datainit="false" data-aa-resulttarget="#addBox" data-aa-url="ajaxtest.php" 
	type="button" value="Add new text!" />
````

###data-aa-datatype
Specifies data type of response data after Ajax request.
- Optional
- Type: String ("text", "json", "xml", "script", "html", "jsonp")
- Default: "text"

###data-aa-successtext
The meaning of this text is the success of ajax request.
When you set "success" text on this option, if response data is "success" text, the success message could be displayed.
This option has to be used with <code>data-aa-msg-success</code> option.
- Optional
- Type: String
- Default: null

#####Code example:
````html
//If the response data is "success" text, "you did it!!" text will be displayed.
<input data-aa-successtext="success" data-aa-msg-success="You did it!!" data-aa-url="ajaxtest.php" 
	type="button" value="Test success text!" />
````

###data-aa-resulttarget
Specifies the css selector of target element that the response data will be displayed in.
- Optional
- Type: String (css selector)
- Default: "text"

#####Code example:
````html
<div id="resultBox">This text will be replaced with response text.</div>
<input data-aa-resulttarget="#resultBox" type="button" value="Display response data in result box!" />
````

###data-aa-tmpltarget
###data-aa-msg-confirm
###data-aa-msg-complete
###data-aa-msg-error
###data-aa-msg-success
###data-aa-msg-fail
###data-aa-msg-empty
###data-aa-alert-error
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

