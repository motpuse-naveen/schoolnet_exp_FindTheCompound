var ActivityMain = (function () {
    W_Array = [
        `<li class="cylinder W_01"><div class="item W_01"><img src="assets/images/W_01.svg" /><span class="data-label">D</span></div></li>`,
        `<li class="cylinder W_02"><div class="item W_02"><img src="assets/images/W_02.svg" /><span class="data-label">A</span></div></li>`,
        `<li class="cylinder W_03"><div class="item W_03"><img src="assets/images/W_03.svg" /><span class="data-label">B</span></div></li>`,
        `<li class="cylinder W_04"><div class="item W_04"><img src="assets/images/W_04.svg" /><span class="data-label">C</span></div></li>`,
        `<li class="cylinder W_05"><div class="item W_05"><img src="assets/images/W_05.svg" /><span class="data-label">E</span></div></li>`,
        `<li class="cylinder W_06"><div class="item W_06"><img src="assets/images/W_06.svg" /><span class="data-label">F</span></div></li>`
    ];
    Data_Array = [
        "D", "A", "B", "C", "F", "E"
    ];
    TemperatureArray = [];

    return {
        LaunchActivity: function () {
            this.ResetCylinders();
            this.BindJQueryUIMethods();
        },
        ResetActivity: function () {
            var orgtop = $(".thermometerDragger").data('orgTop');
            var orgleft = $(".thermometerDragger").data('orgLeft');
            $(".thermometerDragger").css({
                "left": orgleft,
                "top": orgtop
            })
            this.ResetCylinders();
            this.BindJQueryUIMethods();
            ActivityMain.InitReadingCounter(Number($(".thermoreading").text()), 25, Number($(".thermoreading").text()));

            $(".editableTextPad").val("")
            $(".wrong_mc").hide();
            $(".correct_mc").hide();
        },
        OnOrientationChange: function () {
        },
        BindJQueryUIMethods: function () {
            //Bind Sortable
            $("#cylinder-list").sortable({
                start: function( event, ui ) {
                    $(".contWraper").removeAttr("style");
                    $(".contWraper").removeAttr("pz-scale")
                    ScreenSplitter.ResetSplit();
                    var orgtop = $(".thermometerDragger").data('orgTop');
                    var orgleft = $(".thermometerDragger").data('orgLeft');
                    $(".thermometerDragger").css({
                        "left": orgleft,
                        "top": orgtop
                    })
                    ActivityMain.InitReadingCounter(Number($(".thermoreading").text()), 25, Number($(".thermoreading").text()));
                    
                }
              })
                .disableSelection();

            //Bind Draggable
            $(".thermometerDragger").draggable({
                //revert: "invalid",
                revert: function (event, ui) {
                    $(this).data("uiDraggable").originalPosition = {
                        top: $(this).data('orgTop'),
                        left: $(this).data('orgLeft')
                    };
                    /*
                    if (!event) {
                        ActivityMain.InitReadingCounter(Number($(".thermoreading").text()), 25, Number($(".thermoreading").text()));
                    }*/
                    return !event;
                },
                start: function(event,ui){
                    $(".contWraper").removeAttr("style");
                    $(".contWraper").removeAttr("pz-scale")
                    ScreenSplitter.ResetSplit();
                }
            }).each(function () {
                var top = $(this).position().top;
                var left = $(this).position().left;
                $(this).data('orgTop', top);
                $(this).data('orgLeft', left);
            });

            //Bind Droppable
            $("li.cylinder .item").droppable({
                accept: ".thermometerDragger",
                tolerance: "touch",
                drop: function (event, ui) {
                    var t_to = $(event.target).closest("li.cylinder").attr("temperature")
                    t_to = Number(t_to)
                    ActivityMain.InitReadingCounter(25, t_to, 25);
                },
                out: function (event, ui) {
                    ActivityMain.InitReadingCounter(Number($(".thermoreading").text()), 25, Number($(".thermoreading").text()));
                }
            });
        },
        ResetCylinders: function () {
            var locWArray = this.Shuffle(W_Array);
            $("#cylinder-list").empty();
            var locDataArray = this.Shuffle(Data_Array)
            var temperatures = [];
            for (var i = 0; i < locWArray.length; i++) {
                temperatures.push(Number((30 + 11 * i + Number(7 * Math.random())).toFixed(0)))
            }
            temperatures = this.Shuffle(temperatures);
            TemperatureArray = [];
            for (var i = 0; i < locWArray.length; i++) {
                temperature = (30 + 11 * i + Number(7 * Math.random()))
                var locCylinder = $(locWArray[i]).attr("temperature", temperatures[i]).attr("datalabel", locDataArray[i]);
                TemperatureArray.push({ label: locDataArray[i], temperature: temperatures[i] })
                locCylinder.find(".data-label").text(locDataArray[i]);
                $("#cylinder-list").append(locCylinder);
            }
            TemperatureArray.sort((a, b) => a.temperature - b.temperature);
            TemperatureArray.reverse();
            //console.log(TemperatureArray);
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
        InitReadingCounter: function (p_from, p_to, p_current) {
            clearInterval(ThermoReadingInterval);
            ThermoReading = {
                from: p_from,
                to: p_to,
                current: p_current,
            }
            if (p_from < p_to) {
                AnnimateIncreaseInReading();
            }
            else {
                AnnimateDecreaseInReading();
            }
        },
        SubmitActivity: function () {
            var result = []
            $("#cylinder-list li.cylinder").each(function (index) {
                //console.log( index + ": " + $( this ).text() );
                result.push({ "label": $(this).attr("datalabel"), "temperature": Number($(this).attr("temperature")) })
            });
            console.log(result)
            if (JSON.stringify(result) == JSON.stringify(TemperatureArray)) {
                $(".wrong_mc").hide();
                $(".correct_mc").show();
            }
            else {
                $(".wrong_mc").show();
                $(".correct_mc").hide();
            }
        },
        AnswerActivity: function () {

        }
    };
})();

var ThermoReadingInterval = null;
var ThermoReading = {
    from: 25,
    to: 100,
    current: 25,
}
function AnnimateIncreaseInReading() {
    ThermoReadingInterval = setInterval(function () {
        ThermoReading.current = ThermoReading.current + 1;
        $(".thermored").css({ "height": ThermoReading.current + "%" })
        if (ThermoReading.current >= ThermoReading.to) {
            clearInterval(ThermoReadingInterval);
            $(".thermoreading").text(ThermoReading.to)
            DisplayTemperatureBar(ThermoReading.to);
        }
        else {
            $(".thermoreading").text(ThermoReading.current)
            DisplayTemperatureBar(ThermoReading.current);
        }
    }, 10)
}

function AnnimateDecreaseInReading() {
    ThermoReadingInterval = setInterval(function () {
        ThermoReading.current = ThermoReading.current - 1;
        if (ThermoReading.current <= ThermoReading.to) {
            clearInterval(ThermoReadingInterval);
            $(".thermoreading").text(ThermoReading.to)
            DisplayTemperatureBar(ThermoReading.to);
        }
        else {
            $(".thermoreading").text(ThermoReading.current)
            DisplayTemperatureBar(ThermoReading.current);
        }
    }, 5)
}

function DisplayTemperatureBar(currPerc) {
    var deltaPerc = (currPerc / 10.0) - 1
    var perc = currPerc - deltaPerc;
    console.log(currPerc + " : " + deltaPerc + " : " + perc)
    $(".thermored").css({ "height": perc + "%" })
}

$(document).on("click", "#btn_reset", function (event) {
    $(".contWraper").removeAttr("style");
                    $(".contWraper").removeAttr("pz-scale")
    ScreenSplitter.ResetSplit();
    ActivityMain.ResetActivity();
    $("#btn_ok").show();
    $("#btn_answer").show();
    $("#btn_speed").hide();
    speedAnswerActive = false;
    CancelledAnswerAction = false;
});
$(document).on("click", "#btn_ok", function (event) {
    ActivityMain.SubmitActivity();
});
$(document).on("click", "#btn_answer", function (event) {
    ActivityMain.AnswerActivity();
    bubbleSort();
    $("#btn_ok").hide();
    $("#btn_answer").hide();
    $("#btn_speed").show();
});
$(document).on("click", "#btn_speed", function (event) {
    speedAnswerActive = true
    setInterval(function(){
        if(CancelledAnswerAction){
            bubbleSortSpeed();
        }
    },100)
    $("#btn_speed").hide();
});

const container = document.querySelector(".cylinder-list");
function swap(el1, el2) {
    return new Promise(resolve => {
        // Wait for the transition to end!
        window.requestAnimationFrame(function () {
            setTimeout(() => {
                container.insertBefore(el2, el1);
                resolve();
            }, 250);
        });
    });
}

async function bubbleSort(delay = 100) {
    let blocks = document.querySelectorAll(".cylinder");
    for (let i = 0; i < blocks.length - 1; i += 1) {
        for (let j = 0; j < blocks.length - i - 1; j += 1) {
            if (speedAnswerActive){
                CancelledAnswerAction = true
                return;
            } 
            await new Promise(resolve =>
                setTimeout(() => {
                    resolve();
                }, delay)
            );
            const value1 = Number(blocks[j].getAttribute('temperature'));
            const value2 = Number(blocks[j + 1].getAttribute('temperature'));

            if (value2 > value1) {
                await swap(blocks[j], blocks[j + 1]);
                blocks = document.querySelectorAll(".cylinder");
            }
        }
    }
}

var speedAnswerActive = false;
var CancelledAnswerAction = false;
function swapSpeed(el1, el2) {
    container.insertBefore(el2, el1);
}
async function bubbleSortSpeed(delay = 100) {
    let blocks = document.querySelectorAll(".cylinder");
    for (let i = 0; i < blocks.length - 1; i += 1) {
        for (let j = 0; j < blocks.length - i - 1; j += 1) {
            const value1 = Number(blocks[j].getAttribute('temperature'));
            const value2 = Number(blocks[j + 1].getAttribute('temperature'));
            if (value2 > value1) {
                swapSpeed(blocks[j], blocks[j + 1]);
                blocks = document.querySelectorAll(".cylinder");
            }
        }
    }
}

