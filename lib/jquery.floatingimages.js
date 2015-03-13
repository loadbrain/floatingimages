(function($){
    $.fn.extend({
        floatingimages: function(options){
            var defaults = {
                imgObject: {},
                containerWidth: '300px',
                containerHeight: '288px',
                timer: 3000,
                smallImageWidth: 150,
                smallImageHeight: 95,
                realImageWidth: "300px",
                realImageHeight: "195px",
                clondedImageBorder: '2px solid yellow',
                columnsPerRow: 2
            };
            
            options = $.extend({}, defaults, options);
            var currentArray = [];
	    var imagesLoaded = false;
            
            return this.each(function(){
                //Create references to the options 
                var imgObject = options.imgObject;
                var imgString = "";
                var containerWidth = options.containerWidth;
                var containerHeight = options.containerHeight;
                var timer = options.timer;
                var smallImageWidth = options.smallImageWidth;
                var smallImageHeight = options.smallImageHeight;
                var realImageWidth = options.realImageWidth;
                var realImageHeight = options.realImageHeight;
                var clondedImageBorder = options.clondedImageBorder;
                var columnsPerRow = options.columnsPerRow;
                var randomInt, i;

               /**
                 * Adds images to the container
                 */
                function addImages(){
                    var j = 0;
                    for (i = 0; i < imgObject.length; i++) {
                        imgString += '<img src="' + imgObject[i].imgName + '" id="image' + i + '" width="' + (parseInt(containerWidth, 10) / columnsPerRow) + '" height="' + Math.floor(parseInt(containerHeight, 10) / (imgObject.length / columnsPerRow)) + '" />';
                        $('#image' + i).css({
                            padding: "0px",
                            margin: "0px",
                            border: "0px"
                        });
                        j++;
                        
                        if (j % columnsPerRow === 0) {
                            $('.images').css({
                                width: containerWidth,
                                height: Math.floor(parseInt(containerHeight, 10) / (imgObject.length / columnsPerRow)) + 'px'
                            });
                            $('#container').append('<div class="images">' + imgString + '</div>');
                            imgString = "";
                        }
                    }
                }//add images
				
				
		addImages();
		
		/**
		* Function to preload images and start animation not before all images are loadad
		*/
		preLoadImages = setInterval(function() {
		var bImgLoaded = true;
		var images = $("#container img");
		for (var i = 0; i < images.length; i++) {
			var img = images[i];
		        if (img.complete == false)
		        bImgLoaded = false;
		}
		
		if (bImgLoaded) {
			$("#container").everyTime(timer, "timedShow", function(i){
				makeShow(i);					
			});
		         clearInterval(preLoadImages);
		      }
		   }, 1000);
   
			
                
                $('#container').css({
                    width: containerWidth,
                    height: containerHeight
                });
                
                $('#viewPortPhoto').css({
                    width: parseInt(realImageWidth, 10) - 2 * (parseInt(clondedImageBorder, 10)) + 'px',
                    height: realImageHeight,
                    top: Math.floor((parseInt(containerHeight, 10) / 2) - (parseInt(realImageHeight, 10) / 2)) + "px",
                    left: Math.floor((parseInt(containerWidth, 10) / 2) - (parseInt(realImageWidth, 10) / 2)) + "px"
                });
                
                $('.hint').css({
                    width: parseInt(realImageWidth, 10) - 2 * (parseInt(clondedImageBorder, 10)) + 'px',
                    opacity: 0.5
                });
                
                
 
                
                /**
                 * animation function
                 * @param int i
                 */
                function makeShow(i){
                
                    if (i % 2 === 0) {
                        $('.hint').css({
                            display: "none"
                        });
                        randomInt = Math.round(Math.random() * 4);
                        switch (randomInt) {
                            case 0:
                                $('#viewPortPhoto img').effect("explode", {
                                    pieces: 25
                                }, 1500);
                                break;
                                
                            case 1:
                                $('#viewPortPhoto img').effect("drop", {
                                    direction: "up"
                                }, 1500);
                                break;
                                
                            case 2:
                                $('#viewPortPhoto img').effect("fold", {}, 1500);
                                break;
                                
                            case 3:
                                $('#viewPortPhoto img').effect("puff", {}, 1500);
                                break;
                                
                            case 4:
                                $('#viewPortPhoto img').effect("clip", {
                                    direction: "vertical"
                                }, 1000);
                                break;
                                
                            default:
                                $('#viewPortPhoto img').effect("clip", {
                                    direction: "vertical"
                                }, 1000);
                                break;
                        }
                        
                        return;
                    }
                    randomInt = getRandomInt();
                    var currentImage = $("#image" + randomInt);
                    
                    var clondedImage = currentImage.clone();
                    var imgName = currentImage.attr('src');
                    
                    
                    currentArray[currentArray.length] = {
                        imgName: $(currentImage).attr('id')
                    };
                    clondedImage.css({
                        display: "none"
                    });
                    $('#viewPortPhoto').append(clondedImage);
                    
                    if (imgObject[randomInt].imgLink !== "") {
                        clondedImage.css('cursor', 'pointer');
                        clondedImage.wrap("<a href='" + imgObject[randomInt].imgLink + "' target='_blank'></a>");
                    }
                    
                    $('.transferring').css('border', clondedImageBorder);
                    $('.ui-effects-transfer').css('border', clondedImageBorder);
                    clondedImage.css({
                        'border': clondedImageBorder,
                        "background-image": "url('" + imgName + "')"
                    });
                    currentImage.effect("transfer", {
                        className: "transferring",
                        to: "div#viewPortPhoto"
                    }, 1000, function showImage(){
                    
                        clondedImage.css({
                            display: "block",
                            width: parseInt(realImageWidth, 10) - (2 * parseInt(clondedImageBorder, 10)) + 'px',
                            height: realImageHeight
                        });
                        $('.hint').html(imgObject[randomInt].imgText);
                        
                        if (imgObject[randomInt].imgLink !== "") {
                            $('.hint').html(imgObject[randomInt].imgText);
                            $('.hint').show("slide", {
                                direction: "up"
                            }, "slow", function showText(){
                            
                                $('.hint').css({
                                    display: "block",
                                    opacity: 0.5
                                });
                            });
                        }
                        
                        clondedImage.mouseover(function(){
                            $("#container").stopTime("timedShow");
                        });
                        clondedImage.mouseout(function(){
                            clondedImage.fadeOut(1500);
                            $('.hint').css({
                                display: "none"
                            });
                            $("#container").everyTime(timer, "timedShow", function(i){
                                makeShow(i);
                            });
                        });
                        
                        if (currentArray.length > 1) {
                            jQuery.each(currentArray, function(i, val){
                                if (i === 0) {
                                    $('#viewPortPhoto #' + val.imgName).remove();
                                    currentArray.shift();
                                }
                            });
                        }
                    });
                    $('.transferring').css({
                        "background-image": "url('" + imgName + "')"
                    });
                }//makeShow 

                
                /**
                 * Returns a random int
                 *  @return a random int
                 *  @type int
                 */
                function getRandomInt(){
                    return Math.round(Math.random() * (imgObject.length - 1));
                }//get RandomInt
            });//each
        }//floating images
    });//extend
})(jQuery);


