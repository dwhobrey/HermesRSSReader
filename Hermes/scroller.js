// Hermes scroll bar.
var sbDisabled = 0;
var sbVertical = true;
var sbViewableLength = 0;
var sbTotalLength = 0;
var sbHandleLength = 0;
var sbTrackLength = 0;
var sbTrackOffset = 0;
var sbTrackSpace = 0;
var sbGrabPoint = 0;
var sbXPos = 0;
var sbYPos = 0;
var sbDistX = 0;
var sbDistY = 0;
var sbConPos = 0;
var sbRatio = 0;
var sbHndPos = 0;
var sbDistance = 10;

var sbTimerId = 0;
var sbHolderNode = null;
var sbContentNode = null;
var sbBarNode = null;
var sbHandleNode = null;
var sbDownNode = null;
var sbUpNode = null;
var sbTrackNode = null;
var sbTarget = null;

var sbLoColor = "white";
var sbHiColor = "yellow";

function findOffset(x) {
    var n = 0;
    if (x) {
        while (x.offsetParent) {
            n += sbVertical ? x.offsetTop : x.offsetLeft;
            x = x.offsetParent;
        }
    }
    x = null;
    return n;
}

function sbEventHandler(target, type) {
    try {
        if (target == sbHandleNode || target == sbDownNode || target == sbUpNode) {
            if (type == "mousedown") {
                target.style.backgroundColor = sbHiColor;
            } else {
                target.style.backgroundColor = sbLoColor;
            }
        }
    } catch (e) { }
    target = null;
}

function sbondragstart() {
    return false;
}

function sbonmousedown() {
    return false;
}

function sbMoveContent() {
    sbConPos = -Math.round(sbHndPos * sbRatio);
    if (sbConPos < sbViewableLength - sbTotalLength)
        sbConPos = sbViewableLength - sbTotalLength;
    if (sbConPos > 0) sbConPos = 0;
    if (sbVertical) {
        sbXPos = 0;
        sbYPos = sbConPos;
        VerticalScrollPosition();
    } else {
        sbYPos = 0;
        sbXPos = sbConPos;
        HorizontalScrollPosition();
    }
}

function sbScroll(x, y) {
    if (sbVertical) {
        if (y > sbTrackSpace) y = sbTrackSpace;
        if (y < 0) y = 0;
        sbHndPos = y;
    } else {
        if (x > sbTrackSpace) x = sbTrackSpace;
        if (x < 0) x = 0;     
        sbHndPos = x;
    }
    sbHandleNode.style.top = y + "px";
    sbHandleNode.style.left = x + "px";
    sbMoveContent();
}

function sbScrollBy(x, y) {
    if (sbVertical) {
        sbScroll(0, (-sbConPos + y) / sbRatio);
    } else {
        sbScroll((-sbConPos + x) / sbRatio, 0);
    }
}

function sbOnScrollBy() {
    sbScrollBy(sbDistX,sbDistY);
}

function sbWheel(ev) {
    ev = ev ? ev : window.event;
    var dir = 0;
    if (ev.wheelDelta >= 120) dir = -1;
    if (ev.wheelDelta <= -120) dir = 1;
    if (sbVertical) {
        sbScrollBy(0, dir * 20);
    } else {
        sbScrollBy(dir * 20, 0);
    }
    ev = null;
}

function sbDrag(ev) {
    ev = ev ? ev : window.event;
    sbHndPos = (sbVertical ? ev.clientY : ev.clientX) - sbTrackOffset;
    if (sbHndPos >= sbTrackSpace + sbGrabPoint) sbHndPos = sbTrackSpace;
    else if (sbHndPos <= sbGrabPoint) sbHndPos = 0;
    else sbHndPos -= sbGrabPoint;
    if (sbVertical) {
        sbHandleNode.style.top = sbHndPos + "px";
        sbHandleNode.style.left = "0px";
    } else {
        sbHandleNode.style.top = "0px";
        sbHandleNode.style.left = sbHndPos + "px";
    }
    sbMoveContent();
    ev = null;
}

function sbStop(ev) {
    if (sbTimerId) {
        clearInterval(sbTimerId);
        sbTimerId = null;
    }
    sbEventHandler(sbTarget, "mouseup");
    try {
        sbBarNode.detachEvent("onmousemove", sbDrag);
    } catch (e) { }
    ev.cancelBubble = true;
    ev = null;
}

function sbStart(x, y) {
    sbDistX = x;
    sbDistY = y;
    if(!sbTimerId) sbTimerId = setInterval(sbOnScrollBy, 100);
}

function sbUp() {
    if (sbVertical) {
        sbStart(0, -sbDistance);
    } else {
        sbStart(-sbDistance,0);
    }
}

function sbDown() {
    if (sbVertical) {
        sbStart(0, sbDistance);
    } else {
        sbStart(sbDistance,0);
    }
}

