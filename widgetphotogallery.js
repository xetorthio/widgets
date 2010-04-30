function WidgetPhotoGallery(settings) {
    var that = this;
    var currentEntry = -6;
    var entries = [];
    var wSettings = null;
    var canvas = null;
    var galleryHolder = $('<div/>');
    var galleryGender = null;
    
    this.setGender = function(gender) {
        // If the gender is already set, we don't need to do anything
        if(gender == galleryGender) {
            return;
        }
        
        // The gender has already been set in the settings before this function
        // is called, so all we need to do is redraw
        that.redraw();
    };
    
    this.setLinkColor = function(color) {
        $('a', canvas).css('color', color);
    };
    
    
    this.goNext = function() {
        currentEntry+=6;
        if(currentEntry >= entries.length) {
            currentEntry -= entries.length;
        }
    };
    this.goBack = function() {
        currentEntry-=6;
        if(currentEntry < 0) {
            currentEntry += entries.length;
        }
    };
    
    
    this.draw = function(widgetCanvas, widgetSettings) {
        wSettings = widgetSettings;
        canvas = widgetCanvas;
        that.redraw();
    };
    
    this.redraw = function() {
        galleryHolder.empty();
        canvas.empty();
        currentEntry = -6;
        entries = [];
        galleryGender = wSettings.gender;
        
        // Add the entries
        for(var i = 0; i < settings.entries.length; i++) {
            var entrySettings = settings.entries[i];

            //bypass content not of the specified gender
            if((wSettings.gender == 'm' || wSettings.gender == 'f') &&
                    entrySettings.gender != wSettings.gender) {
              continue;
            }
            

            var img = $('<img src="'+entrySettings.photo+'"/>');
            img.width(90);

            entries.push({
                photo: img,
                link: entrySettings.link,
                gender: entrySettings.gender,
                name: entrySettings.name,
                region: entrySettings.region,
                region_link: entrySettings.region_link
            });
        }

        galleryHolder.css('width', wSettings.width);
        galleryHolder.css('height', wSettings.slide_height);
        canvas.css('height', wSettings.slide_height);
        canvas.append(galleryHolder);
    };
    
    this.ready = function() {
        for(var n=0; n<6; n++) {
            var entryIndex = (currentEntry+n) % entries.length;
            if(entries[entryIndex] && !entries[entryIndex].photo.attr('complete')) {
                return false;
            }
        }
        return true;
    };
    
    this.show = function() {
        galleryHolder.fadeOut(wSettings.effectDuration, function(){
            $(this).empty();
            for(var n=0; n<6; n++) {
                var entryIndex = (currentEntry+n) % entries.length;
                var entry = entries[entryIndex];
                
                var cell = $('<div/>');
                cell.css('float', 'left');
                cell.css('height', 70);
                cell.css('width', 90);
                cell.css('margin', '4px');
                
                // We need to create a div with position relative to hold
                // the image and link which have position absolute
                var contentHolder = $('<div/>');
                contentHolder.css('position', 'relative');
                contentHolder.css('height', 70);
                
                // The div holding the text that pops up on mouse over
                var rolloverText = $('<div class="widgetphotogallery-rollover"/>');
                rolloverText.css('position', 'absolute');
                rolloverText.css('padding', 5);
                rolloverText.css('-moz-border-radius', 5);
                rolloverText.css('-webkit-border-radius', 5);
                rolloverText.hide();
                
                function setupLink(element, text, linkUrl) {
                    if(text) {
                        element.text(text);
                    }
                    element.css('display', 'block');
                    element.css('cursor', 'pointer');
                    element.css('outline', 'none');
                    element.css('text-decoration', 'none');
                    element.css('horizontal-align', 'center');
                    
                    var color = wSettings.link_color || wSettings.color;
                    element.css('color', color);
                    var font = wSettings.link_font || wSettings.font;
                    element.css('font', font);
                    
                    // If there is no link url specified, disable click
                    if(linkUrl == null) {
                        element.click( function() { return false; } );
                    } else {
                        element.attr('href', linkUrl);
                    }
                }
                
                // The two text links in the rollover div
                var nameText = $('<a/>');
                setupLink(nameText, entry.name, entry.link);
                rolloverText.append(nameText);
                
                var regionText = $('<a/>');
                setupLink(regionText, entry.region, entry.region_link);
                rolloverText.append(regionText);
                
                // A div around the image, to crop it
                var imgHolder = $('<a/>');
                setupLink(imgHolder, null, entry.link);
                imgHolder.css('position', 'absolute');
                imgHolder.css('overflow', 'hidden');
                imgHolder.css('height', 70);
                imgHolder.css('width', 90);
                
                // The image itself
                entry.photo.css('border', 'none');
                imgHolder.append(entry.photo);
                
                // Make sure the rollover text is displayed over the image
                rolloverText.css('z-index', imgHolder.css('z-index') + 1);
                
                contentHolder.append(imgHolder);
                contentHolder.append(rolloverText);
                cell.append(contentHolder);
                
                // When the user moves his mouse over the image, show the rollover
                contentHolder.mouseover(function() {
                    var rollover = $(this).find('.widgetphotogallery-rollover');
                    rollover.css('color', wSettings.link_color || wSettings.color);
                    rollover.css('background', wSettings.background);
                    rollover.show();
                    
                    // Center the rollover.
                    // Note: this has to be done after the text is visible
                    // or the width() method will return 0
                    var nameLeft = (contentHolder.width() - rollover.width()) / 2;
                    if(rollover.css('left') == '0px') {
                        rollover.css('left', nameLeft);
                    }
                });
                contentHolder.mouseout(function(event) {
                    var rollover = $(this).find('.widgetphotogallery-rollover');
                    rollover.hide();
                });
                
                galleryHolder.append(cell);
            }
            galleryHolder.fadeIn(wSettings.effectDuration);
        });
    };
    
    this.inBounds = function(event, bounds) {
        return (bounds.left <= event.pageX && event.pageX < bounds.right &&
                bounds.top <= event.pageY && event.pageY < bounds.bottom)
    }
}
