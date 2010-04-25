function WidgetSlideshow(settings) {
    var currentSlide = -1;
    var previousSlide = -1;
    var slides = [];
    
    this.goNext = function() {
        previousSlide = currentSlide;
        currentSlide = getNextSlideIndex(true);
    };
    this.goBack = function() {
        previousSlide = currentSlide;
        currentSlide = getNextSlideIndex(false);
    };
    
    
    this.draw = function(canvas) {
    
        // Add the slides
        var slideHolder = $('<div/>');
        for(var i = 0; i < settings.slides.length; i++) {
            var slideSettings = settings.slides[i];
            var photo = slideSettings.photo;
            var link = slideSettings.link;
            var region = slideSettings.region;
            var regionUrl = slideSettings.region_link;
            var gender = slideSettings.gender;
            
            //
            // Create the slide. It will contain an image
            // and some text.
            //
            // Note: It would be nice to use a div and set the
            // display to "table-cell" but that doesn't work in IE
            // so we have to use a table instead
            //
            var slideTable = $('<table><tr><td/></tr></table>');
            var slideCell = $('td', slideTable);
            slideCell.css('height', settings.slide_height);
            slideCell.css('width', settings.width);
            slideCell.css('vertical-align', 'middle');
            slideTable.width(canvas.width());
            slideTable.hide();
            
            
            // Create the image
            var slideImg = $('<img src="'+photo+'"/>');
            slideImg.data('slide-index', i);
            slideImg.css('border', 'none');
            slideImg.css('display', 'block');
            slideImg.css('margin-left', 'auto');
            slideImg.css('margin-right', 'auto');
            slideImg.css('width', settings.image_width);
            
            // The image goes inside a link to the user's profile
            var slideLink = $('<a>');
            slideLink.css('display', 'block');
            slideLink.css('width', settings.width);
            slideLink.css('height', settings.image_max_height);
            slideLink.css('overflow', 'hidden');
            slideLink.css('outline', 'none');
            slideLink.append(slideImg);
            
            // If there is no link url specified, disable click
            if(link == null) {
                slideLink.click( function() { return false; } );
            } else {
                slideLink.attr('href', link);
            }
            
            
            // Create a link to the region that the user is from
            var regionLink = $('<a class="region-link"/>');
            regionLink.css('display', 'block');
            regionLink.css('width', settings.image_width);
            regionLink.css('margin-left', 'auto');
            regionLink.css('margin-right', 'auto');
            regionLink.css('text-align', 'center');
            regionLink.css('text-decoration', 'none');
            regionLink.css('padding', '5px 0');
            regionLink.css('outline', 'none');
            regionLink.css('color', settings.color);
            settings.link_color && regionLink.css('color', settings.link_color);
            settings.link_font && regionLink.css('font', settings.link_font);
            
            regionLink.text(region);
            
            // If there is no region link url specified, disable click
            if(regionUrl == null) {
                regionLink.click( function() { return false; } );
            } else {
                regionLink.attr('href', regionUrl);
            }
            
            
            slideCell.append(slideLink);
            slideCell.append(regionLink);
            slideHolder.append(slideTable);
            
            slides.push({
                slide: slideTable,
                img: slideImg,
                gender: gender
            });
            
            // If there are any images that can't be loaded
            slideImg.error(function() {
                removeFailedSlide($(this), 0);
            });
        }
        
        slideHolder.css('overflow', 'hidden');
        slideHolder.css('width', settings.width);
        slideHolder.css('height', settings.slide_height);
        
        canvas.append(slideHolder);
        
        
        function removeFailedSlide(img, attempt) {
            
            // Remove the corresponding slide from the widget
            for(var i = slides.length - 1; i >= 0; i--) {
                if(slides[i].img.attr('src') == img.attr('src')) {
                    slides[i].slide.remove();
                    slides.splice(i, 1);
                    if(i == 0) {
                        slideChange();
                    }
                    return;
                }
            }
    
            // The image may not have been added to the list of slides
            // when this function is called, so make three attempts.
            if(attempt < 3) {
                setTimeout(function() {
                    removeFailedSlide(attempt + 1);
                }, 100);
            }
        }
    };
    
    
    
    function getNextSlideIndex(forwards) {
        var filteredIndex = getNextSlideIndexUnfiltered(forwards);
        if(settings.gender != 'f' && settings.gender != 'm') {
            return filteredIndex;
        }
        
        for(var slideCount = 0; slideCount < slides.length; slideCount++) {
            if(slides[filteredIndex].gender == settings.gender) {
                return filteredIndex;
            }
            filteredIndex = getNextSlideIndexUnfiltered(forwards, filteredIndex);
        }
        
        return 0;
    };
    
    function getNextSlideIndexUnfiltered(forwards, startIndex) {
        if(typeof startIndex == 'undefined') {
            startIndex = currentSlide;
        }
        
        if(typeof forwards == 'undefined' || forwards === true) {
            if(startIndex >= slides.length - 1) {
                return 0;
            }
            return startIndex + 1;
        }
        
        if(startIndex <= 0) {
            return slides.length - 1;
        }
        return startIndex - 1;
    };
    
    this.ready = function() {
        return slides[currentSlide].img.attr('complete');
    }
    
    this.show = function(){
        // If the image height is smaller than the maximum height, crop
        // the image at its exact height
        // Note: The height of the image is not available until it is visible
        function adjustHeight() {
            var img = slides[currentSlide].img;
            if(img.height() < settings.image_max_height) {
                img.parent().css('height', img.height());
            }
        }
        
        
        // Fade out the previous slide and fade in the next one
        if(previousSlide >= 0 && previousSlide != currentSlide) {
            slides[previousSlide].slide.fadeOut(settings.effectDuration, function() {
                slides[currentSlide].slide.fadeIn(settings.effectDuration);
                adjustHeight();
            });
        } else {
            slides[currentSlide].slide.fadeIn(settings.effectDuration);
            adjustHeight();
        }
    };
}
