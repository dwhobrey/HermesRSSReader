var ScrollWidth = null;

function SaveSource(s) {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var thefile = fso.CreateTextFile("D:\\hermesdetails.txt", true);
    thefile.write(s);
    thefile.close() 
}

function PlusOnClick(ev) {
    var w = (document.body.clientWidth - 20) * 1.2;
    var h = (document.body.clientHeight - 20) * 1.2;
    w &= w; h &= h;
    if(w>document.parentWindow.screen.width) w = document.parentWindow.screen.width-100;
    if(h>document.parentWindow.screen.height) h = document.parentWindow.screen.height-100;
    document.body.style.width = w + "px"; 
    document.body.style.height = h + "px";
    document.body.style.left = "0px";
    w = null;
    h = null;  
    ev = null;
}

function MinusOnClick(ev) {
    var w = (document.body.clientWidth - 20) * 0.8;
    var h = (document.body.clientHeight - 20) * 0.8;
    w &= w; h &= h;
    if(w<200) w = 200;
    if(h<200) h = 200;
    document.body.style.width = w + "px"; 
    document.body.style.height = h + "px";
    w = null;
    h = null;  
    ev = null;
}

function DetailsInit() {
    try {
        window.attachEvent("onload", DetailsSetup);
    } catch (e) {
        BugReport("DetailsInit exception: " + e.message);
    }
}

function DetailsSetup() {
    try {
        var pw = System.Gadget.document.parentWindow;
        pw.ScrollBusy = true;
        window.detachEvent("onload", DetailsSetup);
        window.attachEvent("onunload", DetailsClear);       
        document.getElementById("plus").onclick = PlusOnClick;
        document.getElementById("minus").onclick = MinusOnClick;
        if (pw.IsRightToLeft) document.body.dir = "rtl";
        document.getElementById("feedName").innerHTML = pw.DetailsFeedName;
        document.getElementById("itemTitle").innerHTML = pw.DetailsItemTitle;
        document.getElementById("itemContents").innerHTML = pw.DetailsItemDescription;
        document.getElementById("footer").innerHTML =
          "<br/><a href='" + pw.DetailsItemLink + "'>Link</a>"
         // + " <a href='javascript:SaveSource(pw.DetailsItemDescription)'>Save</a>"
          + "<br/>Categories:" + pw.DetailsItemCategories;
        document.getElementById("itemDate").innerHTML = pw.DetailsItemDate;
        // Test enough space for popup.
        var w = document.body.clientWidth;
        var s = window.screen.width;
        var sw = pw.document.body.clientWidth;
        var sl = pw.screenLeft;
        if( (sl<w) && ((s-sl-sw)<w) ) {
            ScrollWidth = pw.document.body.style.width;
            pw.document.body.style.width = (s - sl - w) + "px";
        }
        pw = null;
    } catch (e) {
        BugReport("DetailsSetup exception:" + e.message);
    }
}

function DetailsClear() {
    try {
        if(ScrollWidth!=null) {
            System.Gadget.document.body.style.width = ScrollWidth;
        }
        window.detachEvent("onunload", DetailsClear);
        document.getElementById("plus").onclick = null;
        document.getElementById("minus").onclick = null;       
    } catch (e) {
        BugReport("DetailsClear exception: " + e.message);
    }
    System.Gadget.document.parentWindow.ScrollBusy = false;
}

DetailsInit();
