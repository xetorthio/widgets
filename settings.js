/**
 * Javascript for settings page
 */
jQuery(document).ready(function($) {
    var widgetBoxId = 'widget-settings';
    var widgetBox = $('#'+widgetBoxId);
    var widgetFooterId = 'widget-settings-footer';
    
    
    var widget = new WidgetPlayer({
        id: widgetBoxId,
        title: $('#title').val(),
        auto: $('#auto').attr('checked'),
        duration: $('#duration').val(),
        gender: $('#gender').val(),
        has_border: $('#has_border').attr('checked'),
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
                   photo: 'http://static05.amistarium.com/img-es-es-/2010/4/13/mdn-1128601131095215.jpg',
                   link: null,
                   region: 'Madrid, España',
                   region_link: null,
                   gender: 'f'
               }, {
                   photo: 'http://static04.amistarium.com/img-es-es-/2010/4/22/mdn-1890168181102365.jpg',
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
    
    
    // Change the title of the widget if the title text is changed in the settings
    $('#title').keyup(function() {
        widget.setTitle($(this).val());
    });
    
    
    // Toggle border according to the settings checkbox
    $('#has_border').change( function() {
        var checked = $(this).attr('checked');
        widget.setHasBorder(checked);
    });
    
    
    // Toggle auto-play according to the settings checkbox
    $('#auto').change( function() {
        var checked = $(this).attr('checked');
        widget.setAutoPlay(checked);
    });
    
    
    // Adjust play speed according to the selected setting
    $('#duration').change( function() {
        widget.setPlayDuration($(this).val());
    });
    
    
    // Adjust gender according to the selected setting
    $('#gender').change( function() {
        widget.setGender($(this).val());
    });
    
    
    // Set up the color picker
    function showPicker(selector, changeFn) {
        setSelected(selector.parents('.section'), false);
        setSelected(selector.parents('.field'), true);
        
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
            }
        });
        
        selector.ColorPickerShow();
    }
    
    function setSelected(ancestorDiv, selected) {
        var selectorDiv = $('.colorSelector', ancestorDiv);
        var selectorDivChild = $('> div', selectorDiv);
        
        var imgUnselected = 'url("images/colorPicker.png")';
        var imgSelected = 'url("images/colorPickerSelected.png")';
        var img = selected ? imgSelected : imgUnselected;
        
        selectorDiv.css('backgroundImage', img);
        selectorDivChild.css('backgroundImage', img);
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
    
    
    // When the user clicks on the code box, select all the text
    $('#code').focus( function() {
        $(this).select();
    });
    
    
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
});

