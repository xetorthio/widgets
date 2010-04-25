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
    back.click(function() {
        setPlaying(false);
        goBack();
    });
    nav.append(back);

    var playpause = $('<img class="widgetplayer-playpause"/>');
    playpause.click(togglePlay);
    nav.append(playpause);

    var next = $('<div class="widgetplayer-next"/>');
    next.text(settings.messages.next);
    next.click(function() {
        setPlaying(false);
        goNext();
    });
    nav.append(next);

    widget.prepend(nav);
    widget.prepend(canvas);
    widget.prepend(header);

    applyStyles();

    settings.type.draw(canvas);
    
    goNext();

    function togglePlay() {
        setPlaying(!settings.auto);
    }
    
    function setPlaying(playing) {
        settings.auto = playing;
        if(settings.auto) {
            goNext();
        }
        run();
        showPlayPauseButton();
    }

    function showPlayPauseButton() {
        if(settings.auto) {
            playpause.attr('src',settings.images.pause);     
        } else {
            playpause.attr('src',settings.images.play);     
        }
    }

    function applyStyles() {
        showPlayPauseButton();

        //TODO: apply styles
    }

    function getDefaults() {
        //TODO: deal with defaults
        return {};
    }

    var slideChangeTimeout = null;
    
    function showWhenReady() {
        clearTimeout(slideChangeTimeout);
        if(settings.type.ready()) {
            settings.type.show();
            run();
            return;
        }
        // If the widget has not finished loading, try again in 500ms
        slideChangeTimeout = setTimeout(
            function() { showWhenReady(); }, 500);
    }

    function goBack() {
        settings.type.goBack();
        showWhenReady();
    }
    
    function goNext() {
        settings.type.goNext();
        showWhenReady();
    }

    function run() {
        clearTimeout(slideChangeTimeout);
        if(settings.auto) {
            slideChangeTimeout = setTimeout(
                function() { goNext(); }, settings.duration * 1000
            );
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
