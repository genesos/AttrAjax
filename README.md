#jQuery Attrbute Ajax Plugin

##Overview
The jQuery Attribute Ajax Plugin saves your time to write lots of Ajax codes and various additional functions needed in Ajax. The main idea comes from using HTML attributes. If your website needs many ajax requests, just call the main method "attrAjax()" with few Ajax attributes.

---

##Example

Just add <code>data-aa-url</code> attribute in a tag to do ajax request.
````html
<form id="attrAjax" data-aa-url="http://ajaxurl.com">
  <input type="submit" value="ajax request!" />
</form>
````

and call <code>attrAjax()</code> in a javascript. That's it!
````javascript
$("#attrAjax").attrAjax();
````

Here is lots of HTML tags with <code>data-aa-url</code> attribute for Ajax requests..
````html
<form class="attrAjax" data-aa-url="http://ajaxurl.com">
  <input type="submit" value="ajax request!" />
</form>
<div class="attrAjax" data-aa-url="http://ajaxurl.com">Ajax!</div>
<span class="attrAjax" data-aa-url="http://ajaxurl.com">Ajax!</span>
<input class="attrAjax" type="button" value="Ajax!" data-aa-url="http://ajaxurl.com" />
````

but just call <code>attrAjax()</code>
````javascript
$(".attrAjax").attrAjax();
````

---
