var ActivityMain = (function () {
    return {
        LaunchActivity: function () {
            this.ResetCompounds();
            this.BindDroppables();
            this.BindDraggables();
        },
        ResetActivity: function () {
            this.ResetCompounds();
            this.BindDroppables();
            $(".formula").css({ "left": 0, "top": 0 })
            $(".compound[dropped-cmp]").removeAttr("dropped-cmp")
            $(".compound .wrong_mc").remove();
            $(".compound .correct_mc").remove();
        },
        OnOrientationChange: function () {
            $(".compound[dropped-cmp]").each(function(){
                var droppedItem = $(this).attr("dropped-cmp");
                var gradItem = $(".formula[compound='"+droppedItem+"']");
                ActivityMain.ResetDroppedPosition($(this),gradItem) 
            });
        },
        BindDraggables: function () {
            //Bind Draggable
            $(".formula").draggable({
                container: "#drag-drop-wrap",
                //revert: "invalid",
                revert: function (event, ui) {
                    $(this).data("uiDraggable").originalPosition = {
                        top: 0,
                        left: 0
                    };
                    /*
                    if (!event) {
                        ActivityMain.InitReadingCounter(Number($(".thermoreading").text()), 25, Number($(".thermoreading").text()));
                    }*/
                    return !event;
                },
                start: function (event, ui) {
                    $(".contWraper").removeAttr("style");
                    $(".contWraper").removeAttr("pz-scale")
                }
            }).each(function () {
                /*var top = $(this).position().top;
                var left = $(this).position().left;
                $(this).data('orgTop', top);
                $(this).data('orgLeft', left);*/
            });
        },
        BindDroppables: function () {
            //Bind Droppable
            //debugger
            $(".compound").droppable({
                accept: ".formula",
                tolerance: "pointer",
                drop: function (event, ui) {
                    ActivityMain.ResetDroppedPosition($(event.target),  ui.draggable);
                    var dropcmp = ui.draggable.attr("compound");
                    $(".compound[dropped-cmp='" + dropcmp + "']").removeAttr("dropped-cmp")
                    event.target.setAttribute("dropped-cmp", dropcmp);

                },
                out: function (event, ui) { }
            });
        },
        ResetCompounds: function () {
            var elements = $(".compoundWrapper>.compound").get()
            var compounds = this.Shuffle(elements);
            $(".compoundWrapper").html(compounds);
        },
        Shuffle: function (array) {
            let currentIndex = array.length, randomIndex;
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [
                    array[randomIndex], array[currentIndex]];
            }
            return array;
        },
        SubmitActivity: function () {
            $(".compound .wrong_mc").remove();
            $(".compound .correct_mc").remove();
            $(".compound").each(function(){
                if($(this).attr("compound") == $(this).attr("dropped-cmp")){
                    $(this).append('<div class="correct_mc">&#10004;</div>');
                }
                else{
                    $(this).append('<div class="wrong_mc">&#10006;</div>');
                }
            })
        },
        AnswerActivity: function () {

        },
        ResetDroppedPosition: function(_drpppable, _draggable){
            var drpLeft = _drpppable[0].offsetLeft;
            var drpTop = _drpppable[0].offsetTop;
            var drpHt = _drpppable[0].offsetHeight;
            var drpWdt = _drpppable[0].offsetWidth;
            var drgLeft = _draggable.parent()[0].offsetLeft;
            var drgTop = _draggable.parent()[0].offsetTop;
            var drgHt = _draggable.parent()[0].offsetHeight;
            var drgWdt = _draggable.parent()[0].offsetWidth;
            var leftPos = (drpLeft - drgLeft) + ((drpWdt / 2) - (drgWdt / 2));
            var topPos = (drpTop - drgTop) + ((drpHt / 2) - (drgHt / 2));
            _draggable.css({ "left": leftPos, "top": topPos });
        },
    };
})();

$(document).on("click", "#btn_reset", function (event) {
    $(".contWraper").removeAttr("style");
    $(".contWraper").removeAttr("pz-scale")
    //debugger;
    ActivityMain.ResetActivity();
});
$(document).on("click", "#btn_ok", function (event) {
    ActivityMain.SubmitActivity();
});
$(document).on("click", ".compound", function (event) {
    var compound = $(this).attr("compound");
    $(".structurepopup .modal-body .structure-body").hide();
    $(".structurepopup .modal-body .structure-body[compound='" + compound + "']").show();
    $('#structurepopup').modal('show');
});