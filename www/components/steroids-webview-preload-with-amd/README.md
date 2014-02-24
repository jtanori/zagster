steroids-webview-preload
========================

A helper function for Appgyver Steroids which safely preloads WebViews. The global steroids object is extended to include this new function.

To use:
* Source preload.js in your HTML AFTER steroids.js
* Preload a webview!

<pre>
var myView = new steroids.views.WebView('myview.html');
steroids.preload(myView, 'uniqueId', function() {
  // Success! Now I can use 'myView'
}, function() {
  // There was an error, but it was NOT because the webview was already pre-loaded!
});
</pre>
