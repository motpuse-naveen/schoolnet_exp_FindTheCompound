function hammerIt(elm, p_maxScale) {
    hammertime = new Hammer(elm, {
        prevent_default: true
        //touchAction: "pan"
    });
    hammertime.get('pinch').set({
        enable: true
    });
    var posX = 0,
        posY = 0,
        scale = 1,
        last_scale = 1,
        last_posX = 0,
        last_posY = 0,
        max_pos_x = 0,
        max_pos_y = 0,
        transform = "",
        el = elm;

    if (typeof p_maxScale == 'undefined')
        p_maxScale = 4

    hammertime.on('doubletap pan pinch panend pinchend', function (ev) {
        /*if (ev.type == "doubletap") {
            transform =
                "translate3d(0, 0, 0) " +
                "scale3d(2, 2, 1) ";
            scale = 2;
            last_scale = 2;
            try {
                if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
                    transform =
                        "translate3d(0, 0, 0) " +
                        "scale3d(1, 1, 1) ";
                    scale = 1;
                    last_scale = 1;
                }
            } catch (err) { }
            el.style.webkitTransform = transform;
            transform = "";
        }
        */

        //pan
        if (scale != 1) {
            posX = last_posX + ev.deltaX;
            posY = last_posY + ev.deltaY;
            max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
            max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
            if (posX > max_pos_x) {
                posX = max_pos_x;
            }
            if (posX < -max_pos_x) {
                posX = -max_pos_x;
            }
            if (posY > max_pos_y) {
                posY = max_pos_y;
            }
            if (posY < -max_pos_y) {
                posY = -max_pos_y;
            }
        }
        //pinch
        if (ev.type == "pinch") {
            scale = Math.max(.999, Math.min(last_scale * (ev.scale), p_maxScale));
        }
        if (ev.type == "pinchend") { last_scale = scale; }

        //panend
        if (ev.type == "panend") {
            last_posX = posX < max_pos_x ? posX : max_pos_x;
            last_posY = posY < max_pos_y ? posY : max_pos_y;
        }

        if (scale != 1) {
            transform =
                "translate3d(" + posX + "px," + posY + "px, 0) " +
                "scale3d(" + scale + ", " + scale + ", 1)";
        }

        if (transform) {
            el.style.webkitTransform = transform;
        }
    });
}
function hammerItScrollableContent(elm, p_maxScale) {
    hammertime_scroll = new Hammer(elm, {
        prevent_default: true,
        touchAction: "pan-X pan-Y"
    });
    hammertime_scroll.get('pinch').set({
        enable: true
    });
    hammertime_scroll.get('pan').set({ enable: true, threshold: 0 });

    var posX = 0, posY = 0, scale = 1, last_scale = 1, last_posX = 0, last_posY = 0, max_pos_x = 0,
        max_pos_y = 0, transform = "",
        el = elm;

    var initScrollLeft = 0, initScrollTop = 0;

    if (typeof p_maxScale == 'undefined')
        p_maxScale = 4

    hammertime_scroll.on('doubletap pinchstart pinch pinchend', function (ev) {
        /*if (ev.type == "doubletap") {
            console.log("111")
            transform =
                "translate3d(0,0,0) " +
                "scale3d(2, 2, 1)";
            scale = 2;
            last_scale = 2;
            try {
                if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
                    transform =
                        "translate3d(" + 0 + "px," + 0 + "px, 0) " +
                        "scale3d(1, 1, 1) ";
                    scale = 1;
                    last_scale = 1;
                }
            } catch (err) { }
            PZApplyScaleScrollable(el, scale)
            transform = "";
        }*/
        if (scale != 1) {
            posX = last_posX + ev.deltaX;
            posY = last_posY + ev.deltaY;
            max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
            max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
            if (posX > max_pos_x) {
                posX = max_pos_x;
            }
            if (posX < -max_pos_x) {
                posX = -max_pos_x;
            }
            if (posY > max_pos_y) {
                posY = max_pos_y;
            }
            if (posY < -max_pos_y) {
                posY = -max_pos_y;
            }
        }
        //pinchstart
        if (ev.type == "pinchstart") {
            initScrollLeft = $(el.parentElement).scrollLeft();
            initScrollTop = $(el.parentElement).scrollTop();
        }
        //pinch
        if (ev.type == "pinch") {
            scale = Math.max(0.999, Math.min(last_scale * (ev.scale), p_maxScale));
        }
        if (ev.type == "pinchend") {
            last_scale = scale;
            last_posX = posX < max_pos_x ? posX : max_pos_x;
            last_posY = posY < max_pos_y ? posY : max_pos_y;
        }
        //panend
        if (ev.type == "panend") {
            last_posX = posX < max_pos_x ? posX : max_pos_x;
            last_posY = posY < max_pos_y ? posY : max_pos_y;
        }
        if (scale != 1) {
            transform =
                "translate3d(" + 0 + "px," + 0 + "px, 0) " +
                "scale3d(" + scale + ", " + scale + ", 1)";
        }
        if (transform) {
            //el.style.transform = transform;
            //el.style.webkitTransform = transform;
            PZApplyScaleScrollable(el, scale, ev.type)
            if (ev.type == "pinch") {
                try {
                    if (scale < p_maxScale) {
                        $(el.parentElement).scrollLeft((initScrollLeft * ev.scale));
                        $(el.parentElement).scrollTop((initScrollTop * ev.scale));
                    }
                }
                catch (err) { }
            }
        }
    });
}


function PZApplyScale(p_element, p_scale, p_translateX, p_translateY) {
    $(p_element).css({
        "transform": "translate3d(" + p_translateX + "," + p_translateY + ",0) scale3d(" + p_scale + ", " + p_scale + ", 1)"
    });
}

var global_PZ_Element = {
    element: null,
    scale: 1
}

function PZApplyScaleScrollable(p_element, p_scale, eventType) {
    $(p_element).css({
        "-webkit-transform": "scale(" + p_scale + ")",
        "transform": "scale(" + p_scale + ")"
    });
    $(p_element).attr("pz-scale", p_scale)

    if (eventType == "pinchend") {
        ScreenSplitter.ResetSplitOnPinchZoom();
    }
}

