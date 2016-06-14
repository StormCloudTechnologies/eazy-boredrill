$(document).ready(function(){
    
    (function($) {
        "use strict";
    /*PreLoader*/
        $(".loader-item").delay(700).fadeOut();
        $("#pageloader").delay(800).fadeOut("slow");
    
    
        
    /*NiceScroll*/
        $("html").niceScroll({
            cursorcolor: "#293133",
            cursorborderradius: "0",
            cursorborder: "0 solid #fff",
            cursorwidth: "10px",
            zindex: "999999",
            scrollspeed: 60
        });
    
    
    /*Go Top*/
        $('a[href="#top"]').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            return false
        });
    
    
    /*TweetSlider Slider*/
        $('.twitterSlide .twitterSlider').owlCarousel({
            loop:true,
            margin:0,
            nav:true,
            items:1,
            dots:false,
            lazyLoad: true,
            autoplay: true,
            navText: [ '<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>' ]
        });     
    
    
    /*Testimonial Slider*/
        $('.testimonialSlider').owlCarousel({
            loop:true,
            margin:0,
            nav:false,
            items:1,
            dots:false,
            lazyLoad: true,
            autoplay: true
        });  
    
    
    /*ParterSlider*/
        $('.partnerSlider').owlCarousel({
            loop:true,
            margin:10,
            responsiveClass:true,
            nav: true,
            navText: [ '<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>' ],
            autoplay: true,
            responsive:{
                0:{
                    items:1,
                    nav:true
                },
                600:{
                    items:2,
                    nav:false
                },
                1000:{
                    items:3,
                    nav:true,
                    loop:false
                }
            }
        });
   
        
    })(jQuery)
});