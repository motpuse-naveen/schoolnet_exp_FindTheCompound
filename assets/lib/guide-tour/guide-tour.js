

var GuidedTour = (function () {
    var dt_step_count = 0;
    var gt_instr_box_html = `
      <button id="btn_skip_gt" class="btn_skip_gt">Skip Tutorial</button>
      <div class="gt-instr-box">
          <div class="gt-instr-wrapper">
              <div class="gt-instr"></div>
              <div class="gt-button-next">
                  <button id="btn_Prev_gt" class="btn_Prev_gt">Previous</button>
                  <button id="btn_Next_gt" class="btn_Next_gt">Next</button>
                  <button id="btn_Done_gt" class="btn_Done_gt disnone">Done</button>
              </div>
          </div>
          <!--<div class="gt-arrow"></div>-->
      </div>
  `;
    return {
        Init: function () {
            $('.wrapper').append($("<div>").addClass("overlay-gt"));
            $(".wrapper").before(gt_instr_box_html);
            this.LoadTip();
            this.setSkipPosition();
        },
        OnResize: function () {
            this.LoadTip();
            this.setSkipPosition();
        },
        LoadTip: function () {
            $(".gt-instr-box .gt-instr").html(g_tour_steps[dt_step_count].informationText);
            var myposition = this.getPosition($(g_tour_steps[dt_step_count].sourceElmIdQS));
            $(".gt-clone").remove();
            $(".gt-instr-box").after($(g_tour_steps[dt_step_count].sourceElmIdQS).clone().addClass("gt-clone").removeAttr("id").removeAttr("data-bs-toggle").removeAttr("data-bs-target"));
            $(".gt-clone").css({ "left": myposition.left-1, "top": myposition.top -1 });

            var horSide = "left";
            var verSide = "top";
            if (myposition.left < (window.innerWidth / 2)) {
                horSide = "right";
            }
            if (myposition.top < (window.innerHeight / 2)) {
                verSide = "bottom";
            }
            if (horSide == "right") {
                if ((myposition.left + 250) > window.innerWidth) {
                    $(".gt-instr-box").css({ "left": myposition.left - ((myposition.left + 250) - window.innerWidth) - 10, "top": myposition.top });
                }
                else {
                    $(".gt-instr-box").css({ "left": myposition.left, "top": myposition.top });
                }
            }
            else if (horSide == "left") {
                if ((myposition.left - 250) < 0) {
                    var marleft = myposition.left + (250 - myposition.left) + 10
                    $(".gt-instr-box").css({ "left": + marleft + "px" })
                }
                else {
                    $(".gt-instr-box").css({ "left": myposition.left + 30, "top": myposition.top });
                }
            }
            else {
                $(".gt-instr-box").css({ "left": myposition.left, "top": myposition.top });
            }

            $(".gt-instr-box").attr("halign", horSide);
            $(".gt-instr-box").attr("valign", verSide);
            if (dt_step_count < (g_tour_steps.length - 1)) { 
                $(".gt-button-next .btn_Next_gt").removeClass("disnone");
                $(".gt-button-next .btn_Prev_gt").removeClass("disnone");
                $(".gt-button-next .btn_Done_gt").addClass("disnone")
            }
            else {
                $(".gt-button-next .btn_Next_gt").addClass("disnone");
                $(".gt-button-next .btn_Prev_gt").removeClass("disnone");
                $(".gt-button-next .btn_Done_gt").removeClass("disnone")
            }
            if(g_tour_steps.length==1){
                $(".gt-button-next .btn_Next_gt").addClass("disnone");
                $(".gt-button-next .btn_Prev_gt").addClass("disnone");
                $(".gt-button-next .btn_Done_gt").removeClass("disnone")
            }
            else if(dt_step_count==0){
                $(".gt-button-next .btn_Prev_gt").addClass("disnone");
            }
        },
        CheckNextStep: function () {
            var nextElm = undefined;
            if (dt_step_count < (g_tour_steps.length - 1)) {
                nextElm = $(g_tour_steps[dt_step_count + 1].sourceElmIdQS)
                if (nextElm.is(":visible")) {
                    dt_step_count = dt_step_count + 1;
                }
                else {
                    dt_step_count = dt_step_count + 2;
                }
            }
            
        },
        CheckPrevStep: function () {
            var nextElm = undefined;
            if (dt_step_count > 0) {
                nextElm = $(g_tour_steps[dt_step_count - 1].sourceElmIdQS)
                if (nextElm.is(":visible")) {
                    dt_step_count = dt_step_count - 1;
                }
                else {
                    dt_step_count = dt_step_count - 2;
                }
            }
        },
        Complete: function () {
            $(".overlay-gt").remove();
            $(".gt-instr-box").remove();
            $(".gt-clone").remove();
            $("#btn_skip_gt").remove();
        },
        PrevTip: function () {
            GuidedTour.CheckPrevStep();
            GuidedTour.LoadTip();
        },
        NextTip: function () {
            GuidedTour.CheckNextStep();
            GuidedTour.LoadTip();
        },
        setSkipPosition: function () {
            var myposition = this.getPosition($(".wrapper"));
            $("#btn_skip_gt").css({ "left": myposition.left + 20, "top": myposition.top + 20 });
        },
        getPosition: function (element) {
            var clientRect = element[0].getBoundingClientRect();
            return {
                left: clientRect.left + document.body.scrollLeft,
                top: clientRect.top + document.body.scrollTop
            };
        }
    }
})();

$(document).on("click", ".gt-button-next #btn_Next_gt", function (event) {
    GuidedTour.NextTip();
});
$(document).on("click", ".gt-button-next #btn_Done_gt", function (event) {
    GuidedTour.Complete();
});
$(document).on("click", "#btn_skip_gt", function (event) {
    GuidedTour.Complete();
});
$(document).on("click", ".gt-button-next #btn_Prev_gt", function (event) {
    GuidedTour.PrevTip();
});