function sbTrack(ev) {
    if (sbVertical) {
        sbScroll(0, ev.clientY - sbTrackOffset - sbHandleLength / 2);
    } else {
        sbScroll(ev.clientX - sbTrackOffset - sbHandleLength / 2, 0);
    }
    ev = null;
}

function sbHandle(ev) {
    sbGrabPoint = (sbVertical ? ev.clientY : ev.clientX) - findOffset(sbHandleNode);
    sbBarNode.attachEvent("onmousemove", sbDrag);
    ev = null;
}

function sbClick(ev) {
    if(!sbDisabled) try {
        ev = ev ? ev : window.event;
        sbTarget = ev.target ? ev.target : ev.srcElement;
        if (sbTarget == sbUpNode) sbUp();
        else if (sbTarget == sbDownNode) sbDown();
        else if (sbTarget == sbTrackNode) sbTrack(ev);
        else if (sbTarget == sbHandleNode) sbHandle(ev);
        else return;
        sbEventHandler(sbTarget, "mousedown");
    } catch (e) {
    }
    ev = null;
}

function sbShowState(isOn) {
    if (isOn) {
        if (sbBarNode) {
            sbDisabled = false;
            sbBarNode.style.display = "block";
        } else {
            sbDisabled = true;
        }
    } else {
        sbDisabled = true;
        if (sbBarNode) {
            sbBarNode.style.display = "none";
        }
    } 
}

function sbUpdateLength() {
    if (sbVertical) {
        sbTotalLength = sbContentNode.offsetHeight;
        sbViewableLength = sbHolderNode.style.posHeight;
        sbTrackLength = sbTrackNode.style.posHeight;
        sbTrackOffset = sbTrackNode.style.posTop;
        sbHandleLength = sbHandleNode.style.posHeight;
    } else {
        sbTotalLength = sbContentNode.offsetWidth;
        sbViewableLength = sbHolderNode.style.posWidth;
        sbTrackLength = sbTrackNode.style.posWidth;
        sbTrackOffset = sbTrackNode.style.posLeft;
        sbHandleLength = sbHandleNode.style.posWidth;
    }
    sbTrackSpace = sbTrackLength - sbHandleLength;
    if (sbTrackSpace == 0) sbRatio = 1.0;
    else sbRatio = (sbTotalLength - sbViewableLength) / sbTrackSpace;
    sbMoveContent();
}

function sbClearEvents() {
    try {
        sbHandleNode.ondragstart = null;
        sbHandleNode.onmousedown = null;
        sbBarNode.onmousedown = null;
        sbUpNode.onmousedown = null;
        sbDownNode.onmousedown = null;
        sbTrackNode.onmousedown = null;
        sbBarNode.detachEvent("onmousedown", sbClick);
        sbBarNode.detachEvent("onmouseup", sbStop);
        sbTrackNode.detachEvent("onmouseup", sbStop);
        sbHandleNode.detachEvent("onmouseup", sbStop);
        sbUpNode.detachEvent("onmouseup", sbStop);
        sbDownNode.detachEvent("onmouseup", sbStop);
        document.detachEvent("onmouseup", sbStop);
        sbBarNode.detachEvent("onmousemove", sbDrag);
    } catch (e) { } 
}

function sbReset() {
    if (sbTimerId) clearInterval(sbTimerId);
    sbTimerId = null;
    sbTarget = null;
    sbHndPos = 0;
    sbConPos = 0;
    sbDistX = 0;
    sbDistY = 0;
    sbGrabPoint = 0;

    sbClearEvents();
     
    sbBarNode.attachEvent("onmousedown", sbClick);
    sbBarNode.attachEvent("onmouseup", sbStop);
    sbTrackNode.attachEvent("onmouseup", sbStop);
    sbHandleNode.attachEvent("onmouseup", sbStop);
    sbUpNode.attachEvent("onmouseup", sbStop);
    sbDownNode.attachEvent("onmouseup", sbStop);
    document.attachEvent("onmouseup", sbStop);
    
    sbHandleNode.ondragstart = sbondragstart;
    
    sbHandleNode.onmousedown = sbonmousedown;
    sbBarNode.onmousedown = sbonmousedown;
    sbUpNode.onmousedown = sbonmousedown;
    sbDownNode.onmousedown = sbonmousedown;
    sbTrackNode.onmousedown = sbonmousedown;

    sbHandleNode.style.top = "0px";
    sbHandleNode.style.left = "0px";    
    sbContentNode.style.top = "0px";
    sbContentNode.style.left = "0px";
    sbUpdateLength();
}

function sbOnUnload() {
    sbClearEvents();
    if (sbTimerId) clearInterval(sbTimerId);
    sbTimerId = 0;
    sbHolderNode = null;
    sbContentNode = null;
    sbBarNode = null;
    sbHandleNode = null;
    sbDownNode = null;
    sbUpNode = null;    
    sbTrackNode = null;
    sbTarget = null;
}
