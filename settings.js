/**
 * Javascript for settings page
 */
jQuery(document).ready(function($) {
    var widget, slideshowWidget, feedWidget, galleryWidget;
    
    // Change the title of the widget if the title text is changed in the settings
    $('#title').keyup(function() {
        widget.setTitle($(this).val());
        updateCode();
    });
    
    
    // Toggle border according to the settings checkbox
    $('#has_border').change( function() {
        var checked = $(this).attr('checked');
        widget.setHasBorder(checked);
        updateCode();
    });
    
    
    // Toggle auto-play according to the settings checkbox
    $('#auto').change( function() {
        var checked = $(this).attr('checked');
        widget.setAutoPlay(checked);
        updateCode();
    });
    
    
    // Adjust play speed according to the selected setting
    $('#duration').change( function() {
        widget.setPlayDuration($(this).val());
        updateCode();
    });
    
    
    // Adjust gender according to the selected setting
    $('#gender').change( function() {
        widget.setGender($(this).val());
        updateCode();
        widget.goNext();
    });
    
    
    // Set up the color picker
    function showPicker(selector, changeFn) {
        var currentColor = colorToHex($('> div', selector).css('backgroundColor'));
        selector.ColorPicker({
            color: currentColor,
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                var hexColor = '#'+hex;
                $('div', selector).css('backgroundColor', hexColor);
                changeFn(hexColor);
                updateCode();
            }
        });
        
        selector.ColorPickerShow();
    }
    
    function getSelectorColor(selectorId) {
        return colorToHex($('#'+selectorId).find('> div').css('backgroundColor'));
    }
    
    function colorToHex(color) {
        if (color.substr(0, 1) === '#') {
            return color;
        }
        
        color = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return parseInt(x).toString(16);
        }
        return "#" + hex(color[1]) + hex(color[2]) + hex(color[3]);
    }
    
    
    
    $('#generalColorSelector').click(function() {
        showPicker($(this), function(color) {
            widget.setGeneralColor(color);
        });
    });
    
    $('#backgroundSelector').click(function() {
        showPicker($(this), function(color) {
            widget.setBackgroundColor(color);
        });
    });
    
    $('#borderColorSelector').click(function() {
        showPicker($(this), function(color) {
            widget.setBorderColor(color);
        });
    });
    
    $('#linkColorSelector').click(function() {
        showPicker($(this), function(color) {
            widget.setLinkColor(color);
        });
    });
    
    $('#titleColorSelector').click(function() {
        showPicker($(this), function(color) {
            widget.setTitleColor(color);
        });
    });
    
    $('#alternativeBackgroundSelector').click(function() {
        showPicker($(this), function(color) {
            widget.setAlternativeColor(color);
        });
    });
    
    
    // When the user clicks on the code box, select all the text
    $('#code').focus( function() {
        $(this).select();
    });
    
    var generatedId = 'widget-'+Math.random();
    function updateCode() {
        var params = [];
        params.push(['id', generatedId]);
        params.push(['type', $('#widget_type').val()]);
        params.push(['title', $('#title').val()]);
        params.push(['auto', $('#auto').attr('checked')]);
        params.push(['duration', $('#duration').val()]);
        params.push(['gender', $('#gender').val()]);
        params.push(['has_border', $('#has_border').attr('checked')]);
        params.push(['color', getSelectorColor('generalColorSelector')]);
        params.push(['background_color', getSelectorColor('backgroundSelector')]);
        params.push(['alternative_color', getSelectorColor('alternativeBackgroundSelector')]);
        params.push(['border_color', getSelectorColor('borderColorSelector')]);
        params.push(['link_color', getSelectorColor('linkColorSelector')]);
        params.push(['title_color', getSelectorColor('titleColorSelector')]);
        
        var escaped = [];
        for(var i = 0; i < params.length; i++) {
            var name = params[i][0];
            var value = encodeURIComponent(params[i][1]);
            escaped.push(name + '=' + value);
        }
        params = escaped.join('&');
        
        var embedCode  = '<script type="text/javascript" language="Javascript" charset="utf-8"';
        embedCode     += ' src="http://amistarium.com/widget.php?'+params+'">';
        embedCode     += '</script>';
        embedCode     += '<div id="'+generatedId+'">';
        embedCode     += ' <div class="widgetplayer-footer">';
        embedCode     += '  <a href="http://www.amistarium.com">amistarium.com</a>';
        embedCode     += ' </div>';
        embedCode     += '</div>';
        
        $('#code').val(embedCode);
    }
    
    // When the user changes the widget type, change the displayed widget
    $('#widget_type').change(function() {
        setSelectedWidget();
        widget.redraw();
        showSelectedWidget();
    });
    
    function showSelectedWidget() {
        $('#widgetSlideshow').hide();
        $('#widgetNewsFeed').hide();
        $('#widgetGallery').hide();
        
        $('#alternativeBackgroundSelectorBox').hide();
        
        var widgetType = $('#widget_type').val();
        switch(widgetType) {
            case 'slide':
                $('#widgetSlideshow').fadeIn();
            break;
            case 'feed':
                $('#widgetNewsFeed').fadeIn();
                $('#alternativeBackgroundSelectorBox').show();
            break;
            case 'gallery':
                $('#widgetGallery').fadeIn();
            break;
        }
        
        setAllSettings();
    }

    function setSelectedWidget() {
        var widgetType = $('#widget_type').val();
        switch(widgetType) {
            case 'slide':
                widget = slideShowWidget;
            break;
            case 'feed':
                widget = feedWidget;
            break;
            case 'gallery':
                widget = galleryWidget;
            break;
        }
    }
    
    function setAllSettings() {
        if(!widget) {
            return;
        }
        widget.setTitle($('#title').val());
        widget.setHasBorder($('#has_border').attr('checked'));
        widget.setAutoPlay($('#auto').attr('checked'));
        widget.setPlayDuration($('#duration').val());
        widget.setGender($('#gender').val());
        widget.setGeneralColor(getSelectorColor('generalColorSelector'));
        widget.setBackgroundColor(getSelectorColor('backgroundSelector'));
        widget.setBorderColor(getSelectorColor('borderColorSelector'));
        widget.setLinkColor(getSelectorColor('linkColorSelector'));
        widget.setTitleColor(getSelectorColor('titleColorSelector'));
    }
    
    
    
    // The first widget must be visible when it is created, otherwise some
    // of the image calculations won't work (because they are invalid if the
    // image is hidden)
    showSelectedWidget();
    
    
    slideShowWidget = new WidgetPlayer({
        id: 'widgetSlideshow',
        title: $('#title').val(),
        auto: $('#auto').attr('checked'),
        duration: $('#duration').val(),
        gender: $('#gender').val(),
        has_border: $('#has_border').attr('checked'),
        color: getSelectorColor('generalColorSelector'),
        border_color: getSelectorColor('borderColorSelector'),
        background: getSelectorColor('backgroundSelector'),
        link_color: getSelectorColor('linkColorSelector'),
        title_color: getSelectorColor('titleColorSelector'),
        messages: {
            back: '< Prev.',
            next: 'Next. >'
        },
        images: {
            play: 'images/play.png',
            pause: 'images/pause.png'
        },
        type: new WidgetSlideshow({
            slides: [
               {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/4/13/mdn-1138905461095299.jpg',
                   link: null,
                   region: 'Buenos Aires, Argentina',
                   region_link: null,
                   gender: 'f'
               }, {
                   photo: 'http://static04.amistarium.com/img-es-es-/2010/4/22/mdn-1897181551102475.jpg',
                   link: null,
                   region: 'London, England',
                   region_link: null,
                   gender: 'm'
               }, {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/4/13/mdn-1137618641095294.jpg',
                   link: null,
                   region: 'Seattle, United States',
                   region_link: null,
                   gender: 'f'
               }, {
                   photo: 'http://static05.amistarium.com/img-es-es-/2010/4/17/mdn-1516497091098796.jpg',
                   link: null,
                   region: 'Madrid, España',
                   region_link: null,
                   gender: 'f'
               }, {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/4/28/mdn-2450736691107749.jpg',
                   link: null,
                   region: 'Bilbao, Portugal',
                   region_link: null,
                   gender: 'm'
               }, {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/1/7/mdn-4196380081012921.jpg',
                   link: null,
                   region: 'Perth, Australia',
                   region_link: null,
                   gender: 'm'
               }
           ]
        })
    });
    
    feedWidget = new WidgetPlayer({
        id: 'widgetNewsFeed',
        title: $('#title').val(),
        auto: $('#auto').attr('checked'),
        duration: $('#duration').val(),
        gender: $('#gender').val(),
        has_border: $('#has_border').attr('checked'),
        color: getSelectorColor('generalColorSelector'),
        border_color: getSelectorColor('borderColorSelector'),
        background: getSelectorColor('backgroundSelector'),
        link_color: getSelectorColor('linkColorSelector'),
        title_color: getSelectorColor('titleColorSelector'),
        messages: {
            back: '< Prev.',
            next: 'Next. >'
        },
        images: {
            play: 'images/play.png',
            pause: 'images/pause.png'
        },
        image_height: 50,
        image_width: 60,
        alternative_background: '#333333',
        type: new WidgetNewsFeed({
            entries: [
               {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/4/13/pqn-1138905461095299.jpg',
                   link: null,
                   region: 'Buenos Aires, Argentina',
                   region_link: null,
                   gender: 'f',
                   name: 'Juana'
               }, {
                   photo: 'http://static04.amistarium.com/img-es-es-/2010/4/22/pqn-1897181551102475.jpg',
                   link: null,
                   region: 'London, England',
                   region_link: null,
                   gender: 'm',
                   name: 'John'
               }, {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/4/13/pqn-1137618641095294.jpg',
                   link: null,
                   region: 'Seattle, United States',
                   region_link: null,
                   gender: 'f',
                   name: 'Francisca'
               }, {
                   photo: 'http://static03.amistarium.com/img-es-es-/2010/4/28/pqn-2408352641107401.jpg',
                   link: null,
                   region: 'Madrid, España',
                   region_link: null,
                   gender: 'f',
                   name: 'Luciana'
               }, {
                   photo: 'http://static04.amistarium.com/img-es-es-/2010/4/22/pqn-1890168181102365.jpg',
                   link: null,
                   region: 'Bilbao, Portugal',
                   region_link: null,
                   gender: 'm',
                   name: 'Eduardo'
               }, {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/1/7/pqn-4196380081012921.jpg',
                   link: null,
                   region: 'Perth, Australia',
                   region_link: null,
                   gender: 'm',
                   name: 'Andrew'
               }, {
                   photo: 'http://static04.amistarium.com/img-es-es-/2010/4/28/pqn-2411782731107456.jpg',
                   link: null,
                   region: 'Madrid, España',
                   region_link: null,
                   gender: 'f',
                   name: 'Laura'
               }, {
                   photo: 'http://static05.amistarium.com/img-es-es-/2010/4/28/pqn-2448025811107741.jpg',
                   link: null,
                   region: 'Bilbao, Portugal',
                   region_link: null,
                   gender: 'm',
                   name: 'Federico'
               }, {
                   photo: 'http://static02.amistarium.com/img-es-es-/2010/4/28/pqn-2428477741107652.jpg',
                   link: null,
                   region: 'Perth, Australia',
                   region_link: null,
                   gender: 'f',
                   name: 'Gemma'
               }, {
                   photo: 'http://static05.amistarium.com/img-es-es-/2010/4/28/pqn-2417619291107537.jpg',
                   link: null,
                   region: 'Madrid, España',
                   region_link: null,
                   gender: 'f',
                   name: 'Maria'
               }, {
                   photo: 'http://static01.amistarium.com/img-es-es-/2010/4/28/pqn-244741321107738.jpg',
                   link: null,
                   region: 'Bilbao, Portugal',
                   region_link: null,
                   gender: 'm',
                   name: 'Mario'
               }, {
                   photo: 'http://static05.amistarium.com/img-es-es-/2010/4/28/pqn-2427440831107638.jpg',
                   link: null,
                   region: 'Perth, Australia',
                   region_link: null,
                   gender: 'f',
                   name: 'Sharon'
               }
           ]
        })
    });

    
    
    setSelectedWidget();
    updateCode();
});
