function WidgetNewsFeed(settings) {
    var currentEntry = -1;
    var forward = true;
    var entries = [];
    var wSettings = null;
    var feedHolder = $('<div/>');
    var feedList = $('<ul/>');
    
    this.goNext = function() {
        forward=true;
        currentEntry++;
        if(currentEntry >= entries.length) {
            currentEntry = 0;
        }
    };
    this.goBack = function() {
        forward=false;
        currentEntry--;
        if(currentEntry == -1) {
            currentEntry = entries.length-1;
        }
    };
    
    
    this.draw = function(canvas, widgetSettings) {
        wSettings = widgetSettings;
    
        // Add the entries
        feedList.css('height', wSettings.slide_height);
        feedList.css('margin-left', 0);
        feedList.css('list-style', 'none');
        var n = 0;
        for(var i = 0; i < settings.entries.length; i++) {
            var entrySettings = settings.entries[i];

            //bypass content not of the specified gender
            if((wSettings.gender == 'm' || wSettings.gender == 'f') &&
                    entrySettings.gender != wSettings.gender) {
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
            entryImg.css('width', wSettings.image_width);
            entryImg.css('overflow', 'hidden');
            
            var entryImgCrop = $('<div/>');
            entryImgCrop.css('height', wSettings.image_height);
            entryImgCrop.css('width', wSettings.image_width);
            entryImgCrop.css('overflow', 'hidden');
            entryImgCrop.css('float', 'right');
            entryImgCrop.css('margin', 3);
            entryImgCrop.append(entryImg);
            entryHolder.append(entryImgCrop);
            
            
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
      if(forward) {
            var li = $('li:first', feedList).html();
            $('li:first', feedList).animate({'margin-top': -$('li:first', feedList).height()}, wSettings.effectDuration, function(){$(this).remove();});
            last = $('<li>'+li+'</li>');
            last.css('display', 'block');
            last.css('padding', 0);
            last.css('margin-top', 3);
            last.css('margin-right', 3);
            last.css('margin-bottom', 3);
            last.css('margin-left', -37);
            last.css('border', 0);
            last.css('outline', 0);
            last.css('height', wSettings.image_height+6);
            last.css('overflow', 'hidden');
            if(currentEntry%2!=0) {
                last.css('background', wSettings.alternative_background);
            }
            feedList.append(last);
          } else {
            var li = $('li:last', feedList).html();
            last = $('<li>'+li+'</li>');
            last.css('display', 'block');
            last.css('padding', 0);
            last.css('margin-top', -(wSettings.image_height+6));
            last.css('margin-right', 3);
            last.css('margin-bottom', 3);
            last.css('margin-left', -37);
            last.css('border', 0);
            last.css('outline', 0);
            last.css('height', wSettings.image_height+6);
            if(currentEntry%2==0) {
                last.css('background', wSettings.alternative_background);
            }
            last.css('overflow', 'hidden');
            feedList.prepend(last);
            last.animate({'margin-top': 3}, wSettings.effectDuration, function(){$('li:last', feedList).remove();});
        }
    };
}
