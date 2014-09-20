//todo random full lenght top images with scrolling logo and more button 
//var homeBgImg = ["#b6c4d0 url(images/sc9bg1A.jpg) top  right fixed", "#b6c4d0 url(images/sc9bg1B.jpg) top  right fixed"];

function getRandomArr(arr) {
    return Math.floor(Math.random() * arr.length)
}


$.fn.mobileFix = function (options) {
    var $parent = $(this),
    $fixedElements = $(options.fixedElements);

    $(document)
    .on('focus', options.inputElements, function(e) {
        $parent.addClass(options.addClass);
    })
    .on('blur', options.inputElements, function(e) {
        $parent.removeClass(options.addClass);
        // Fix for some scenarios where you need to start scrolling
        setTimeout(function() {
            $(document).scrollTop($(document).scrollTop())
        }, 1);
    });

    return this; // Allowing chaining
};


function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}


function scrollToContent(loc){
    $('html').velocity("scroll", { duration: 1500, easing: "easeInSine", offset: $(loc).offset().top - 55  });
    $('#menuContent').collapse('hide');
}


$(function() {
    var _bPop;
    var _bPopSource;

    
    

    if(detectmob()){
        $('.navbar-collapse').remove();
        /* cache dom references */ 
        var $body = jQuery('body'); 
        $(document).on('focus', 'select', function(e) {
            $body.addClass('fixfixed');
        }).on('blur, change', 'select', function(e) {
            $body.removeClass('fixfixed');
        });

        $(document).on('scrollend', function(e) {
            $body.removeClass('fixfixed');
        });
        
        
    }else{
        $('#selectmenuContent').hide();
    }

    
     
    
 

    define(['holder'], function(holder) {
        this.compositionComplete = function () { // EXECUTES AFTER DOM UPDATE
                holder.run({
                    domain: "holder.canvas",
                    use_canvas: false
                });


        };

        $( "#selectmenuContent select" ).change(function(e) {
            scrollToContent('#'+$(this).val());
        });


        $('.nav a').on('click, tap', function(e) {
            e.preventDefault();
            scrollToContent($(this).attr('href'));
        });

        $(".col-md-3 div").velocity("transition.slideUpBigIn", { complete: function(){
            $("img").lazyload({effect:'fadeIn'});
        } });
        

     });

    $('[data-url]').on('click, tap', function(e){
        console.log($(this).attr('data-url'));
        if(detectmob()){
            window.open(
                $(this).data("url"),
                '_blank'
            )
        }else{
           _bPop =  $('.popup').bPopup({
            fadeSpeed: 'fast',
            content:'iframe',
            escClose:true,
            opacity:0,
            position:[20,50],
            loadCallback: function() {
               $('body').not('iframe body').css('overflow', 'hidden');
               $('.popup, .b-iframe').height($(window).height());
               $('.popup, .b-iframe').width($(window).width());

               $('.popup').append("<div class='closePopUp'>X</div>");
                $('.closePopUp').on('click, tap', function(){
                _bPop.close();
                });
            },
            onClose: function(){
                $('body').not('iframe body').css('overflow', 'scroll');
            },
            loadUrl: $(this).attr('data-url')
            });
        }

    });


    $('[data-source]').on('click, tap', function(e){
        if(detectmob()){
             window.open(
                'source.html#' + $(this).data("source"),
                '_blank'
            )
        }else{
            _bPopSource =  $('.popup').bPopup({
            content:'iframe',
            fadeSpeed: 'fast',
            escClose:true,
            opacity:0,
            position:[0,50],
            loadCallback: function() {
               $('body').not('iframe body').css('overflow', 'hidden');
               $('.popup, .b-iframe').height($(window).height());
               $('.popup, .b-iframe').width($(window).width());
               $('iframe').height(2000);
               $('.popup, .b-iframe').css('overflow', 'scroll');

               $('.popup').append("<div class='closePopUp'>X</div>");
                $('.closePopUp').on('click, tap', function(){
                _bPopSource.close();
                });
            },
            onClose:function(){
               $('body').not('iframe body').css('overflow', 'scroll');
            },
            loadUrl: 'source.html#' + $(this).attr('data-source')
            });
        }

    });
    
             

});