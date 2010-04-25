function WidgetPlayer(options) {
    checkRequiredParams(options);
    var defaults = getDefaults();

    var settings = $.extend({}, defaults, options);
    
    var widget = $('#'+settings.id);

    var header = $('<div class="widgetplayer-header" />');
    var canvas = $('<div class="widgetplayer-canvas"/>');
    var nav = $('<div class="widgetplayer-nav"/>');

    header.text(settings.messages.title);

    var back = $('<div class="widgetplayer-back"/>');
    back.text(settings.messages.back);
    back.click(settings.type.back);
    nav.append(back);

    var playpause = $('<img class="widgetplayer-playpause"/>');
    playpause.click(togglePlay);
    nav.append(playpause);

    var next = $('<div class="widgetplayer-next"/>');
    next.text(settings.messages.next);
    next.click(settings.type.next);
    nav.append(next);

    widget.prepend(nav);
    widget.prepend(canvas);
    widget.prepend(header);

    applyStyles();

    settings.type.draw(canvas);
    change();

    function togglePlay() {
        //TODO: do all the magic
    }

    function applyStyles() {
        //TODO: apply styles
    }

    function getDefaults() {
        //TODO: deal with defaults
        return {};
    }

    var slideChangeTimeout = null;
    
    
    function change() {
        transition(true);
        
        // If auto-play is enabled, transition to the next slide after a delay
        if(settings.auto) {
            slideChangeTimeout = setTimeout(
                function() { change(); }, settings.duration * 1000);
        }
    }
    
    function transition(forwards) {
        clearTimeout(slideChangeTimeout);
        
        // If the widget is ready
        var ready = true;
        if(forwards) {
            ready = (!settings.type.nextReady || settings.type.nextReady());
        } else {
            ready = (!settings.type.backReady || settings.type.backReady());
        }
    
        if(!ready) {
            // If the widget has not finished loading, try again in 500ms
            slideChangeTimeout = setTimeout(
                function() { change(); }, 500);
            
            return;
        }
        
        if(forwards) {
            settings.type.next();
        } else {
            settings.type.back();
        }
    }
    
    
    function checkRequiredParams(settings) {
        var requiredParams = ['id'];
        for(var i = 0; i < requiredParams.length; i++) {
            if(typeof settings[requiredParams[i]] == 'undefined') {
                throw new Error("The parameter '" + requiredParams[i] + "' is " +
                               "required for the widget player");
            }
        }
    }
}
