/**
 * Attempts to load jQuery dynamically.
 * When it has loaded, calls each function that has been added to the
 * onJQueryLoad array in turn.
 * This array should be created in each file that needs to run something when
 * jQuery loads, like this:
 * 
 * var onJQueryLoad = onJQueryLoad || [];
 * onJQueryLoad.push(function() {
 *     // Do something...
 *     alert('Initializing widget');
 * });
 *
 */
(function loadJQuery() {
    var jQueryUrl = 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js';
    
    function alreadyLoadingJQuery() {
        var scripts = document.getElementsByTagName('script');
        for(var i = 0; i < scripts.length; i++) {
            if(scripts[i].getAttribute('src') == jQueryUrl) {
                return true;
            }
        }
        
        return false;
    }
    
    function loadScript() {
        var script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', jQueryUrl);
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    
    function testJQueryLoad() {
        if( typeof jQuery == 'undefined') {
            setTimeout(testJQueryLoad, 500);
            return;
        }
        
        jQueryLoaded();
    }
    
    var numTimesLoadedRun = 0;
    function jQueryLoaded() {
        if(typeof onJQueryLoad != 'undefined') {
            while(onJQueryLoad.length > 0) {
                var loadFunction = onJQueryLoad[0];
                onJQueryLoad.splice(0, 1);
                loadFunction();
            }
        }
        
        if(numTimesLoadedRun < 10) {
            setTimeout(jQueryLoaded, 1000);
        }
        numTimesLoadedRun++;
    }
    
    
    if( ! alreadyLoadingJQuery()) {
        loadScript();
        setTimeout(testJQueryLoad, 1000);
    }
})();

