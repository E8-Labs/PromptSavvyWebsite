(function ($) {
	"use strict";

    jQuery(document).ready(function($){
        
        //===== Sticky Menu-Bar Start
        $(window).on('scroll',function(event) {    
            var scroll = $(window).scrollTop();
                if (scroll < 20) {
                    $(".body_class").removeClass("sticky");
                }else{
                    $(".body_class").addClass("sticky");
                }
            });
        //===== Sticky Menu-Bar End

       
        // cart-close 
        $(".cart-close").click(function(){
            $(".card-dropdown").removeClass("show");
        });
        // cart-close
        
        // Multi select label
        $('.single-select').click(function(e) {
            e.stopPropagation();
        
            var $this = $(this);
        
            if ($this.hasClass('active')) {
              $this.removeClass('active');
            } else {
              $('.single-select').removeClass('active');
              $this.addClass('active');
            }
          });
        
          $(document).click(function() {
            $('.single-select').removeClass('active');
          });
          // Multi select label


          $(".selectBox").on("click", function(e) {
            $(this).toggleClass("show");
            var dropdownItem = e.target;
            var container = $(this).find(".selectBox__value");
            container.text(dropdownItem.text);
            $(dropdownItem)
              .addClass("active")
              .siblings()
              .removeClass("active");
          });
          

    //trigger model popup
    // $(document).ready(function() {
    //     $('#InstallExtensionModal').modal('show');
    //   });

		
		// Nice_select Plugin Active Start
        $(document).ready(function() {
			$('select').niceSelect();
			});
		// Nice_select Plugin Active End
			  

        // Save Button Active 
        $(".save_btn").click(function(){
            $(this).toggleClass("active");
        });
        
       
        // Save Button Active 
        $(".advance_toggle button").click(function(){
            $('.advance_option_filter').toggleClass("active");
        });
        
       
        
        // Followers Count checkbox 
        $(".count_filed").click(function(event){  
			$(this).toggleClass('active').siblings().removeClass('active'); 
		});  

        // Followers Count checkbox 
        $(".public-list button").click(function(event){  
			$(this).toggleClass('active').siblings().removeClass('active'); 
		});  

          
        // Save Button Active 
        $(".prompt-card").click(function(){
            $('.create-pompt-wrapper, .overlay_wrap').addClass("active");
        });
          
        // Create Prompt Modal Start 
        $(".overlay_wrap, .pronpt-textarea button").click(function(){
            $('.create-pompt-wrapper, .overlay_wrap').removeClass("active");
        });
        // subscription-plans Functions 
        $(".single_subs").click(function(){
            $(this).toggleClass('active').siblings().removeClass('active'); 
        });
     
        // Create Step Progress
        $(".step_btn_one").click(function(){
            $('.step_progress').addClass("step_progress_1");
        });
        $(".step_btn_two").click(function(){
            $('.step_progress').addClass("step_progress_2");
        });
        $(".step_btn_three").click(function(){
            $('.step_progress').addClass("step_progress_3");
        });
        $(".step_btn_four").click(function(){
            $('.step_progress').addClass("step_progress_4");
        });
        $(".step_btn_five").click(function(){
            $('.step_progress').addClass("step_progress_5");
        });
     


        const stepContainers = document.querySelectorAll(".step-container");

        stepContainers.forEach(container => {
          const continueBtns = container.querySelectorAll(".continue__btn");
          const steps = container.querySelectorAll(".step");
          let currentStepIndex = 0;
        
          continueBtns.forEach(btn => {
            btn.addEventListener("click", () => {
              const currentStep = steps[currentStepIndex];
              const nextStep = steps[currentStepIndex + 1];
        
              currentStep.style.display = "none";
              if (nextStep) {
                nextStep.style.display = "block";
                currentStepIndex++;
              } else {
                // Reached the end of the steps
                // You can add your logic here, such as displaying a success message
              }
            });
          });
        });


        // search bar active Active 
        $(".search__active").click(function(){
            $('.search__prompt').toggleClass("active");
        });
       

        $('.single_filed input, .content-gose textarea, .filed_bx textarea, .ai_textarea textarea').on('focus', function(){
            $(this).closest('.single_filed, .content-gose, .filed_bx, .ai_textarea').addClass('focused');
          });
          
          $('.single_filed input, .content-gose textarea, .filed_bx textarea, .ai_textarea textarea').on('blur', function(){
         
            if  ( $(this).val() === '') {
               $(this).closest('.single_filed, .content-gose, .filed_bx, .ai_textarea').removeClass('focused');
            }
        });       
          
	});
}(jQuery));	






