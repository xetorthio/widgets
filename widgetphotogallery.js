function WidgetPhotoGallery(settings) {
    var that = this;
    var currentEntry = -1;
    var entries = [];
    var wSettings = null;
    var canvas = null;
    var galleryHolder = $('<div/>');
    
    this.setGender = function(gender) {
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
        currentEntry = -1;
        entries = [];
        
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
            img.height(70);

            entries.push({
                photo: img,
                link: link,
                gender: gender,
                name: name
            });
        }

        galleryHolder.css('width', wSettings.width);
        galleryHolder.css('height', wSettings.slide_height);
        canvas.append(galleryHolder);
    };
    
    this.ready = function() {
        var complete = true;
        for(var n=0; n<6; n++) {
            complete = complete && entries[(currentEntry+n)%6].photo.attr('complete')
        }
        return complete;
    }
    
    this.show = function() {
        galleryHolder.animate({'opacity':0}, wSettings.effectDuration,function(){
            $(this).empty();
            for(var n=0; n<6; n++) {
                var entry = entries[(currentEntry+n)%6];
                
                var link = $('<a/>');
                link.css('outline', 'none');
                link.css('text-decoration', 'none');
                link.css('color', wSettings.color);
                wSettings.link_color && link.css('color', wSettings.link_color);
                wSettings.link_font && link.css('font', wSettings.link_font);
                // If there is no link url specified, disable click
                if(entry.link == null) {
                    link.click( function() { return false; } );
                } else {
                    link.attr('href', entry.link);
                }
                link.css('cursor', 'pointer');
                
                var imgHolder = $('<div/>');
                imgHolder.css('display', 'inline');
                imgHolder.css('height', 70);
                imgHolder.css('width', 90);
                imgHolder.css('overflow', 'hidden');
                imgHolder.css('margin', '4px');
                link.append(entry.photo);
                imgHolder.append(link);
                galleryHolder.append(imgHolder);
            }
            galleryHolder.animate({'opacity':100}, wSettings.effectDuration)
        });
    };
}
