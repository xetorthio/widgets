function WidgetNewsFeed(settings) {
    var currentEntry = -1;
    var entries = [];
    var feedHolder = $('<div/>');
    var wSettings = null;
    
    this.goNext = function() {
      currentEntry = (currentEntry+1) % settings.entries.length;
    };
    this.goBack = function() {
        currentEntry = Math.abs((currentEntry-1) % settings.entries.length);
    };
    
    
    this.draw = function(canvas, widgetSettings) {
        wSettings = widgetSettings;
    
        // Add the entries
        var feedList = $('<ul/>');
        feedList.css('height', wSettings.slide_height);
        feedList.css('margin-left', 0);
        feedList.css('list-style', 'none');
        var n = 0;
        for(var i = 0; i < settings.entries.length; i++) {
            var entrySettings = settings.entries[i];

            //bypass content not of the specified gender
            if(entrySettings.gender != wSettings.gender) {
              continue;
            }
            n++;

            var photo = entrySettings.photo;
            var link = entrySettings.link;
            var region = entrySettings.region;
            var regionUrl = entrySettings.region_link;
            var gender = entrySettings.gender;
            var name = entrySettings.name;
            

            var entryHolder = $('<li/>');
            entryHolder.css('display', 'block');
            entryHolder.css('padding', 0);
            entryHolder.css('margin-top', 3);
            entryHolder.css('margin-right', 3);
            entryHolder.css('margin-bottom', 3);
            entryHolder.css('margin-left', -37);
            entryHolder.css('border', 0);
            entryHolder.css('outline', 0);
            entryHolder.css('height', wSettings.image_height+6);
            entryHolder.css('overflow', 'hidden');
            if(n%2==0) {
              entryHolder.css('background', wSettings.alternative_background);
            }
          
            // Create the image
            var entryImg = $('<img src="'+photo+'"/>');
            entryImg.data('slide-index', i);
            entryImg.css('border', 'none');
            entryImg.css('display', 'block');
            entryImg.css('float', 'right');
            entryImg.css('margin', 3);
            entryImg.css('height', wSettings.image_height);
            entryImg.css('width', wSettings.image_width);
            entryImg.css('overflow', 'hidden');
            entryHolder.append(entryImg);
            
            // Create the name that link to the user's profile
            var nameLink = $('<a>');
            nameLink.css('display', 'block');
            nameLink.css('outline', 'none');
            nameLink.css('text-decoration', 'none');
            nameLink.css('color', wSettings.color);
            wSettings.link_color && nameLink.css('color', wSettings.link_color);
            wSettings.link_font && nameLink.css('font', wSettings.link_font);
            nameLink.text(name);
            // If there is no link url specified, disable click
            if(link == null) {
                nameLink.click( function() { return false; } );
            } else {
                nameLink.attr('href', link);
            }
            nameLink.css('cursor', 'pointer');
            entryHolder.append(nameLink)


            // Create a link to the region that the user is from
            var regionLink = $('<a class="region-link"/>');
            regionLink.css('display', 'block');
            regionLink.css('margin-left', 'auto');
            regionLink.css('margin-right', 'auto');
            regionLink.css('text-decoration', 'none');
            regionLink.css('padding', '5px 0');
            regionLink.css('outline', 'none');
            regionLink.css('color', wSettings.color);
            regionLink.css('cursor', 'pointer');
            wSettings.link_color && regionLink.css('color', wSettings.link_color);
            wSettings.link_font && regionLink.css('font', wSettings.link_font);
            regionLink.text(region);
            // If there is no region link url specified, disable click
            if(regionUrl == null) {
                regionLink.click( function() { return false; } );
            } else {
                regionLink.attr('href', regionUrl);
            }
            entryHolder.append(regionLink);

            feedList.append(entryHolder);
            
            entries.push({
                entry: entryHolder,
                img: entryImg,
                gender: gender
            });
        }

        feedHolder.css('overflow', 'hidden');
        feedHolder.css('width', wSettings.width);
        feedHolder.css('height', wSettings.slide_height);
        feedHolder.append(feedList);
        canvas.append(feedHolder);
    };
    
    this.ready = function() {
        return entries[currentEntry].img.attr('complete');
    }
    
    this.show = function(){
        feedHolder.scrollTo(entries[currentEntry].entry, wSettings.effectDuration, {axis: 'y', margin:true});
    };
}
