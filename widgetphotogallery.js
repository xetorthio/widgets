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
    }
    
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
            

            var photo = entrySettings.photo;
            var link = entrySettings.link;
            var gender = entrySettings.gender;
            var name = entrySettings.name;
            
            var img = $('<img src="'+photo+'"/>');
            img.width(90);

            entries.push({
                photo: img,
                link: link,
                gender: gender,
                name: name
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
    }
    
    this.show = function() {
        galleryHolder.fadeOut(wSettings.effectDuration, function(){
            $(this).empty();
            for(var n=0; n<6; n++) {
                var entryIndex = (currentEntry+n) % entries.length;
                var entry = entries[entryIndex];
                
                var link = $('<a/>');
                link.css('display', 'block');
                link.css('float', 'left');
                link.css('height', 70);
                link.css('width', 90);
                link.css('outline', 'none');
                link.css('text-decoration', 'none');
                link.css('color', wSettings.color);
                link.css('margin', '4px');
                wSettings.link_color && link.css('color', wSettings.link_color);
                wSettings.link_font && link.css('font', wSettings.link_font);
                // If there is no link url specified, disable click
                if(entry.link == null) {
                    link.click( function() { return false; } );
                } else {
                    link.attr('href', entry.link);
                }
                link.css('cursor', 'pointer');
                
                var contentHolder = $('<div/>')
                contentHolder.css('position', 'relative');
                contentHolder.css('height', 70);
                
                var nameText = $('<div class="widgetphotogallery-name"/>');
                nameText.text(entry.name);
                nameText.css('position', 'absolute');
                nameText.css('padding', 5);
                nameText.css('-moz-border-radius', 5);
                nameText.css('-webkit-border-radius', 5);
                nameText.hide();
                
                var imgHolder = $('<div/>');
                imgHolder.css('position', 'absolute');
                imgHolder.css('overflow', 'hidden');
                imgHolder.css('height', 70);
                imgHolder.css('width', 90);
                
                entry.photo.css('border', 'none');
                imgHolder.append(entry.photo);
                
                nameText.css('z-index', imgHolder.css('z-index') + 1);
                contentHolder.append(imgHolder);
                contentHolder.append(nameText);
                link.append(contentHolder);
                
                // When the user moves his mouse over the image, show the text
                contentHolder.mouseover(function() {
                    var nameDiv = $(this).find('.widgetphotogallery-name');
                    nameDiv.css('color', wSettings.link_color || wSettings.color);
                    nameDiv.css('background', wSettings.background);
                    nameDiv.stop(true, true).fadeIn();
                    
                    // Center the name text.
                    // Note: this has to be done after the name text is visible
                    // or the width() method will return 0
                    var nameLeft = (contentHolder.width() - nameDiv.width()) / 2;
                    nameDiv.css('left', nameLeft);
                });
                contentHolder.mouseout(function() {
                    var nameDiv = $(this).find('.widgetphotogallery-name');
                    nameDiv.stop(true, true).fadeOut();
                });
                
                galleryHolder.append(link);
            }
            galleryHolder.fadeIn(wSettings.effectDuration);
        });
    };
}
