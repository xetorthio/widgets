function WidgetPlayer(options) {
    var that = this;
    var defaults = getDefaults();
    var settings = $.extend({}, defaults, options);
    var widget = $('#'+settings.id);
    var header = $('<div class="widgetplayer-header" />');
    var canvas = $('<div class="widgetplayer-canvas"/>');
    var nav = $('<div class="widgetplayer-nav"/>');
    var footer = $('.widgetplayer-footer', widget);
    var back = $('<div class="widgetplayer-back"/>');
    var playPause = $('<img class="widgetplayer-playpause"/>');
    var next = $('<div class="widgetplayer-next"/>');
    
    function getDefaults() {

        /**
         * Default settings
         */
        return {
            // The title of the widget
            title: '',
            // Auto-play - If true, slides will transition automatically
            auto: true,
            // Duration of each slide in auto-play mode, in seconds
            duration: 3,
            // The time taken to fade-in/fade-out in milli-seconds
            effectDuration: 400,
            // The gender of the user: m (male), f (female), b (both)
            gender: 'f',
            
            
            // Width of entire widget
            width: 200,
            // Width of image itself
            image_width: 145,
            // Maximum height of image (the image will be cropped to this height)
            image_max_height: 200,
            // Height of slide - this is constant, and includes the region text
            slide_height: 245,
            
            // Background color of the slide
            background: '#000000',
            
            
            // Text font
            font: '12px arial',
            
            // Note: These all default to the general font if null
            // Font for the title text
            title_font: '16px verdana',
            // Font for the region link
            link_font: null,
            // Font for the previous/next text
            nav_font: null,
            // Font for the footer text
            footer_font: null,
            
            
            
            // Color of the border around the widget
            border_color: '#999999',
            
            // Color of the text in general
            color: '#FFFFFF',
            
            // Note: These all default to the general color
            // Color of the title text
            title_color: null,
            // Color of the region link
            link_color: null,
            // Color of the previous/next text
            nav_color: null,
            // Color of the footer text
            footer_color: null,
            
            // Indicates whether widget has a border around it
            has_border: false,
            
            // Images to use for the play and pause buttons
            images: {
                play: 'images/play.png',
                pause: 'images/pause.png'
            },
            
            // Translations
            messages: {
                previous: 'Ant.',
                next: 'Sig.'
            }
        };
    }
    
    
    var inProgress = false;
    function init() {
        checkRequiredParams(options);
        that.setTitle(settings.title);
        
        back.text(settings.messages.back);
        playPause.click(togglePlay);
        next.text(settings.messages.next);
        
        function guardedAction(action) {
            // If we're still processing the last action, ignore this action
            if(inProgress) {
                return;
            }
            inProgress = true;
            
            action();
            
            // Re-enable actions after a delay
            setTimeout(function() { inProgress = false; }, settings.effectDuration * 2);
        }
        
        back.click(function() {
            guardedAction(function() {
                setPlaying(false);
                goBack();
            });
        });
        next.click(function() {
            guardedAction(function() {
                setPlaying(false);
                goNext();
            });
        });
        
        
        // Disable selection of the back and next text
        function disableSelect(el) {
            el.attr('unselectable', 'on')
            .css('MozUserSelect', 'none')
            .bind('selectstart.ui', function() {
                return false;
            });
        }
        
        disableSelect(back);
        disableSelect(next);
        
        
        nav.append(back);
        nav.append(playPause);
        nav.append(next);
        
        widget.prepend(nav);
        widget.prepend(canvas);
        widget.prepend(header);
    
        applyStyles();
    
        settings.type.draw(canvas, settings);
        
        goNext();
    }
    
    
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
            playPause.attr('src',settings.images.pause);     
        } else {
            playPause.attr('src',settings.images.play);     
        }
    }

    function applyStyles() {
        showPlayPauseButton();
        
        // Widget in general
        that.setBackgroundColor(settings.background);
        that.setHasBorder(settings.has_border);
        that.setGeneralColor(settings.color);
        
        widget.css('width', settings.width);
        widget.css('font', settings.font);
        widget.css('-moz-border-radius', 5);
        widget.css('-webkit-border-radius', 5);
        
        
        // Header
        header.css('width', settings.width);
        header.css('text-align', 'center');
        header.css('padding', '10px 0 10px 0');
        settings.title_color && header.css('color', settings.title_color);
        settings.title_font && header.css('font', settings.title_font);
        
        // Nav
        back.css('width', 92);
        back.css('float', 'left');
        back.css('text-align', 'center');
        back.css('cursor', 'pointer');
        
        next.css('width', 92);
        next.css('float', 'right');
        next.css('text-align', 'center');
        next.css('cursor', 'pointer');
        
        playPause.css('width', 16);
        playPause.css('float', 'left');
        playPause.css('cursor', 'pointer');

        nav.css('width', settings.width);
        nav.css('float', 'left');
        nav.css('height', 26);
        nav.css('padding', '0 0 5px 0');
        settings.nav_color && nav.css('color', settings.nav_color);
        settings.nav_font && nav.css('font', settings.nav_font);
        
        // Footer
        footer.css('padding', '5px 0 10px 0');
        footer.css('width', widget.width());
        footer.css('text-align', 'center');
        footer.css('font', settings.footer_font || settings.font);
        footer.css('display', 'block');
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
    
    
    
    //
    // Public functions
    //
    
    this.goNext = goNext;
    this.redraw = settings.type.redraw;
    
    this.setTitle = function(title) {
        settings.title = title;
        header.text(title);
    };
    
    this.setGeneralColor = function(color) {
        settings.color = color;
        widget.css('color', color);
        footer.css('color', color);
        $('a', footer).css('color', color);
    };
    
    this.setBackgroundColor = function(color) {
        settings.background = color;
        widget.css('background', color);
    };
    
    this.setAlternativeColor = function(color) {
        settings.alternative_background = color;
        settings.type.setAlternativeColor && settings.type.setAlternativeColor(color);
    };
    
    this.setTitleColor = function(color) {
        settings.title_color = color;
        header.css('color', color);
    };
    
    this.setBorderColor = function(color) {
        settings.border_color = color;
        widget.css('border-color', color);
    };
    
    this.setHasBorder = function(hasBorder) {
        settings.has_border = hasBorder;
        if(hasBorder) {
            var borderCss = '3px solid ' + settings.border_color;
            widget.css('border', borderCss);
        } else {
            widget.css('border', 'none');
        }
    };
    
    this.setPlayDuration = function(duration) {
        settings.duration = duration;
    };
    
    this.setAutoPlay = function(auto) {
        setPlaying(auto);
    };
    
    this.isPlaying = function() {
        return settings.auto;
    };
    
    //
    // These functions act on the widget object itself
    //
    this.setLinkColor = function(color) {
        settings.link_color = color;
        settings.type.setLinkColor && settings.type.setLinkColor(color);
    };
    
    this.setGender = function(gender) {
        settings.gender = gender;
        settings.type.setGender && settings.type.setGender(gender);
    };
    
    
    init();
}
