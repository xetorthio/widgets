function WidgetNewsFeed(settings) {
    var that = this;
    var currentEntry = -1;
    var forward = true;
    var entries = [];
    var wSettings = null;
    var canvas = null;
    var feedHolder = $('<div/>');
    var feedList = $('<ul/>');
    var feedGender = null;

    this.setGender = function(gender) {
        // If the gender is already set, we don't need to do anything
        if(gender == feedGender) {
            return;
        }
        
        // The gender has already been set in the settings before this function
        // is called, so all we need to do is redraw
        that.redraw();
    };

    this.setAlternativeColor = function(color) {
        drawAlternateBackground('none', color);
    };

    this.goNext = function() {
        forward = true;
        currentEntry++;
        if (currentEntry >= entries.length) {
            currentEntry = 0;
        }
    };
    this.goBack = function() {
        forward = false;
        currentEntry--;
        if (currentEntry == -1) {
            currentEntry = entries.length - 1;
        }
    };

    this.draw = function(widgetCanvas, widgetSettings) {
        wSettings = widgetSettings;
        canvas = widgetCanvas;
        that.redraw();
    };

    this.redraw = function() {
        feedHolder.empty();
        feedList.empty();
        canvas.empty();
        currentEntry = -1;
        entries = [];
        feedGender = wSettings.gender;

        // Add the entries
        feedList.css('height', wSettings.slide_height);
        feedList.css('margin-left', 0);
        feedList.css('padding-left', 0);
        feedList.css('list-style', 'none');
        var n = 0;
        for (var i = 0; i < settings.entries.length; i++) {
            var entrySettings = settings.entries[i];

            // bypass content not of the specified gender
            if ((wSettings.gender == 'm' || wSettings.gender == 'f')
                    && entrySettings.gender != wSettings.gender) {
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
            entryHolder.css('margin', 3);
            entryHolder.css('border', 0);
            entryHolder.css('outline', 0);
            entryHolder.css('height', wSettings.image_height + 6);
            entryHolder.css('overflow', 'hidden');
            if (n % 2 == 0) {
                entryHolder.css('background', wSettings.alternative_background);
            }

            // Create the image
            var entryImg = $('<img src="' + photo + '"/>');
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
            nameLink.css('margin-top', '5px');
            nameLink.css('margin-left', '5px');
            nameLink.css('outline', 'none');
            nameLink.css('text-decoration', 'none');
            nameLink.css('color', wSettings.color);
            wSettings.link_color && nameLink.css('color', wSettings.link_color);
            wSettings.link_font && nameLink.css('font', wSettings.link_font);
            nameLink.text(name);
            // If there is no link url specified, disable click
            if (link == null) {
                nameLink.click(function() { return false; });
            } else {
                nameLink.attr('href', link);
            }
            nameLink.css('cursor', 'pointer');
            entryHolder.append(nameLink);

            // Create a link to the region that the user is from
            var regionLink = $('<a class="region-link"/>');
            regionLink.css('display', 'block');
            regionLink.css('margin-left', 'auto');
            regionLink.css('margin-right', 'auto');
            regionLink.css('text-decoration', 'none');
            regionLink.css('padding', '5px 0');
            regionLink.css('margin-left', '5px');
            regionLink.css('outline', 'none');
            regionLink.css('color', wSettings.color);
            regionLink.css('cursor', 'pointer');
            wSettings.link_color
                    && regionLink.css('color', wSettings.link_color);
            wSettings.link_font && regionLink.css('font', wSettings.link_font);
            regionLink.text(region);
            // If there is no region link url specified, disable click
            if (regionUrl == null) {
                regionLink.click(function() { return false; });
            } else {
                regionLink.attr('href', regionUrl);
            }
            entryHolder.append(regionLink);

            feedList.append(entryHolder);

            entries.push( {
                entry : entryHolder,
                img : entryImg,
                gender : gender
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
    };

    this.show = function() {
        if (forward) {
            var li = $('li:first', feedList);
            var marginTop = li.css('margin-top');
            li.animate( {
                'margin-top' : -li.height()
            }, wSettings.effectDuration, function() {
                li.hide();
                feedList.append(li);
                drawAlternateBackground();
                li.css('margin-top', marginTop);
                li.show();
            });
        } else {
            var li = $('li:last', feedList);
            var marginTop = li.css('margin-top');
            li.hide();
            li.css('margin-top', -li.height());
            feedList.prepend(li);
            drawAlternateBackground();
            li.show();
            li.animate( {
                'margin-top' : marginTop
            }, wSettings.effectDuration);
        }
    };

    /**
     * Paints the background alternating colours
     */
    function drawAlternateBackground(even, odd) {
        // Even and odd default to what's already in the ul element
        if (typeof even == 'undefined' && typeof odd == 'undefined') {
            var even = feedList.find('li:eq(1)').css('background');
            var odd = feedList.find('li:eq(2)').css('background');
        }

        var i = 0;
        feedList.find('li').each(function() {
            if (i % 2 == 0) {
                $(this).css('background', odd);
            } else {
                $(this).css('background', even);
            }
            i++;
        });
    }
}
