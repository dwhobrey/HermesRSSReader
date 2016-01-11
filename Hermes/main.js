var StateUnread = 0;
var StateRead = 1;
var StateHide = 2;

var KindFeed = 0;
var KindPage = 1;
var KindAlert = 2;

var WindowHeight = 0;
var WindowWidth = 0;
var ScrollWidth = 0;
var ScrollHeight = 0;
var LineHeight = 0;
var NumLines = 0;
var WasMenuActivated = false;
var IsHorizontal = false;
var IsRightToLeft = false;
var ShowScrollBar = false;
var ShowHover = false;
var SearchCache = false;
var FilterByCategory = false;
var HideIfNone = false;
var ShowIfNew = false;
var FontSize = 0;
var BorderColor = "white";
var BackgroundColor = "black";
var BackgroundImage = "";
var ItemList = null;
var ItemListContainer = null;

var MouseOverFlag = false;
var ClearMouseOverFlag = false;
var AutoHideMenu = false;

var NowDateTicks = 0;
var ReadByTicks = 0;
var AgeOfItem = 0;
var FlagDuration = 0;
var KeepDuration = 0;
var FlushCache = false;

var HeartBeatOn = false;
var HeartBeatCount = 0;
var HeartBeatMax = 20;
var HeartBeat = null;
var LoadQueue = new Array();
var LoadIgnore = false;

var SettingId = 0;
var IsLoading = false;
var IsLoadingCount = 0;
var LoadingOn = false;
var LoadingIcon = null;
var LoadTickerId = null;
var ScrollTickerId = null;
var TimeOutId = null;
var ClickTimerId = null;
var ClickTarget = null;
var CtrlKey = null;
var ShiftKey = null;
var AltKey = null;
var AltLeft = null;

var ScrollBusy = false;
var ScrollRate = 50;
var ScrollEnabled = true;
var ScrollNode = null;
var ScrollPos = 0;
var NodeCount = 0;
var ClickOnHoverCount = 0;
var ClickOnHoverTicks = 0;

var SearchKeyWords = null;
var DetailsFeedName = null;
var DetailsItemTitle = null;
var DetailsItemDescription = null;
var DetailsItemCategories = null;
var DetailsItemLink = null;
var DetailsItemDate = null;

var Feeds = null;
var Cats = null;
var Folders = null;
var Filters = null;
var HasDuplicates = false;
var FeedCacheMap = null;

var CachePath = null;
var DefaultSettingsPath = null;
var CurrentSettingsPath = null;
var CurrentSettingsDoc = null;
var DOMDocumentProgID = null;
var ServerXMLHTTPProgID = null;
var XMLHTTPProgID = null;
var DOMDocumentProgIDs = new Array(
    "Msxml2.FreeThreadedDOMDocument.6.0",
    "Msxml2.DOMDocument.6.0",
    "Msxml2.FreeThreadedDOMDocument.4.0",
    "Msxml2.DOMDocument.4.0",
    "Msxml2.FreeThreadedDOMDocument.3.0",
    "Msxml2.DOMDocument.3.0"
    );
var XMLHTTPProgIDs = new Array(
    "Msxml2.XMLHTTP.6.0",
    "Msxml2.XMLHTTP.6.0",
    "Msxml2.XMLHTTP.4.0",
    "Msxml2.XMLHTTP.4.0",
    "Msxml2.XMLHTTP.3.0",
    "Msxml2.XMLHTTP.3.0"
);
var ServerXMLHTTPProgIDs = new Array(
    "Msxml2.ServerXMLHTTP.6.0",
    "Msxml2.ServerXMLHTTP.6.0",
    "Msxml2.ServerXMLHTTP.4.0",
    "Msxml2.ServerXMLHTTP.4.0",
    "Msxml2.ServerXMLHTTP.4.0",
    "Msxml2.ServerXMLHTTP.4.0"
);
var FeedsManager = null;

var SMTPServer = null;
var SMTPPort = null;
var SMTPUseSSL = null;
var SMTPUserName = null;
var SMTPPassword = null;
var FromAddress = null;
var SoundFile = null;
var DateDisplayFormat = null;

var SubVarRegExp = SetPattern("/\\$(?:\\d+|[\\*\\^\\$#FNcdfhlnptv])(?:/\\d+)?/g");
var LoadErrorMessage = "<br /> <br />"
+ "Error '<b>Access is denied</b>' is often produced when IE security level has disabled data access across domains."
+ " Fix by enabling IE: Internet Options / Security / Custom Level... / Miscellaneous / Access data sources across domains."
+ " Restart sidebar for option change to take effect.<br /> <br />"
+ "Error '<b>The system cannot locate the resource specified</b>' is produced when a connection to the destination"
+ " could not be established. This sometimes occurs when waking from a sleep state because the sidebar wakes up"
+ " before the network.<br /> <br />"
+ "Error '<b>DTD is prohibited</b>' is produced when IE thinks the feed's DTD is suspect."
+ " Hermes turns DTD prohibition off by default, so check IE security settings if this error occurs.<br />";

function GetSetting(path, defaultStr) {
    var val = defaultStr;
    try {
        var i = path.lastIndexOf("/");
        var node = CurrentSettingsDoc.selectSingleNode(path.substring(0, i));
        if (node != null) {
            val = node.getAttribute(path.substring(i + 1));
            if (val == null) val = defaultStr;
            node = null;
        }
        i = null;
    } catch (e) {
    }
    path = null;
    defaultStr = null;
    return val;
}

function Folder(name, textColor, includeFilter, excludeFilter) {
    this.name = name;
    this.textColor = textColor;
    this.includeFilter = includeFilter;
    this.excludeFilter = excludeFilter;
    name = null;
    textColor = null;
    includeFilter = null;
    excludeFilter = null;
}

function ClearFolder(f) {
    if (f != null) {
        f.name = null;
        f.textColor = null;
        f.includeFilter = null;
        f.excludeFilter = null;
        f = null;
    }
}

function filterHTML(s) {
    return ReplaceAll(s, 'src="//', 'src="http://');
}

function NewsItem(title, description, categories, link, pubDate, pubDateTicks, loadDateTicks, compareContent) {
    description = filterHTML(description);
    this.title = title;
    this.description = description;
    this.hash = (compareContent ? HashCode(title + description) : HashCode(title));
    this.categories = categories;
    this.link = link;
    this.pubDate = pubDate;
    this.pubDateTicks = pubDateTicks;
    this.loadDateTicks = loadDateTicks;
    this.actualDateTicks = loadDateTicks;
    this.state = StateUnread;
    this.hasPubDate = (pubDateTicks != loadDateTicks);
    title = null;
    description = null;
    categories = null;
    link = null;
    pubDate = null;
    pubDateTicks = null;
    loadDateTicks = null;
    compareContent = null;
}

function ClearItem(item) {
    if (item != null) {
        item.title = null;
        item.description = null;
        item.categories = null;
        item.link = null;
        item.pubDate = null;
        item.pubDateTicks = null;
        item.loadDateTicks = null;
        item.actualDateTicks = null;
        item.hash = null;
        item.state = null;
        item.hasPubDate = null;
        item = null;
    }
}

function HideItem(item) {
    item.state = StateHide;
    if (!SearchCache) {
        item.title = null;
        item.description = null;
        item.categories = null;
        item.link = null;
        item.pubDate = null;
    }
    item = null;
}

function ClearItems(list) {
    if (list != null) {
        for (var i = 0; i < list.length; i++) {
            ClearItem(list[i]);
            list[i] = null;
        }
        list = null;
    }
}

function LoadTicker() {
    if (((document.readyState == "complete") || (document.readyState == 4))) {
        if (IsLoading) {
            LoadingOn = !LoadingOn;
            LoadingIcon.style.display = (LoadingOn ? "block" : "none");
        } else if (IsLoadingCount > 0) {
            --IsLoadingCount;
            if (IsLoadingCount == 0) {
                LoadingIcon.style.display = "none";
            } else {
                LoadingOn = !LoadingOn;
                LoadingIcon.style.display = (LoadingOn ? "block" : "none");
            }
        } else if (ClearMouseOverFlag && MouseOverFlag && !document.hasFocus()) {
            ClearMouseOverFlag = false;
            MouseOverFlag = false;
        }
    }
}

function TickerState(isOn) {
    IsLoading = isOn;
    LoadingIcon.style.display = (isOn ? "block" : "none");
    LoadingIcon.style.left = (WindowWidth - 17) + "px";
    isOn = null;
}

function TickerCount(count) {
    IsLoadingCount = count;
    count = null;
}

function OnMouseOver(ev) {
    MouseOverFlag = true;
    ev = null;
}

function OnMouseOut(ev) {
    MouseOverFlag = false;
    sbShowState(false);
    ev = null;
}

function OnMouseMove(ev) {
    var targ = null;
    if (ev == null) ev = window.event;
    if (ev.target) targ = ev.target;
    else if (ev.srcElement) targ = ev.srcElement;

    while (targ.tagName != "body" && targ.parentNode != null) targ = targ.parentNode;

    if (ev.clientY < 10 && ev.clientX < (WindowWidth - 20)) {
        document.getElementById("toppanel").style.display = "block";
    }
    else if (ev.clientY > 20 || ev.clientX > (WindowWidth - 20)) {
        if (AutoHideMenu) {
            document.getElementById("toppanel").style.display = "none";
        }
    }

    if (IsHorizontal) {
        if (ShowScrollBar && ((10 + ev.clientY) > WindowHeight)) {
            sbShowState(true);
        } else {
            sbShowState(false);
        }
    } else {
        if (ShowScrollBar && (ev.clientX > (WindowWidth - 20))) {
            sbShowState(true);
        } else {
            sbShowState(false);
        }
    }
    targ = null;
    ev = null;
}

function HideMenu() {
    sbShowState(false);
    document.getElementById("toppanel").style.display = "none";
}

function SetWindowSize(windowSizeName) {
    var g = document.getElementById("imgbackground");
    var c = document.getElementById("mainholder");
    var h = ItemListContainer;
    if (BorderColor == "") BorderColor = "white";
    if (BackgroundColor == "") BackgroundColor = "black";
    var isClassic = (BorderColor == "white") && (BackgroundColor == "black");
    var isCustom = (ScrollWidth != 0) || (ScrollHeight != 0);
    var noImage = (BackgroundImage == "");
    var sbh = 10;

    sbDisabled = true;
    ScrollPos = 0;

    g.removeObjects();

    if (isCustom) {
        isClassic = false;
        var n = document.parentWindow.screen.width;
        if (ScrollWidth < 0) ScrollWidth = 0; if (ScrollWidth > n) ScrollWidth = n;
        n = document.parentWindow.screen.height;
        if (ScrollHeight < 0) ScrollHeight = 0; if (ScrollHeight > n) ScrollHeight = n;
    }

    if (IsHorizontal) {
        WindowHeight = 12 + FontSize;
        LineHeight = (FontSize * 1.2);
        LineHeight &= LineHeight;
        if ((LineHeight - FontSize) < 2) LineHeight = FontSize + 2;
        switch (windowSizeName) {
            case "small": WindowWidth = 130; break;
            case "medium": WindowWidth = (parseInt(document.parentWindow.screen.width) >> 1); break;
            default: WindowWidth = parseInt(document.parentWindow.screen.width) - 200; break;
        }
        if (isCustom) {
            if (ScrollWidth != 0) {
                WindowWidth = ScrollWidth;
            }
            if (ScrollHeight != 0) {
                WindowHeight = ScrollHeight;
            }
        }
        NumLines = (WindowHeight - 6) / LineHeight;
        NumLines &= NumLines; if (NumLines < 1) NumLines = 1;
        WindowHeight = 6 + NumLines * LineHeight;
        if (WindowWidth < 130) WindowWidth = 130;
        if (WindowHeight < 24) WindowHeight = 24;
        document.body.style.height = WindowHeight + "px";
        document.body.style.width = WindowWidth + "px";

        g.style.display = "block";
        g.style.height = WindowHeight + "px";
        g.style.width = WindowWidth + "px";
        g.style.top = "0px";
        g.style.left = "0px";
        if (noImage) {
            g.opacity = 0;
            g.src = "url(images/transparent.png)";
        } else {
            g.opacity = 100;
            g.src = "url(" + BackgroundImage + ")";
        }

        WindowHeight -= 2; WindowWidth -= 2;
        c.style.height = WindowHeight + "px";
        c.style.width = WindowWidth + "px";
        c.style.top = "0px";
        c.style.left = "0px";
        c.style.backgroundColor = (noImage ? BackgroundColor : "");
        c.style.border = "1px solid " + BorderColor;

        h.style.height = WindowHeight + "px";
        h.style.width = WindowWidth + "px";
        h.style.top = "0px";
        h.style.left = "0px";

        document.getElementById("toppanel").style.top = "2px";

        // Now the sb.
        sbBarNode.style.top = (WindowHeight - 2 - sbh) + "px";
        sbBarNode.style.left = "0px";
        sbBarNode.style.height = sbh + "px";
        sbBarNode.style.width = (WindowWidth - 2) + "px";

        sbTrackNode.style.top = "0px";
        sbTrackNode.style.left = "10px";
        sbTrackNode.style.height = sbh + "px";
        sbTrackNode.style.width = (WindowWidth - 2 - 2 * sbh) + "px";

        sbHandleNode.style.height = sbh + "px";
        sbHandleNode.style.width = (2 * sbh) + "px";

        sbDownNode.style.top = "0px";
        sbDownNode.style.left = (WindowWidth - 2 - sbh) + "px";
        sbDownNode.innerHTML = "&gt;";
        sbUpNode.innerHTML = "&lt;";
    } else {
        WindowWidth = 130;
        switch (windowSizeName) {
            case "small": WindowHeight = 130; break;
            case "medium": WindowHeight = 197; break;
            default: WindowHeight = 260; break;
        }
        if (isCustom) {
            if (ScrollWidth != 0) {
                WindowWidth = ScrollWidth;
            }
            if (ScrollHeight != 0) {
                WindowHeight = ScrollHeight;
            }
        }
        if (WindowWidth < 130) WindowWidth = 130;
        if (WindowHeight < 50) WindowHeight = 50;

        document.body.style.width = WindowWidth + "px";
        document.body.style.height = WindowHeight + "px";

        g.style.height = WindowHeight + "px";
        g.style.width = WindowWidth + "px";

        if (isClassic) {
            g.opacity = 100;
            if (noImage) {
                g.src = "url(images/background" + WindowHeight + ".png)";
            } else {
                g.src = "url(" + BackgroundImage + ")";
            }
            c.style.top = "0px";
            c.style.left = "0px";
            c.style.backgroundColor = "";
            c.style.border = "0px";
            document.getElementById("toppanel").style.top = "4px";
        } else {
            if (noImage) {
                g.opacity = 0;
                g.src = "url(images/transparent.png)";
            } else {
                g.opacity = 100;
                g.src = "url(" + BackgroundImage + ")";
            }
            c.style.top = "0px";
            c.style.left = "0px";
            if (noImage) {
                c.style.backgroundColor = BackgroundColor;
                c.style.border = "1px solid " + BorderColor;
            } else {
                c.style.backgroundColor = "";
            }
            document.getElementById("toppanel").style.top = "2px";
        }

        WindowHeight -= 2; WindowWidth -= 2;
        c.style.height = WindowHeight + "px";
        c.style.width = WindowWidth + "px";

        h.style.height = (WindowHeight - 4) + "px";
        h.style.width = (WindowWidth - 4) + "px";
        h.style.top = "4px";
        h.style.left = "4px";
        document.getElementById("itemlistdiv").style.width = (WindowWidth - 3) + "px";

        // Now the sb.
        sbBarNode.style.top = "4px";
        sbBarNode.style.left = (WindowWidth - (isCustom ? 2 : 0) - sbh) + "px";
        sbBarNode.style.height = (WindowHeight - 6) + "px";
        sbBarNode.style.width = sbh + "px";

        sbTrackNode.style.top = "10px";
        sbTrackNode.style.left = "0px";
        sbTrackNode.style.height = ((WindowHeight - 6) - 2 * sbh) + "px";
        sbTrackNode.style.width = sbh + "px";

        sbHandleNode.style.height = (2 * sbh) + "px";
        sbHandleNode.style.width = sbh + "px";

        sbDownNode.style.top = (WindowHeight - 6 - sbh) + "px";
        sbDownNode.style.right = null;
        sbDownNode.style.left = "0px";
        sbDownNode.innerHTML = "&or;";
        sbUpNode.innerHTML = "&and;";
    }

    g.softedge = 0;
    g.blur = 0;
    g.brightness = 0;

    g = null;
    c = null;
    h = null;
    isClassic = null;
    windowSizeName = null;
    System.Shell.refreshDesktop();
}

function SetContrast(node, name) {
    var contrast = 50;
    try {
        contrast = parseInt(GetSetting("/data/display/" + name, "50"));
    } catch (e) { }
    if (contrast < 0) contrast = 0;
    else if (contrast > 100) contrast = 100;
    node.style.filter = "Alpha(Opacity=" + contrast + ")";
    node = null;
    name = null;
}

function SetScrollbarColors() {
    SetContrast(sbBarNode, "transparency");
    var c = GetSetting("/data/display/scrollbarcolor", "lightgrey");
    var b = GetSetting("/data/display/bordercolor", "Black");
    var t = GetSetting("/data/display/textcolor", "White");
    sbTrackNode.style.backgroundColour = c;
    sbHandleNode.style.borderColor = b;
    sbUpNode.style.borderColor = b;
    sbDownNode.style.borderColor = b;
    sbUpNode.style.color = t;
    sbDownNode.style.color = t;

    if (!ConvertColorToRGB(c)) {
        ConvertColorToRGB("lightgrey");
    }
    rgbToHsl();
    var l = rgbL, s = rgbS;
    var lo, hi;
    if (l > 0.5) { lo = l - 0.2; hi = l - 0.4; }
    else { lo = l + 0.2; hi = l + 0.4; }
    rgbL = lo;
    hslToRgb(); sbLoColor = rgbToHex();
    rgbL = hi;
    hslToRgb(); sbHiColor = rgbToHex();

    sbHandleNode.style.backgroundColour = sbLoColor;
    sbUpNode.style.backgroundColour = sbLoColor;
    sbDownNode.style.backgroundColour = sbLoColor;

    b = null;
    c = null;
    t = null;
}

function SetupScrollbar() {
    sbHolderNode = ItemListContainer;
    sbContentNode = ItemListContainer.firstChild;
    sbReset();
    sbShowState(false);
    SetScrollbarColors();
}

function SaveWindowSize(windowSizeName) {
    CurrentSettingsDoc.selectSingleNode("/data/display").setAttribute("windowsize") = windowSizeName;
    SetWindowSize(windowSizeName);
    SetupScrollbar();
    windowSizeName = null;
}

function ShowInFlyout(item, feedId) {
    try {
        DetailsFeedName = Feeds[feedId].name;
        DetailsItemTitle = item.title;
        DetailsItemDescription = item.description;
        DetailsItemCategories = item.categories;
        DetailsItemLink = item.link;
        DetailsItemDate = (item.hasPubDate ? "" : "? ") + item.pubDate;
        System.Gadget.Flyout.file = "details.html";
        if (!System.Gadget.Flyout.Show)
            System.Gadget.Flyout.show = true;
        feedId = null;
        item = null
    } catch (e) {
        BugReport("ShowInFlyout exception:" + e.message);
    }
}

function DisplaySearchWindow(ev) {
    System.Gadget.Flyout.file = "search.html";
    System.Gadget.Flyout.show = true;
    ev = null;
}

function SearchKeyWordsMatch(item) {
    var flag = false;
    if (SearchKeyWords != null) {
        try {
            var tmp = item.title;
            var title = (tmp ? tmp.toLowerCase() : null);
            tmp = item.description;
            var description = (tmp ? tmp.toLowerCase() : null);
            for (var i = 0; i < SearchKeyWords.length; i++) {
                tmp = SearchKeyWords[i];
                if ((title != null && (title.indexOf(tmp) >= 0)) || (description != null && (description.indexOf(tmp) >= 0))) {
                    flag = true;
                    break;
                }
            }
            description = null;
            title = null;
            tmp = null;
        }
        catch (e) {
            BugReport("SearchKeyWordsMatch exception:" + e.message);
        }
    }
    item = null;
    return flag;
}

function UpdateSearchMarks() {
    var node = ItemList.firstChild;
    while (node != null) {
        try {
            var item = Feeds[parseInt(node.getAttribute("feedid"))].items[parseInt(node.getAttribute("itemid"))];
            if (item != null) {
                if (SearchKeyWordsMatch(item)) {
                    if (node.className.indexOf("matchSearchRssItem") < 0) {
                        node.className += " matchSearchRssItem";
                    }
                } else {
                    if (node.className.indexOf("matchSearchRssItem") >= 0) {
                        node.className = node.className.replace(" matchSearchRssItem", "");
                    }
                }
                item = null;
            }
        } catch (e) {
        }
        node = node.nextSibling;
    }
}

function RemoveReadMarks(feedIdx) {
    var node = ItemList.firstChild;
    while (node != null) {
        var feedId = parseInt(node.getAttribute("feedid"));
        if (feedIdx < 0 || (feedIdx == feedId)) {
            var markNode = node.firstChild;
            if (markNode != null && markNode.className.indexOf("newItemMark") >= 0) {
                node.removeChild(markNode);
                markNode = null;
                node.className = node.className.replace("newRssItem", "");
                var item = Feeds[feedId].items[parseInt(node.getAttribute("itemid"))];
                if (item.state == StateUnread) item.state = StateRead;
                item = null;
            }
            markNode = null;
        }
        feedId = null;
        node = node.nextSibling;
    }
    feedIdx = null;
}

function RemoveSingleItem(node) {
    if (node != null) {
        try {
            var k = node.childNodes.length;
            while (k-- > 0) {
                node.removeChild(node.lastChild);
            }
            var nextChild = node.nextSibling;
            if (node.getAttribute("dividerline")) {
                if (nextChild == null) nextChild = ItemList.firstChild;
                if (nextChild != null) {
                    var txt = "1px solid " + GetSetting("/data/display/dividercolor", "grey");
                    if (IsHorizontal) {
                        nextChild.style.borderRight = txt;
                    } else {
                        nextChild.style.borderTop = txt;
                    }
                    txt = null;
                    nextChild.setAttribute("dividerline", "true");
                }
                node.removeAttribute("dividerline");
            }
            node.onmouseover = null;
            node.onmouseout = null;
            node.onclick = null;

            var f = Feeds[parseInt(node.getAttribute("feedid"))];
            if (f.kindCode == KindAlert) {
                try {
                    f.items[parseInt(node.getAttribute("itemid"))] = null;
                } catch (e) {
                }
            }
            f = null;
            node.removeAttribute("feedid");
            node.removeAttribute("itemid");
            node.removeAttribute("ticks");
            ItemList.removeChild(node);
            nextChild = null;
            k = null;
            document.getElementById("itemhovercontainer").style.display = "none";
        } catch (e) {
            BugReport("RemoveSingleItem exception: " + e.message);
        }
        node = null;
    }
}

function RemoveItems(feedIdx, hide) {
    ScrollNode = null;
    if (ItemList != null) {
        var node = ItemList.lastChild;
        while (node != null) {
            var tmp = node.previousSibling;
            var feedId = parseInt(node.getAttribute("feedid"));
            if ((feedIdx < 0) || (feedIdx == feedId)) {
                if (hide) {
                    HideItem(Feeds[feedId].items[parseInt(node.getAttribute("itemid"))]);
                }
                RemoveSingleItem(node);
            }
            feedId = null;
            node = tmp;
            tmp = null;
        }
    }
    feedIdx = null;
    hide = null;
}

function ItemOnMouseOver(ev) {
    ClickTarget = null;
    if (ev == null) ev = window.event;
    CtrlKey = ev.ctrlKey;
    ShiftKey = ev.shiftKey;
    AltKey = ev.altKey;
    AltLeft = ev.altLeft;

    if (ev.target != null) ClickTarget = ev.target;
    else if (ev.srcElement != null) ClickTarget = ev.srcElement;
    if (ClickTarget.className != null) {
        while (ClickTarget.className.indexOf("rssItem") < 0) ClickTarget = ClickTarget.parentNode;
        if (ClickTarget.className.indexOf("newRssItem") >= 0) {
            if (ClickTarget.className.indexOf("matchSearchRssItem") >= 0)
                ClickTarget.className = "rssItem rssItemHover newRssItem matchSearchRssItem";
            else
                ClickTarget.className = "rssItem rssItemHover newRssItem";
        }
        else {
            if (ClickTarget.className.indexOf("matchSearchRssItem") >= 0)
                ClickTarget.className = "rssItem rssItemHover matchSearchRssItem";
            else
                ClickTarget.className = "rssItem rssItemHover";
        }

        if (ShowHover) {
            var feedId = parseInt(ClickTarget.getAttribute("feedid"));
            var itemHoverContainer = document.getElementById("itemhovercontainer");
            var itemHover = itemHoverContainer.getElementsByTagName("span")[0];
            var item = Feeds[feedId].items[parseInt(ClickTarget.getAttribute("itemid"))];
            itemHover.innerHTML = Feeds[feedId].name + "<br/>" + item.pubDate;
            itemHoverContainer.style.display = "block";
            if (IsHorizontal) {
                itemHoverContainer.style.width = "160px";
                itemHoverContainer.style.top = "-2px";
                if (ev.clientX > (WindowWidth / 2)) {
                    itemHoverContainer.style.left = "4px";
                } else {
                    itemHoverContainer.style.left = (WindowWidth - itemHoverContainer.clientWidth - 4) + "px";
                }
            } else {
                itemHoverContainer.style.width = "130px";
                itemHoverContainer.style.left = "0px";
                if (ev.clientY > (WindowHeight / 2)) {
                    itemHoverContainer.style.top = "4px";
                } else {
                    itemHoverContainer.style.top = (WindowHeight - 44) + "px";
                }
            }
            item = null;
            itemHover = null;
            itemHoverContainer = null;
            feedId = null;
        }
    }
    ev = null;
    ClickOnHoverCount = ClickOnHoverTicks;
}

function ItemOnMouseOut(ev) {
    ClickOnHoverCount = 0;
    var targ = GetTarget(ev);
    while (targ.className.indexOf("rssItem") < 0) targ = targ.parentNode;
    if (targ.className.indexOf("newRssItem") >= 0) {
        if (targ.className.indexOf("matchSearchRssItem") >= 0)
            targ.className = "rssItem newRssItem matchSearchRssItem";
        else
            targ.className = "rssItem newRssItem";
    } else {
        if (targ.className.indexOf("matchSearchRssItem") >= 0)
            targ.className = "rssItem matchSearchRssItem";
        else
            targ.className = "rssItem";
    }
    document.getElementById("itemhovercontainer").style.display = "none";
    targ = null;
    ev = null;
}

function ItemOnClick(ev) {
    ClickOnHoverCount = 0;
    if (ev == null) ev = window.event;
    CtrlKey = ev.ctrlKey;
    ShiftKey = ev.shiftKey;
    AltKey = ev.altKey;
    AltLeft = ev.altLeft;
    if (ClickTimerId != null) {
        if (!ev.ctrlKey) {
            clearTimeout(ClickTimerId);
            ClickTimerId = null;
            ClickTarget = null;
            ItemOnDoubleClick(ev);
        }
    } else {
        ClickTimerId = setTimeout(ItemOnSingleClick, 1000);
    }
    ev = null;
}

function ItemHandleClick(item, targ, feedId) {
    try {
        if (item.state == StateUnread) item.state = StateRead;
        var markNode = targ.firstChild;
        if (markNode != null && markNode.className.indexOf("newItemMark") >= 0) {
            if (ShiftKey || GetSetting("/data/options/clicktoremoveflag", "true") == "true") {
                targ.removeChild(markNode);
                targ.className = targ.className.replace("newRssItem", "");
            }
        }
        markNode = null;
        if (!ShiftKey && !CtrlKey) {
            if (GetSetting("/data/options/clicktosetreadbydate", "true") == "true") {
                var pubDateTicks = item.pubDateTicks;
                if (item.hasPubDate && (pubDateTicks > ReadByTicks)) {
                    ReadByTicks = pubDateTicks;
                }
                pubDateTicks = null;
            }
        }
        if (ShiftKey) {
            if (AltLeft) RemoveReadMarks(-1);
            else if (AltKey) RemoveReadMarks(feedId);
        } else if (CtrlKey || GetSetting("/data/options/hideifread", "true") == "true") {
            HideItem(item);
            RemoveSingleItem(targ);
            if (AltLeft) RemoveItems(-1, true);
            else if (AltKey) RemoveItems(feedId, true);
            sbUpdateLength();
        }
    } catch (e) {
        BugReport("ItemHandleClick exception:" + e.message);
    }
    item = null;
    targ = null;
    feedId = null;
}

function ItemOnDoubleClick(ev) {
    try {
        var targ = GetTarget(ev);
        while (targ.className.indexOf("rssItem") < 0) targ = targ.parentNode;
        var feedId = parseInt(targ.getAttribute("feedid"));
        var item = Feeds[feedId].items[parseInt(targ.getAttribute("itemid"))];
        System.Gadget.Flyout.show = false;
        System.Shell.execute(item.link);
        ItemHandleClick(item, targ, feedId);
        item = null;
        feedId = null;
        targ = null;
    } catch (e) {
        BugReport("ItemOnDoubleClick exception:" + e.message);
    }
    ev = null;
}

function ItemOnSingleClick() {
    try {
        clearTimeout(ClickTimerId);
        ClickTimerId = null;
        while (ClickTarget.className.indexOf("rssItem") < 0) ClickTarget = ClickTarget.parentNode;
        var feedId = parseInt(ClickTarget.getAttribute("feedid"));
        var item = Feeds[feedId].items[parseInt(ClickTarget.getAttribute("itemid"))];
        if (!CtrlKey && !ShiftKey) {
            ShowInFlyout(item, feedId);
        }
        ItemHandleClick(item, ClickTarget, feedId);
        item = null;
        feedId = null;
        ClickTarget = null;
    } catch (e) {
        BugReport("ItemOnSingleClick exception:" + e.message);
    }
}

function ItemOnHover() {
    try {
        var feedId = parseInt(ClickTarget.getAttribute("feedid"));
        var item = Feeds[feedId].items[parseInt(ClickTarget.getAttribute("itemid"))];
        if (!CtrlKey && !ShiftKey) {
            // DEBUG: flyout doesn't always show for some reason.
            ShowInFlyout(item, feedId);
        }
        ItemHandleClick(item, ClickTarget, feedId);
        item = null;
        feedId = null;
        ClickTarget = null;
    } catch (e) {
        BugReport("ItemOnHover exception:" + e.message);
    }
}

function InsertBreaks(s) {
    if (s != null) {
        var n = s.length, m = NumLines - 1;
        var w = n / NumLines; w &= w; ++w;
        var i, j, k = w, p = 0, c = 0;
        while (k < n) {
            i = k;
            while ((i < n) && (s.charAt(i) != ' ')) ++i;
            j = k;
            while ((j >= p) && (s.charAt(j) != ' ')) --j;
            if ((j > p) && ((k - j) <= (i - k))) {
                i = j;
            }
            if ((i < n) && (c < m)) {
                s = s.substring(0, i) + "<br/>" + s.substring(i + 1);
                ++c;
                i += 5;
                n += 4;
            }
            p = i;
            k = i + w;
        }
        if ((c == 0) && (w < n)) {
            k = w;
            while (k < n) {
                s = s.substring(0, k) + "<br/>" + s.substring(k);
                k += w + 5;
                n += 5;
            }
        }
    }
    return s;
}

function RedrawFeed(feedIdx, addIdx) {
    try {
        var scrolltextcolor = GetSetting("/data/display/textcolor", "grey");
        var scrolllinecolor = GetSetting("/data/display/linecolor", "grey");
        var scrolldividercolor = GetSetting("/data/display/dividercolor", "grey");
        var scrollfontFamily = GetSetting("/data/display/fontfamily", "Verdana");
        var scrollfontWeight = GetSetting("/data/display/fontweight", "normal");
        var hasLine = (GetSetting("/data/display/lineseparator", "true") == "true");
        var sortByDate = (GetSetting("/data/options/sortbydate", "false") == "true");
        var sortByLoad = (GetSetting("/data/options/sortbyload", "false") == "true");
        var sortMode = sortByDate || sortByLoad;

        var f = Feeds[feedIdx];
        var feedColor = ((f.feedColor.length > 0) ? f.feedColor : scrolltextcolor);
        var displayName = f.displayNameFlag;
        var addFeedLine = true;
        var insertPosition = null;
        var youngest = null;
        var youngestTicks = 0;
        var next = null;
        var t = null;
        var num = ItemList.childNodes.length;
        var rtl = IsHorizontal && IsRightToLeft;
        var a, b;
        if (rtl) { a = ItemList.lastChild; b = ItemList.firstChild; }
        else { a = ItemList.firstChild; b = ItemList.lastChild; }
        if (num == 0) {
            ScrollPos = 0;
        } else {
            if (sortMode) { // Find newest item to insert before.
                insertPosition = a;
                youngestTicks = parseInt(insertPosition.getAttribute("ticks"));
                next = rtl ? insertPosition.previousSibling : insertPosition.nextSibling;
                if (hasLine) {
                    while (next != null) {
                        if (next.getAttribute("dividerline")) {
                            insertPosition = next;
                            youngestTicks = parseInt(next.getAttribute("ticks"));
                            break;
                        }
                        next = rtl ? next.previousSibling : next.nextSibling;
                    }
                } else {
                    while (next != null) {
                        t = parseInt(next.getAttribute("ticks"));
                        if (t > youngestTicks) {
                            insertPosition = next;
                            youngestTicks = t;
                        }
                        next = rtl ? next.previousSibling : next.nextSibling;
                        t = null;
                    }
                    next = b;
                    while (next != null && parseInt(next.getAttribute("ticks")) == youngestTicks) {
                        insertPosition = next;
                        next = rtl ? next.nextSibling : next.previousSibling;
                    }
                    next = null;
                }
                youngest = insertPosition;
            } else if (num > 1) {
                var insertAnywhere = true;
                if (addIdx > 0) { // Find end of feed to append item to.
                    next = a;
                    var isFirst = true;
                    while (next != null) {
                        if (parseInt(next.getAttribute("feedid") == feedIdx)) {
                            t = parseInt(next.getAttribute("ticks"));
                            if (isFirst) {
                                isFirst = false;
                                youngest = next;
                                youngestTicks = t
                            } else {
                                if (t > youngestTicks) {
                                    youngest = next;
                                    youngestTicks = t;
                                }
                            }
                        } else if (!isFirst) break;
                        next = rtl ? next.previousSibling : next.nextSibling;
                    }
                    next = null;
                    youngestTicks = null;
                    if (youngest != null) {
                        insertPosition = youngest.nextSibling;
                        insertAnywhere = false;
                        youngest = null;
                    }
                }
                if (insertAnywhere) { // Find the start of a feed to insert before.
                    var lastFeedId = parseInt(b.getAttribute("feedid"));
                    var curNode = a;
                    var curFeedId = parseInt(curNode.getAttribute("feedid"));
                    if (curFeedId == lastFeedId) {
                        var curItemId = parseInt(curNode.getAttribute("itemid"));
                        next = rtl ? curNode.previousSibling : curNode.nextSibling;
                        while (next != null) {
                            var nextFeedId = parseInt(next.getAttribute("feedid"));
                            var nextItemId = parseInt(next.getAttribute("itemid"));
                            if (nextFeedId != curFeedId || nextItemId < curItemId) {
                                insertPosition = next;
                                nextFeedId = null;
                                nextItemId = null;
                                break;
                            }
                            nextFeedId = null;
                            nextItemId = null;
                            next = rtl ? next.previousSibling : next.nextSibling;
                        }
                        next = null;
                        curItemId = null;
                    }
                    curFeedId = null;
                    curNode = null;
                    lastFeedId = null;
                }
            }
        }
        var start = 0;
        var end = f.items.length;
        if (addIdx >= 0) {
            start = addIdx;
            end = start + 1;
        }
        for (var j = start; j < end; j++) {
            var item = f.items[j];
            var state = item.state;

            if (state != StateHide) {
                var itemTicks = sortByDate ? item.pubDateTicks : item.loadDateTicks;
                var q = document.createElement(IsHorizontal ? "td" : "div");
                q.id = "N" + ++NodeCount;
                q.setAttribute("feedid", "" + feedIdx);
                q.setAttribute("itemid", "" + j);
                q.setAttribute("ticks", "" + itemTicks);
                q.className = "rssItem ";
                if (IsHorizontal) {
                    q.style.display = "table-cell";
                    q.style.padding = "1px 3px 2px 3px";
                    q.style.whiteSpace = "nowrap";
                    q.style.lineHeight = LineHeight + "px";
                } else {
                    q.style.display = "block";
                    q.style.padding = "3px 1px 3px 1px";
                }

                if (state == StateUnread) {
                    q.className += "newRssItem";
                    var imp = document.createElement("span");
                    imp.innerHTML = "";
                    imp.className = "newItemMark";
                    imp.style.display = "block";
                    //X    imp.id = NowDateTicks; //?
                    if (IsHorizontal) {
                        q.style.backgroundPosition = "2px 5px";
                    }
                    q.appendChild(imp);
                    imp = null;
                }

                if (hasLine) {
                    if (addFeedLine && (!sortMode || (itemTicks >= youngestTicks))) {
                        if (sortMode && youngest != null) {
                            youngest.removeAttribute("dividerline");
                            if (IsHorizontal) {
                                youngest.style.borderRight = "2px solid " + scrolllinecolor;
                            } else {
                                youngest.style.borderTop = "1px solid " + scrolllinecolor;
                            }
                        }
                        q.setAttribute("dividerline", "true");
                        if (IsHorizontal) {
                            q.style.borderRight = "2px solid " + scrolldividercolor;
                        } else {
                            q.style.borderTop = "1px solid " + scrolldividercolor;
                        }
                        addFeedLine = false;
                    } else {
                        if (IsHorizontal) {
                            q.style.borderRight = "2px solid " + scrolllinecolor;
                        } else {
                            q.style.borderTop = "1px solid " + scrolllinecolor;
                        }
                    }
                }

                if (SearchKeyWordsMatch(item)) {
                    q.className += " matchSearchRssItem";
                }

                q.onclick = ItemOnClick;
                q.onmouseover = ItemOnMouseOver;
                q.onmouseout = ItemOnMouseOut;

                var text = document.createElement("div");
                text.style.fontFamily = scrollfontFamily;
                text.style.fontSize = FontSize;
                text.style.color = feedColor;
                text.style.fontWeight = scrollfontWeight;
                q.appendChild(text);

                if (displayName && !IsHorizontal) {
                    var feedname = document.createElement("div");
                    feedname.className = "itemFeedName";
                    feedname.style.padding = "0px 0px 2px 0px";
                    feedname.style.margin = "0px 0px 2px 0px";
                    feedname.style.borderBottom = "1px dashed " + feedColor;
                    feedname.innerHTML = f.name;
                    text.appendChild(feedname);
                    feedname = null;
                }

                var bread = document.createElement("div");
                bread.style.padding = "0px";
                bread.style.margin = "0px";
                bread.innerHTML = (IsHorizontal && (NumLines > 1)) ? InsertBreaks(item.title) : item.title;
                text.appendChild(bread);
                bread = null;
                text = null;

                if (sortMode) {
                    while (insertPosition != null) {
                        if (itemTicks >= parseInt(insertPosition.getAttribute("ticks"))) {
                            if (rtl) {
                                if (insertPosition.nextSibling == null) {
                                    ItemList.appendChild(q);
                                } else {
                                    ItemList.insertBefore(q, insertPosition.nextSibling);
                                }
                            } else {
                                ItemList.insertBefore(q, insertPosition);
                            }
                            break;
                        }
                        insertPosition = rtl ? insertPosition.previousSibling : insertPosition.nextSibling;
                        if (insertPosition == null && youngest != null) {
                            insertPosition = rtl ? ItemList.lastChild : ItemList.firstChild;
                            youngest = null;
                        }
                    }
                    if (insertPosition == null) {
                        if (rtl && ItemList.firstChild != null) {
                            ItemList.insertBefore(q, ItemList.firstChild);
                        } else {
                            ItemList.appendChild(q);
                        }
                    }
                    insertPosition = q;
                } else if (insertPosition != null) {
                    if (rtl) {
                        if (insertPosition.nextSibling == null) {
                            ItemList.appendChild(q);
                        } else {
                            ItemList.insertBefore(q, insertPosition.nextSibling);
                        }
                    } else {
                        ItemList.insertBefore(q, insertPosition);
                    }
                } else {
                    if (rtl && ItemList.firstChild != null) {
                        ItemList.insertBefore(q, ItemList.firstChild);
                    } else {
                        ItemList.appendChild(q);
                    }
                }
                q = null;
                itemTicks = null;
            }
            state = null;
            item = null;
        }
        scrolltextcolor = null;
        scrolllinecolor = null;
        scrolldividercolor = null;
        scrollfontFamily = null;
        scrollfontWeight = null;
        hasLine = null;
        sortByDate = null;
        sortByLoad = null;
        sortMode = null;
        f = null;
        feedColor = null;
        displayName = null;
        addFeedLine = null;
        insertPosition = null;
        youngest = null;
        youngestTicks = null;
        numItems = null;
        a = null;
        b = null;
        rtl = null;
    } catch (e) {
        BugReport("RedrawFeed exception: " + e.message);
    }
    feedIdx = null;
}

function VerticalScrollPosition() {
    if (ItemList) {
        //var noScroll = (!ScrollEnabled) || (WindowHeight > ItemList.clientHeight);
        var noScroll = (WindowHeight > ItemList.clientHeight);
        ItemList.style.top = (noScroll ? 0 : (sbYPos + ScrollPos)) + "px";
        ItemList.style.left = "0px";
    }
}

// Needs to be as efficient as possible.
function VerticalScrollTicker() {
    var noScroll, child, node, f, item, itemdateloadedticks, markNode, pubTicks, wasChange,p,i;
    if (!((document.readyState == "complete") || (document.readyState == 4))) return;
    if (ClickOnHoverCount > 0) {
        --ClickOnHoverCount;
        if (ClickOnHoverCount == 0) {
            ItemOnHover();
        }
    }
    if (ScrollBusy || MouseOverFlag) return;
    ScrollBusy = true;
    noScroll = true;
    child = ItemList.firstChild;
    if (child != null) {
        noScroll = (!ScrollEnabled) || (WindowHeight > ItemList.clientHeight);
        ScrollPos--;
        if ((ScrollPos + child.offsetTop + child.offsetHeight) <= 0) {
            if (noScroll) {
                if (ScrollNode != null) {
                    node = child;
                    while (node != null) {
                        if (node.id == ScrollNode.id) {
                            node = node.nextSibling;
                            break;
                        }
                        node = node.nextSibling;
                    }
                    if (node != null) {
                        child = node;
                        node = null;
                    }
                }
                ScrollNode = child;
            }
            f = Feeds[parseInt(child.getAttribute("feedid"))];
            item = f.items[parseInt(child.getAttribute("itemid"))];
            if (item != null) {
                itemdateloadedticks = item.loadDateTicks;
                NowDateTicks = CurrentTicks();
                if (FlagDuration > 0 && ((NowDateTicks - itemdateloadedticks) > FlagDuration)) {
                    item.state = StateRead;
                    markNode = child.firstChild;
                    if (markNode != null && markNode.className.indexOf("newItemMark") >= 0) {
                        child.removeChild(markNode);
                        child.className = child.className.replace("newRssItem", "");
                    }
                    markNode = null;
                }
                pubTicks = item.pubDateTicks;
                if (f.applyRulesFlag && (
                        (KeepDuration > 0 && ((NowDateTicks - itemdateloadedticks) > KeepDuration))
                        || (AgeOfItem > 0 && ((NowDateTicks - pubTicks) > AgeOfItem))
                        || (ReadByTicks > 0 && (pubTicks <= ReadByTicks))
                        )
                    ) {
                    HideItem(item);
                    RemoveSingleItem(child);
                    sbUpdateLength();
                } else if (!noScroll) {
                    ItemList.removeChild(child);
                    ItemList.appendChild(child);
                }
                pubTicks = null;
                itemdateloadedticks = null;
                item = null;
            }
            f = null;
            ScrollPos = 0;
        }
        ItemList.style.top = (noScroll ? 0 : (sbYPos + ScrollPos)) + "px";
        ItemList.style.left = "0px";
        child = null;
    }
    if (noScroll) {
        if (HeartBeatCount == 0) {
            HeartBeatOn = !HeartBeatOn;
            HeartBeat.style.display = (HeartBeatOn ? "block" : "none");
            HeartBeat.style.left = (WindowWidth - 17) + "px";
            document.getElementById("itemhovercontainer").style.display = "none";
        }
    } else {
        HeartBeatOn = false;
        HeartBeat.style.display = "none";
    }
    if (++HeartBeatCount > HeartBeatMax) {
        HideMenu();
        HeartBeatCount = 0;
        if (Feeds != null && !LoadIgnore) {
            NowDateTicks = CurrentTicks();
            wasChange = false;
            while (LoadQueue.length > 0) {
                p = LoadQueue[0];
                LoadQueue.splice(0, 1);
                if (p.value == SettingId) {
                    wasChange |= LoadHandler(p.key);
                }
                p = null;
            }
            for (i = 0; i < Feeds.length; i++) {
                f = Feeds[i];
                if ((NowDateTicks - f.updated) > f.interval) {
                    LoadFeed(f);
                }
                f = null;
            }
            if (wasChange) sbUpdateLength();
        }
    }
    noScroll = null;
    ScrollBusy = false;
}

function HorizontalScrollPosition() {
    if (ItemList) {
        //var noScroll = (!ScrollEnabled) || (WindowWidth > ItemList.clientWidth);
        var noScroll = (WindowWidth > ItemList.clientWidth);
        var ta = document.getElementById("itemlisttable");
        if (ta) {
            if (IsRightToLeft) {
                ta.style.left = ((WindowWidth - ta.clientWidth) - (noScroll ? 0 : (sbXPos + ScrollPos))) + "px";
            } else {
                ta.style.left = (noScroll ? 0 : (sbXPos + ScrollPos)) + "px";
            }
            ta.style.top = "0px";
        }
        ta = null;
    }
}

function HorizontalScrollTicker() {
    if (!((document.readyState == "complete") || (document.readyState == 4))) return;
    if (ClickOnHoverCount > 0) {
        --ClickOnHoverCount;
        if (ClickOnHoverCount == 0) {
            ItemOnHover();
        }
    }
    if (ScrollBusy || MouseOverFlag) return;
    ScrollBusy = true;
    var noScroll = true;
    var child = IsRightToLeft ? ItemList.lastChild : ItemList.firstChild;
    if (child != null) {
        noScroll = (!ScrollEnabled) || (WindowWidth > ItemList.clientWidth);
        ScrollPos--;
        if ((ScrollPos + child.offsetLeft + child.offsetWidth) <= 0) {
            if (noScroll) {
                if (ScrollNode != null) {
                    var node = child;
                    while (node != null) {
                        if (node.id == ScrollNode.id) {
                            node = IsRightToLeft ? node.previousSibling : node.nextSibling;
                            break;
                        }
                        node = IsRightToLeft ? node.previousSibling : node.nextSibling;
                    }
                    if (node != null) {
                        child = node;
                        node = null;
                    }
                }
                ScrollNode = child;
            }

            var f = Feeds[parseInt(child.getAttribute("feedid"))];
            var item = f.items[parseInt(child.getAttribute("itemid"))];
            if (item != null) {
                var itemdateloadedticks = item.loadDateTicks;
                NowDateTicks = CurrentTicks();
                if (FlagDuration > 0 && ((NowDateTicks - itemdateloadedticks) > FlagDuration)) {
                    item.state = StateRead;
                    var markNode = child.firstChild;
                    if (markNode != null && markNode.className.indexOf("newItemMark") >= 0) {
                        child.removeChild(markNode);
                        child.className = child.className.replace("newRssItem", "");
                    }
                    markNode = null;
                }
                var pubTicks = item.pubDateTicks;
                if (f.applyRulesFlag
                        && (
                            (KeepDuration > 0 && ((NowDateTicks - itemdateloadedticks) > KeepDuration))
                            || (AgeOfItem > 0 && ((NowDateTicks - pubTicks) > AgeOfItem))
                            || (ReadByTicks > 0 && (pubTicks <= ReadByTicks))
                        )
                    ) {
                    HideItem(item);
                    RemoveSingleItem(child);
                    sbUpdateLength();
                } else {
                    if (!noScroll) {
                        ItemList.removeChild(child);
                        if (IsRightToLeft && ItemList.firstChild != null) {
                            ItemList.insertBefore(child, ItemList.firstChild);
                        } else {
                            ItemList.appendChild(child);
                        }
                    }
                }
                pubTicks = null;
                itemdateloadedticks = null;
                item = null;
            }
            f = null;
            ScrollPos = 0;
        }
        var ta = document.getElementById("itemlisttable");
        if (IsRightToLeft) {
            ta.style.left = ((WindowWidth - ta.clientWidth) - (noScroll ? 0 : (sbXPos + ScrollPos))) + "px";
        } else {
            ta.style.left = (noScroll ? 0 : (sbXPos + ScrollPos)) + "px";
        }
        ta.style.top = "0px";
        ta = null;
        child = null;
    }
    if (noScroll) {
        if (HeartBeatCount == 0) {
            HeartBeatOn = !HeartBeatOn;
            HeartBeat.style.display = (HeartBeatOn ? "block" : "none");
            HeartBeat.style.left = (WindowWidth - 17) + "px";
            document.getElementById("itemhovercontainer").style.display = "none";
        }
    } else {
        HeartBeatOn = false;
        HeartBeat.style.display = "none";
    }
    if (++HeartBeatCount > HeartBeatMax) {
        HideMenu();
        HeartBeatCount = 0;
        if (Feeds != null && !LoadIgnore) {
            NowDateTicks = CurrentTicks();
            var wasChange = false;
            while (LoadQueue.length > 0) {
                var p = LoadQueue[0];
                LoadQueue.splice(0, 1);
                if (p.value == SettingId) {
                    wasChange |= LoadHandler(p.key);
                }
                p = null;
            }
            for (var i = 0; i < Feeds.length; i++) {
                f = Feeds[i];
                if ((NowDateTicks - f.updated) > f.interval) {
                    LoadFeed(f);
                }
                f = null;
            }
            if (wasChange) sbUpdateLength();
        }
    }
    noScroll = null;
    ScrollBusy = false;
}

function UpdateFeeds(ev) {
    if (!ScrollBusy) {
        ScrollBusy = true;
        try {
            NowDateTicks = CurrentTicks();
            HideMenu();
            if (Feeds != null) {
                for (var i = 0; i < Feeds.length; i++) {
                    LoadFeed(Feeds[i]);
                }
            }
        }
        catch (e) {
            BugReport("UpdateFeeds exception:" + e.message);
        }
        ScrollBusy = false;
        ClearMouseOverFlag = true;
    }
    ev = null;
}

function ConvertToTicks(str) {
    var t = 0;
    if (str != null && str.length > 0) {
        switch (str.charAt(str.length - 1)) {
            case 'h': t = 3600; break;
            case 'd': t = 86400; break;
            case 'w': t = 604800; break;
            case 'm': t = 2628000; break;
            case 'y': t = 31536000; break;
            default: t = 60; break;
        }
        t = t * parseInt(str) * 1000;
    }
    str = null;
    return t;
}

function CreateFeedFromNode(idx, newFeed, kindCode, numFeeds) {
    var f = null;
    try {
        var id = newFeed.getAttribute("id");
        var name = SetLocalValue(newFeed, "name", "");
        var folder = SetLocalValue(newFeed, "folder", "").toLowerCase();
        if ((folder.length > 0) && (folder.charAt(0) == "@")) folder = folder.substring(1);
        var interval = ConvertToTicks(SetLocalValue(newFeed, "interval", "20"));
        var topX = SetLocalValue(newFeed, "topx", "0");
        var feedColor = SetLocalValue(newFeed, "color", "");
        var dateFormat = SetLocalValue(newFeed, "dateformat", "");
        var url = SetLocalValue(newFeed, "url", "");
        var atomFlag = SetLocalFlag(newFeed, "atom", false);
        var enableFlag = SetLocalFlag(newFeed, "enable", true);
        var compareContentFlag = SetLocalFlag(newFeed, "comparecontent", false);
        var applyRulesFlag = SetLocalFlag(newFeed, "applyrules", true);
        var pruneFlag = SetLocalFlag(newFeed, "prune", false);
        var displayNameFlag = SetLocalFlag(newFeed, "displayname", false);
        var useFMFlag = SetLocalFlag(newFeed, "usefm", false);
        var ignoreFlag = SetLocalFlag(newFeed, "ignore", true);
        var headersFlag = SetLocalFlag(newFeed, "headers", false);
        var emailFlag = SetLocalFlag(newFeed, "email", false);
        var asHTMLFlag = SetLocalFlag(newFeed, "ashtml", false);
        var playsoundFlag = SetLocalFlag(newFeed, "playsound", false);
        var showinflyoutFlag = SetLocalFlag(newFeed, "showinflyout", false);
        var subMatchIndex = SetLocalValue(newFeed, "submatchindex", "-1");
        var matchPositionsFlag = SetLocalFlag(newFeed, "matchpositions", false);
        var pattern = SetLocalValue(newFeed, "pattern", "");
        var patternFolder = SetLocalValue(newFeed, "patternfolder", "");
        var patternCategories = SetLocalValue(newFeed, "patterncategories", "");
        var patternName = SetLocalValue(newFeed, "patternname", "");
        var patternTitle = SetLocalValue(newFeed, "patterntitle", "");
        var patternDescription = SetLocalValue(newFeed, "patterndescription", "");
        var patternLink = SetLocalValue(newFeed, "patternlink", "");
        var toAddress = SetLocalValue(newFeed, "toaddress", "");
        var description = "No description.";
        var successTitle = SetLocalValue(newFeed, "successtitle", "");
        var successDescription = SetLocalValue(newFeed, "successdescription", "");
        var rejectTitle = SetLocalValue(newFeed, "rejecttitle", "");
        var rejectDescription = SetLocalValue(newFeed, "rejectdescription", "");
        var failTitle = SetLocalValue(newFeed, "failtitle", "");
        var failDescription = SetLocalValue(newFeed, "faildescription", "");
        var func = newFeed.text;
        var funcCode = null;
        var loader = null;
        var feedDoc = null;
        var items = null;
        var sortedItems = null;
        var g = null;
        for (k = 0; k < numFeeds; k++) {
            if (Feeds[k].id == id) {
                g = Feeds[k];
                if (g.func == func) {
                    funcCode = g.funcCode;
                    g.funcCode = null;
                }
                if (g.useFMFlag == useFMFlag) {
                    loader = g.loader;
                    g.loader = null;
                }
                feedDoc = g.feedDoc;
                items = g.items;
                sortedItems = g.sortedItems;
                g.feedDoc = null;
                g.items = null;
                g.sortedItems = null;
                g = null;
                break;
            }
        }
        f = new Feed(id, idx, url, name, description, folder, pattern,
            patternFolder, patternCategories, patternName, patternTitle, patternDescription, patternLink, toAddress,
            successTitle, successDescription, rejectTitle, rejectDescription, failTitle, failDescription, func,
            topX, interval, feedColor, dateFormat,
            kindCode, ignoreFlag, headersFlag, subMatchIndex,
            matchPositionsFlag,
            emailFlag, asHTMLFlag, playsoundFlag, showinflyoutFlag,
            pruneFlag, applyRulesFlag, useFMFlag, atomFlag, enableFlag, displayNameFlag, compareContentFlag,
            funcCode, loader, feedDoc, items, sortedItems);
        idx = null;
        newFeed = null;
        kindCode = null;
        url = null;
        id = null;
        name = null;
        description = null;
        folder = null;
        pattern = null;
        patternFolder = null;
        patternCategories = null;
        patternName = null;
        patternDescription = null;
        patternTitle = null;
        patternLink = null;
        toAddress = null;
        successTitle = null;
        successDescription = null;
        rejectTitle = null;
        rejectDescription = null;
        failTitle = null;
        failDescription = null;
        func = null;
        topX = null;
        subMatchIndex = null;
        interval = null;
        feedColor = null;
        dateFormat = null;
        kindCode = null;
        ignoreFlag = null;
        matchPositionsFlag = null;
        headersFlag = null;
        pruneFlag = null;
        applyRulesFlag = null;
        useFMFlag = null;
        atomFlag = null;
        enableFlag = null;
        displayNameFlag = null;
        compareContentFlag = null;
        emailFlag = null;
        asHTMLFlag = null;
        playsoundFlag = null;
        showinflyoutFlag = null;
        funcCode = null;
        loader = null;
        feedDoc = null;
        items = null;
        sortedItems = null;
    } catch (e) {
        BugReport("CreateFeed exception:" + e.message);
    }
    return f;
}

function FeedIsEnabled(node) {
    var ok = SetLocalFlag(node, "enable", true);
    var folder = SetLocalValue(node, "folder", "").toLowerCase().substring(1);
    if (ok && (Folders != null) && (folder != null) && (folder.length > 0)) {
        ok = (SearchMapIndex(Folders, folder) >= 0);
    }
    folder = null;
    node = null;
    return ok;
}

function SetFolderFlags(f) {
    if (Folders != null) {
        var ff = GetMapValue(Folders, f.folder);
        if (ff != null) {
            var c = ff.textColor;
            if ((c != null) && (c.length > 0) && (c != "default")) {
                if ((f.feedColor == null) || (f.feedColor.length == 0)) {
                    f.feedColor = c;
                }
            }
            c = null;
            ff = null;
        }
    }
    f = null;
}

function CreateExec(str) {
    var r = new Array(str);
    r["input"] = str;
    r["index"] = 0;
    r["lastIndex"] = str.length;
    str = null;
    return r;
}

function SetScrollTicker() {
    ScrollTickerId = setInterval(IsHorizontal ? HorizontalScrollTicker : VerticalScrollTicker, ScrollRate);
}
function SetLoadTicker() {
    LoadTickerId = setInterval(LoadTicker, 300);
}
function SetTimeOut() {
    TimeOutId = setTimeout(TimeOut, 8000);
}

function onSettingsClosed(ev) {
    if (ev.closeAction == ev.Action.commit) {
        UpdateSettings(false);
    }
    ev = null;
}

function UpdateSettings(isInit) {
    ScrollBusy = true;
    LoadIgnore = true;
    ++SettingId;
    try {
        if (!isInit) AutoHideMenu = true;
        clearInterval(ScrollTickerId);
        clearTimeout(TimeOutId);
        RemoveItems(-1, false);
        IsRightToLeft = (GetSetting("/data/display/righttoleft", "false") == "true");
        ShowScrollBar = (GetSetting("/data/display/hidescrollbar", "false") != "true");
        ShowHover = (GetSetting("/data/display/hidehover", "false") != "true");
        var h = (GetSetting("/data/display/horizontal", "false") == "true");
        var sw = parseInt(GetSetting("/data/display/scrollwidth", "0"));
        var sh = parseInt(GetSetting("/data/display/scrollheight", "0"));
        var fs = parseInt(GetSetting("/data/display/fontsize", "9px"));
        var bor = GetSetting("/data/display/bordercolor", "");
        var bac = GetSetting("/data/display/backgroundcolor", "");
        var bim = GetSetting("/data/display/backgroundimage", "");
        if ((bim.length > 1) && (bim.charAt("0") == "\\")) bim = System.Gadget.path + "\\images" + bim;
        if (bor == "") bor = "white";
        if (bac == "") bac = "black";
        var changeSize = (isInit || (h != IsHorizontal) || (h && (fs != FontSize))
            || (bor != BorderColor) || (bac != BackgroundColor) || (bim != BackgroundImage)
            || (sw != ScrollWidth) || (sh != ScrollHeight));
        FontSize = fs;
        if (changeSize) {
            IsHorizontal = h;
            sbVertical = !IsHorizontal;
            BorderColor = bor;
            BackgroundColor = bac;
            BackgroundImage = bim;
            ScrollWidth = sw;
            ScrollHeight = sh;
            RemoveAllChildren(ItemList);
            RemoveAllChildren(ItemListContainer);
            ItemList = null;
            var t = null;
            if (h) {
                t = CreateTable();
                t.id = "itemlisttable";
                ItemListContainer.appendChild(t);
                var tb = CreateTableHeader(t);
                t = null;
                ItemList = document.createElement("tr");
                tb.appendChild(ItemList);
                tb = null;
            } else {
                ItemList = document.createElement("div");
                ItemList.id = "itemlistdiv";
                ItemListContainer.appendChild(ItemList);
            }
            SetWindowSize(GetSetting("/data/display/windowsize", "medium"));
        }
        fs = null;
        bor = null;
        bac = null;
        sw = null;
        sh = null;
        h = null;

        var ri = document.getElementById("rssiconlarge");
        ri.style.left = ((WindowWidth >> 1) - 15) + "px";
        ri.style.top = ((WindowHeight >> 1) - 15) + "px";
        ri.style.display = "block";
        ri = null;
        SetTimeOut();

        ItemList.dir = IsRightToLeft ? "rtl" : "";
        SetContrast(ItemListContainer, "contrast");
        ScrollRate = parseInt(GetSetting("/data/display/scrollrate", "50"));
        ScrollEnabled = ScrollRate > 0;
        ScrollRate = (ScrollEnabled ? (ScrollRate | 0) : 50);
        ScrollNode = null;
        ClickOnHoverTicks = (1000 * parseInt(GetSetting("/data/display/autoclick", "0")) / ScrollRate) | 0;
        HeartBeatMax = (7000 / ScrollRate) | 0;
        HeartBeat.style.display = "none";
        SetScrollTicker();
        TickerState(true);

        ReadByTicks = parseInt(UserParseDate(GetSetting("/data/options/readbydate", "0")));
        AgeOfItem = ConvertToTicks(GetSetting("/data/options/ageofitem", "2d"));
        FlagDuration = ConvertToTicks(GetSetting("/data/options/flagduration", "12h"));
        KeepDuration = ConvertToTicks(GetSetting("/data/options/keepduration", "1d"));
        SearchCache = (GetSetting("/data/options/searchcache", "true") == "true");
        FilterByCategory = (GetSetting("/data/categories/filterbycategory", "true") == "true");
        HideIfNone = (GetSetting("/data/categories/hideifnone", "false") == "true");
        ShowIfNew = (GetSetting("/data/categories/showifnew", "true") == "true");
        FlushCache = (GetSetting("/data/feeds/flushcache", "false") == "true") ;

        DateDisplayFormat = GetSetting("/data/feeds/datedisplayformat", "");

        SMTPServer = GetSetting("/data/alerts/server", "");
        SMTPPort = GetSetting("/data/alerts/port", "25");
        SMTPUseSSL = (GetSetting("/data/alerts/ssl", "false") == "true");
        SMTPUserName = GetSetting("/data/alerts/username", "");
        SMTPPassword = GetSetting("/data/alerts/password", "");
        FromAddress = GetSetting("/data/alerts/fromaddress", "");
        SoundFile = GetSetting("/data/alerts/soundfile", "C:\\Windows\\Media\\Windows Notify.wav");

        var i, r, n;
        ClearMap(Filters);
        Filters = null;
        var nodes = CurrentSettingsDoc.selectNodes("/data/filters/filter");
        if (nodes != null && nodes.length > 0) {
            for (i = 0; i < nodes.length; i++) {
                var fil = nodes[i];
                n = fil.getAttribute("name");
                if (n != null && n.length > 0) {
                    r = SetPattern(fil.text);
                    if (r != null) {
                        if (Filters == null) Filters = new Array();
                        InsertInMap(Filters, n, r);
                    }
                    r = null;
                }
                n = null;
                fil = null;
            }
            nodes = null;
        }

        var inc, exc;
        ClearMap(Cats);
        ClearMap(Folders);
        Cats = null;
        Folders = null;
        nodes = CurrentSettingsDoc.selectNodes("/data/categories/category");
        if (nodes != null && nodes.length > 0) {
            Cats = new Array();
            for (i = 0; i < nodes.length; i++) {
                var cat = nodes[i];
                var c = cat.getAttribute("name").toLowerCase();
                if (c.length > 0) {
                    if (c.charAt(0) == "@") {
                        if (cat.getAttribute("enable") == "true") {
                            r = cat.getAttribute("color");
                            if (r == null || r.length == 0) r = "default";
                            inc = null; exc = null;
                            n = cat.getAttribute("includefilter");
                            if (n != null && n.length > 0) {
                                inc = SearchMapValue(Filters, n);
                            }
                            n = cat.getAttribute("excludefilter");
                            if (n != null && n.length > 0) {
                                exc = SearchMapValue(Filters, n);
                            }
                            n = c.substring(1);
                            r = new Folder(n, r, inc, exc);
                            if (Folders == null) Folders = new Array();
                            InsertInMap(Folders, n, r);
                            inc = null;
                            exc = null;
                            n = null;
                            r = null;
                        }
                    } else {
                        InsertInMap(Cats, c, (cat.getAttribute("enable") == "true"));
                    }
                }
                c = null;
                cat = null;
            }
            nodes = null;
        }

        var numFeeds = Feeds.length;
        var newFeeds = Array();
        var idx = 0;
        var k, f = null;
        if (FlushCache) {
            numFeeds = 0;
            ClearMap(FeedCacheMap);
            FeedCacheMap = null;
        }
        nodes = CurrentSettingsDoc.selectNodes("/data/feeds/feed");
        var kindCode = KindFeed;
        if (nodes != null) for (i = 0; i < nodes.length; i++) {
            if (FeedIsEnabled(nodes[i])) {
                f = CreateFeedFromNode(idx, nodes[i], kindCode, numFeeds);
                if (f != null) {
                    newFeeds.push(f);
                    SetFolderFlags(f);
                    ++idx;
                    f = null;
                }
            }
        }
        nodes = null;

        nodes = CurrentSettingsDoc.selectNodes("/data/pages/page");
        kindCode = KindPage;
        if (nodes != null) for (i = 0; i < nodes.length; i++) {
            if (FeedIsEnabled(nodes[i])) {
                f = CreateFeedFromNode(idx, nodes[i], kindCode, numFeeds);
                if (f != null) {
                    newFeeds.push(f);
                    SetFolderFlags(f);
                    ++idx;
                    f = null;
                }
            }
        }
        nodes = null;

        var alerts = new Array();
        nodes = CurrentSettingsDoc.selectNodes("/data/alerts/alert");
        kindCode = KindAlert;
        if (nodes != null) for (i = 0; i < nodes.length; i++) {
            if (FeedIsEnabled(nodes[i])) {
                f = CreateFeedFromNode(idx, nodes[i], kindCode, numFeeds);
                if (f != null) {
                    newFeeds.push(f);
                    alerts.push(f);
                    SetFolderFlags(f);
                    ++idx;
                    f = null;
                }
            }
        }
        nodes = null;

        ClearFeeds(Feeds);
        Feeds = newFeeds;
        newFeeds = null;
        numFeeds = null;

        // Add alert listeners to feeds.
        if (alerts.length > 0) for (i = 0; i < Feeds.length; ++i) {
            f = Feeds[i];
            if (f.kindCode != KindAlert) {
                var listeners = new Array();
                var matchesFolder = new Array();
                var matchesName = new Array();
                for (k = 0; k < alerts.length; ++k) {
                    try {
                        var a = alerts[k];
                        var ok = true;
                        var r1 = null;
                        if (a.reFolder == null) {
                            r1 = null;
                        } else {
                            if (a.patternFolder == "$F") {
                                ok = (a.folder == f.folder);
                                if (ok) {
                                    r1 = CreateExec(a.folder);
                                }
                            } else {
                                r1 = a.reFolder.exec(f.folder);
                                ok = (r1 != null);
                            }
                        }
                        if (ok) {
                            var r2 = null;
                            if (a.reName == null) {
                                r2 = null;
                            } else {
                                if (a.patternName == "$N") {
                                    ok = (a.name == f.name);
                                    if (ok) {
                                        r2 = CreateExec(a.name);
                                    }
                                } else {
                                    r2 = a.reName.exec(f.name);
                                    ok = (r2 != null);
                                }
                            }
                            if (ok) {
                                listeners.push(a);
                                matchesFolder.push(r1);
                                matchesName.push(r2);
                            }
                            r2 = null;
                        }
                        r1 = null;
                        a = null;
                    } catch (e) { }
                }
                if (listeners.length > 0) {
                    f.listeners = listeners;
                    f.matchesFolder = matchesFolder;
                    f.matchesName = matchesName;
                }
                listeners = null;
                matchesFolder = null;
                matchesName = null;
            }
            f = null;
        }
        ClearArray(alerts);
        alerts = null;
        SetupScrollbar();
    } catch (e) {
        BugReport("UpdateSettings exception:" + e.message);
    }
    TickerState(false);
    LoadIgnore = false;
    ScrollBusy = false;
}

function ClearFeeds(feedarray) {
    if (feedarray != null) {
        for (var i = 0; i < feedarray.length; i++) {
            ClearFeed(feedarray[i]);
            feedarray[i] = null;
        }
        feedarray = null;
    }
}

function ClearFeed(f) {
    if (f != null) {
        try {
            if (f.feedDoc != null) {
                f.feedDoc.onreadystatechange = BlankFunction;
                if (f.kindCode == KindFeed) {
                    f.feedDoc.loadXML(BlankXML);
                }
                f.feedDoc = null;
            }
            f.loader = null;
            f.asyncLoadReadyStateChange = null;
            f.asyncLoadByProxyReadyStateChange = null;
            f.idx = null;
            f.id = null;
            f.name = null;
            f.folder = null;
            f.description = null;
            f.pattern = null;
            f.patternFolder = null;
            f.patternCategories = null;
            f.patternName = null;
            f.patternDescription = null;
            f.patternTitle = null;
            f.patternLink = null;
            f.toAddress = null;
            f.successTitle = null
            f.successDescription = null;
            f.rejectTitle = null;
            f.rejectDescription = null;
            f.failTitle = null;
            f.failDescription = null;
            f.func = null;
            f.funcCode = null;
            f.kindCode = null;
            f.matchPositionsFlag = null;
            f.ignoreFlag = null;
            f.headersFlag = null;
            f.pruneFlag = null;
            f.applyRulesFlag = null;
            f.useFMFlag = null;
            f.atomFlag = null;
            f.enableFlag = null;
            f.displayNameFlag = null;
            f.compareContentFlag = null;
            f.emailFlag = null;
            f.asHTMLFlag = null;
            f.playsoundFlag = null;
            f.showinflyoutFlag = null;
            f.subMatchIndex = null;
            f.topX = null;
            f.feedColor = null;
            f.dateFormat = null;
            f.image = null;
            f.link = null;
            f.url = null;
            f.updated = null;
            ClearItems(f.items);
            f.items = null;
            ClearArray(f.sortedItems);
            f.sortedItems = null;
            ClearArray(f.matchesFolder);
            ClearArray(f.matchesName);
            ClearArray(f.listeners);
            f.matchesFolder = null;
            f.matchesName = null;
            f.listeners = null;
            f.codeSum = null;
            f.interval = null;
            f.reInclude = null;
            f.reExclude = null;
            f.reFolder = null;
            f.reCategories = null;
            f.reName = null;
            f.reDescription = null;
            f.reTitle = null;
            f.reLink = null;
        } catch (e) {
            BugReport("ClearFeed exception: " + e.message);
        }
        f = null;
    }
}

function Feed(id, idx, url, name, description, folder,
    pattern, patternFolder, patternCategories, patternName, patternTitle, patternDescription, patternLink, toAddress,
    successTitle, successDescription, rejectTitle, rejectDescription, failTitle, failDescription, func,
    topX, interval, feedColor, dateFormat,
    kindCode, ignoreFlag, headersFlag, subMatchIndex,
    matchPositionsFlag, emailFlag, asHTMLFlag, playsoundFlag, showinflyoutFlag,
    pruneFlag, applyRulesFlag, useFMFlag, atomFlag, enableFlag, displayNameFlag, compareContentFlag,
    funcCode, loader, feedDoc, items, sortedItems) {
    try {
        this.id = id;
        this.idx = idx;
        this.url = url;
        this.image = url;
        this.link = url;
        this.name = name;
        this.description = description;
        this.folder = folder;
        this.pattern = pattern;
        this.patternFolder = patternFolder;
        this.patternCategories = patternCategories;
        this.patternName = patternName;
        this.patternDescription = patternDescription;
        this.patternTitle = patternTitle;
        this.patternLink = patternLink;
        this.toAddress = toAddress;
        this.successTitle = successTitle;
        this.successDescription = successDescription;
        this.rejectTitle = rejectTitle;
        this.rejectDescription = rejectDescription;
        this.failTitle = failTitle;
        this.failDescription = failDescription;
        this.func = func;
        this.funcCode = funcCode;
        this.topX = topX;
        this.interval = interval;
        this.subMatchIndex = subMatchIndex;
        this.feedColor = feedColor;
        this.dateFormat = dateFormat;
        this.kindCode = kindCode;
        this.matchPositionsFlag = matchPositionsFlag;
        this.ignoreFlag = ignoreFlag;
        this.headersFlag = headersFlag;
        this.pruneFlag = pruneFlag;
        this.applyRulesFlag = applyRulesFlag;
        this.useFMFlag = useFMFlag;
        this.atomFlag = atomFlag;
        this.enableFlag = enableFlag;
        this.displayNameFlag = displayNameFlag;
        this.compareContentFlag = compareContentFlag;
        this.emailFlag = emailFlag;
        this.asHTMLFlag = asHTMLFlag;
        this.playsoundFlag = playsoundFlag;
        this.showinflyoutFlag = showinflyoutFlag;
        this.updated = 0;
        this.codeSum = 0.0;
        this.items = ((items == null) ? new Array() : items);
        this.sortedItems = ((sortedItems == null) ? new Array() : sortedItems);
        this.feedDoc = feedDoc;
        this.loader = loader;
        this.asyncLoadByProxyReadyStateChange = null;
        this.asyncLoadReadyStateChange = null;
        this.matchesName = null;
        this.matchesFolder = null;
        this.listeners = null;

        this.reInclude = null;
        this.reExclude = null;
        if (kindCode == KindFeed) {
            var ff = GetMapValue(Folders, folder);
            if (ff != null) {
                this.reInclude = ff.includeFilter;
                this.reExclude = ff.excludeFilter;
                ff = null;
            }
        }

        if (kindCode == KindAlert) {
            this.reFolder = SetPattern(patternFolder);
            this.reCategories = SetPattern(patternCategories);
            this.reName = SetPattern(patternName);
            this.reTitle = SetPattern(patternTitle);
            this.reDescription = SetPattern(patternDescription);
            this.reLink = SetPattern(patternLink);
        } else {
            this.reFolder = null;
            this.reCategories = null;
            this.reName = null;
            this.reTitle = null;
            this.reDescription = null;
            this.reLink = null;
        }

        if ((kindCode == KindPage) || (kindCode == KindAlert)) {
            if ((func == null) || (func.length == 0)) {
                this.func = ((kindCode == KindPage) ? "StandardPageCheck;" : "StandardAlertCheck;");
            }
            if (funcCode == null) {
                this.funcCode = CreateFunction(this.func);
            }
        }

    } catch (e) {
        //BugReport("Feed exception:"+e.message);
    }
    id = null;
    idx = null;
    url = null;
    name = null;
    description = null;
    failure = null;
    folder = null;
    pattern = null;
    patternFolder = null;
    patternCategories = null;
    patternName = null;
    patternTitle = null;
    patternDescription = null;
    patternLink = null;
    toAddress = null;
    successTitle = null
    successDescription = null;
    rejectTitle = null;
    rejectDescription = null;
    failTitle = null;
    failDescription = null;
    func = null;
    topX = null;
    interval = null;
    subMatchIndex = null;
    feedColor = null;
    dateFormat = null;
    kindCode = null;
    matchPositionsFlag = null;
    ignoreFlag = null;
    headersFlag = null;
    pruneFlag = null;
    applyRulesFlag = null;
    useFMFlag = null;
    atomFlag = null;
    enableFlag = null;
    displayNameFlag = null;
    compareContentFlag = null;
    emailFlag = null;
    asHTMLFlag = null;
    playsoundFlag = null;
    showinflyoutFlag = null;
    funcCode = null;
    loader = null;
    feedDoc = null;
    items = null;
    sortedItems = null;
}

function CreateAsyncLoadHandler(feedIdx, sid) {
    return function() { AsyncLoadHandler(feedIdx, sid); }
}

function CreateProxyAsyncLoadHandler(feedIdx, sid) {
    return function() { ProxyAsyncLoadHandler(feedIdx, sid); }
}

function BinarySearch(items, key) {
    var lo = 0, hi = items.length;
    while (lo < hi) {
        var mid = (lo + hi) >> 1;
        var val = items[mid].hash;
        if (key < val) {
            hi = mid;
        } else if (key > val) {
            lo = mid + 1;
        } else {
            while (mid > 0) {
                if (items[mid - 1].hash != key) break;
                --mid;
            }
            f = null;
            key = null;
            lo = null;
            hi = null;
            val = null;
            return mid;
        }
        mid = null;
        val = null;
    }
    items = null;
    key = null;
    hi = null;
    return -lo - 1;
}

function CrossSearch(item, feedIdx) {
    var hash = item.hash;
    var title = item.title;
    for (var i = 0; i < Feeds.length; i++) {
        if (i != feedIdx) {
            var f = Feeds[i];
            if (f.kindCode == KindFeed) {
                var numOldItems = f.sortedItems.length;
                var j = BinarySearch(f.sortedItems, hash);
                if (j >= 0) {
                    var oldItem = null;
                    for (var k = j; k < numOldItems; k++) {
                        oldItem = f.sortedItems[k];
                        if (hash != oldItem.hash) break;
                        if (!SearchCache || (title == oldItem.title)) {
                            if (item.loadDateTicks > oldItem.loadDateTicks) {
                                HideItem(item);
                            }
                            break;
                        }
                        oldItem = null;
                    }
                    oldItem = null;
                    title = null;
                }
                j = null;
                numOldItems = null;
            }
            f = null;
        }
    }
    title = null;
    hash = null;
    item = null;
    feedIdx = null;
}

function GetItemProperty(f, selectSinglePath, defaultValue) {
    var tmp = f.feedDoc.selectSingleNode(selectSinglePath);
    var val = (tmp != null && tmp.text != null && tmp.text.length > 0) ? tmp.text : defaultValue;
    tmp = null;
    f = null;
    selectSinglePath = null;
    defaultValue = null;
    return val;
}

function RegDiff(a, b, i) {
    var d = 0;
    if (i < 0 || a.length <= i || b.length <= i) {
        i = 0;
    }
    if (a.length > i && b.length > i) {
        if (a[i] < b[i]) d = -1;
        else if (a[i] > b[i]) d = 1;
    }
    a = null;
    b = null;
    i = null;
    return d;
}

function CreateRegDiff(i) {
    return function(a, b) { return RegDiff(a, b, i); }
}

function ProduceReport(f, matches) {
    var report = "";
    var needsbreak = false;
    for (var k = 0; k < matches.length; k++) {
        var m = matches[k];
        if (m != null) {
            if (needsbreak) report += "<br/>";
            else needsbreak = true;
            report += m[0];
            if (f.matchPositionsFlag) {
                report += " " + m.index + "-" + m.lastIndex + ".";
            }
            m = null;
        }
    }
    f = null;
    matches = null;
    needsbreak = null;
    return report;
}

function ReplaceMatches(f, matches, str, item, a) {
    if (str != null) {
        var report = null;
        var oldlastindex = 0;
        var result = SubVarRegExp.exec(str);
        while (result != null && result.lastIndex != oldlastindex) {
            oldlastindex = result.lastIndex;
            var s = str.substring(result.index, result.lastIndex);
            var r = "";
            var p = -1;
            switch (s.charAt(1)) {
                case '#':
                    r = "" + HashCode(f.feedDoc.responseText);
                    break;
                case '*':
                    if (report == null) {
                        report = ProduceReport(f, matches);
                    }
                    r = report;
                    break;
                case '^':
                    p = 0;
                    break;
                case '$':
                    p = matches.length - 1;
                    break;
                case 'v':
                    r = System.Gadget.version;
                    break;
                case 'F':
                    r = ((a != null) ? a.folder : "");
                    break;
                case 'N':
                    r = ((a != null) ? a.name : "");
                    break;
                case 'f':
                    r = ((f != null) ? f.folder : "");
                    break;
                case 'n':
                    r = ((f != null) ? f.name : "");
                    break;
                case 't':
                    r = ((item != null) ? item.title : "");
                    break;
                case 'd':
                    r = ((item != null) ? item.description : "");
                    break;
                case 'c':
                    r = ((item != null) ? item.categories : "");
                    break;
                case 'l':
                    r = ((item != null) ? item.link : "");
                    break;
                case 'h':
                    r = ((item != null) ? ("" + item.hash) : "");
                    break;
                case 'p':
                    r = ((item != null) ? item.pubDate : "");
                    break;
                default:
                    p = parseInt(s.substring(1));
                    break;
            }
            if (p >= 0) {
                var m = s.lastIndexOf("/");
                if (m >= 0) {
                    m = parseInt(s.substring(m + 1));
                }
                if (m < 0) {
                    m = 0;
                }
                if (p < matches.length) {
                    var b = matches[p];
                    if ((b != null) && (m < b.length)) {
                        r = b[m];
                    } else {
                        r = "";
                    }
                    b = null;
                }
                m = null;
            }
            str = str.substring(0, result.index) + r + str.substring(result.lastIndex);
            result = SubVarRegExp.exec(str);
            s = null;
            r = null;
            p = null;
        }
        report = null;
        result = null;
        oldlastindex = null;
    }
    f = null;
    matches = null;
    return str;
}

function MiniItem(title, description) {
    this.title = title;
    this.description = description;
    title = null;
    description = null;
}

function HermesVersionPageCheck(f, matches) {
    var title = null;
    var description = null;
    if (matches.length == 0) {
        title = f.failTitle;
        description = f.failDescription;
    } else {
        var ver = ReplaceMatches(f, matches, "$$/1", null, null);
        if (ver > System.Gadget.version) {
            title = f.successTitle;
            description = f.successDescription;
        } else {
            title = f.rejectTitle;
            description = f.rejectDescription;
        }
        ver = null;
    }
    title = ReplaceMatches(f, matches, title, null, null);
    description = ReplaceMatches(f, matches, description, null, null);
    var p = new MiniItem(title, description);
    title = null;
    description = null;
    f = null;
    matches = null;
    return p;
}

function StandardPageCheck(f, matches) {
    var title = null;
    var description = null;
    if (matches.length == 0) {
        title = f.failTitle;
        description = f.failDescription;
    } else {
        title = f.successTitle;
        description = f.successDescription;
    }
    title = ReplaceMatches(f, matches, title, null, null);
    description = ReplaceMatches(f, matches, description, null, null);
    var p = new MiniItem(title, description);
    title = null;
    description = null;
    f = null;
    matches = null;
    return p;
}

function CreateFunction(str) {
    var func = null;
    try {
        eval("func = " + str + ";");
    } catch (e) {
        BugReport("CreateFunction, eval usr func exception:" + e.message);
    }
    str = null;
    return func;
}

function ProcessDate(s, dateformat) {
    var ticks = 0;
    if (dateformat == "") {
        try {
            ticks = Date.parse(s);
        } catch (e) {
        }
        if (isNaN(ticks)) {
            ticks = GetDateFromFormat(s, "y-M-dTHH:m:sfz");
        }
    } else {
        if (dateformat.charAt(0) == "#") {
            try {
                ticks = Date.parse(s);
            } catch (e) {
            }
            if (isNaN(ticks)) {
                ticks = GetDateFromFormat(s, "y-M-dTHH:m:sfz" + dateformat);
            } else {
                ticks += 60000 * ZoneOffsetToMinutes(dateformat);
            }
        } else {
            ticks = GetDateFromFormat(s, dateformat);
        }
    }
    s = null;
    dateformat = null;
    return ticks;
}
function CheckPage(f) {
    var item = null;
    try {
        var text = f.feedDoc.responseText;
        if (text != null) {
            var pubDate = null;
            var pubDateTicks = NowDateTicks - 1;
            if (f.headersFlag) {
                try {
                    pubDate = f.feedDoc.getResponseHeader("Date");
                    if (pubDate != null && pubDate.length > 0) {
                        pubDateTicks = ProcessDate(pubDate, f.dateFormat);
                    }
                } catch (e) {
                }
                if (pubDateTicks == 0) {
                    pubDateTicks = NowDateTicks;
                }
            }     
            if (DateDisplayFormat != null && DateDisplayFormat.length > 0) {
                pubDate = FormatDate(pubDateTicks, DateDisplayFormat);
            } else if (pubDate == null || pubDate.length == 0) {
                pubDate = StdFormatDate(pubDateTicks);
            }
            var matches = new Array();
            var re = SetPattern(f.pattern);
            var result = re.exec(text);
            var oldlastindex = 0;
            while (result != null && result.lastIndex != oldlastindex) {
                matches.push(result);
                oldlastindex = result.lastIndex;
                result = re.exec(text);
            }
            result = null;
            re = null;
            oldlastindex = null;
            if (matches.length > 0) {
                if (f.subMatchIndex >= 0) {
                    var func = CreateRegDiff(f.subMatchIndex);
                    matches.sort(func);
                    func = null;
                }
            }

            if (!(f.ignore && (matches.length == 0))) {
                var pi = null;
                try {
                    pi = f.funcCode(f, matches);
                    if (pi != null) {
                        item = new NewsItem(pi.title, pi.description, "|" + f.folder + "|", f.link, pubDate, pubDateTicks, NowDateTicks, f.compareContentFlag);
                        pi.title = null;
                        pi.description = null;
                        pi = null;
                    }
                } catch (e) {
                    BugReport("CheckPage, calling usr func exception:" + e.message);
                }
            }
            pubDateTicks = null;
            pubDate = null;
            text = null;
            ClearArray(matches);
            matches = null;
        }
    } catch (e) {
        BugReport("CheckPage exception: " + e.message);
    }
    f = null;
    return item;
}

// Needs to be efficient since called frequently.
function StandardAlertCheck(a, f, item, idx) {
    var p = null;
    var t = null;
    var ok = true;
    var r0 = (a.reCategories == null) ? null : (t = a.reCategories.exec(item.categories), ok = (t != null), t);
    if (ok) {
        var r1 = (a.reTitle == null) ? null : (t = a.reTitle.exec(item.title), ok = (t != null), t);
        if (ok) {
            var r2 = (a.reDescription == null) ? null : (t = a.reDescription.exec(item.description), ok = (t != null), t);
            if (ok) {
                var r3 = (a.reLink == null) ? null : (t = a.reLink.exec(item.link), ok = (t != null), t);
                if (ok) {
                    var matches = new Array(f.matchesFolder[idx], f.matchesName[idx], r0, r1, r2, r3);
                    var title = ReplaceMatches(f, matches, a.successTitle, item, a);
                    var description = ReplaceMatches(f, matches, a.successDescription, item, a);
                    p = new MiniItem(title, description);
                    title = null;
                    description = null;
                    ClearArray(matches);
                    matches = null;
                }
                r3 = null;
            }
            r2 = null;
        }
        r1 = null;
    }
    r0 = null;
    ok = null;
    t = null;
    a = null;
    f = null;
    item = null;
    idx = null;
    return p;
}

function HashDiff(a, b) {
    var d = a.hash - b.hash;
    if (d == 0) {
        HasDuplicates = true;
        d = a.loadDateTicks - b.loadDateTicks;
    }
    a = null;
    b = null;
    return d;
}

function PubDateTicksDiff(a, b) {
    var d = b.pubDateTicks - a.pubDateTicks;
    a = null;
    b = null;
    return d;
}

function LoadDateTicksDiff(a, b) {
    var d = b.loadDateTicks - a.loadDateTicks;
    a = null;
    b = null;
    return d;
}

function ProxyAsyncLoadHandler(idx, sid) {
    if ((!LoadIgnore) && (sid == SettingId)) {
        try {
            var f = Feeds[idx];
            if ((f.loader.readyState == 4) && (f.loader.status == 200)) {
                f.feedDoc.async = false;
                if (f.loader.responseXML == null)
                    f.feedDoc.loadXML(f.loader.responseText);
                else
                    f.feedDoc.loadXML(f.loader.responseXML.xml);
                AsyncLoadHandler(idx, sid);
            }
            f = null;
        } catch (e) {
            BugReport("ProxyAsyncLoadHandler exception: " + e.message);
        }
    }
    idx = null;
}

function AsyncLoadHandler(idx, sid) {
    if ((!LoadIgnore) && (sid == SettingId)) {
        try {
            var f = Feeds[idx];
            if ((f.feedDoc.readyState == 4)) { // && ((f.kindCode == KindPage) || (f.feedDoc.parseError.errorCode == 0))) {
                LoadQueue.push(new Pair(idx, sid));
            }
            f = null;
        } catch (e) {
            BugReport("AsyncLoadHandler exception: " + e.message);
        }
    }
    idx = null;
}

function GetAtomLink(node, linkSelectPath) {
    var r, i, n, s;
    var norel = null, self = null, alt = null;
    var lnks = node.selectNodes(linkSelectPath);
    if (lnks != null) {
        n = lnks.length;
        for (i = 0; i < n; i++) {
            r = lnks[i].getAttribute("rel");
            if (r == null) {
                norel = lnks[i].getAttribute("href");
            } else {
                if (r == "self") {
                    self = lnks[i].getAttribute("href");
                } else if (r == "alternate") {
                    alt = lnks[i].getAttribute("href");
                }
            }
        }
    }
    if (alt != null) s = alt;
    else if (norel != null) s = norel;
    else if (self != null) s = self;
    s = TrimDefault(s, "No Link");
    r = null;
    norel = null; self = null; alt = null;
    lnks = null;
    node = null;
    linkSelectPath = null;
    return s;
}

function GetAtomImage(f) {
    var i = GetItemProperty(f, SelectSinglePath("feed", "icon", null), "");
    if (i == "") i = GetItemProperty(f, SelectSinglePath("feed", "logo", null), "");
    f = null;
    return i;
}

function GetAtomContent(node) {
    var n = node.selectSingleNode(SelectSingleChild("summary"));
    if (n == null) n = node.selectSingleNode(SelectSingleChild("content"));
    var c = TrimNode(n, "No description");
    n = null;
    node = null;
    return c;
}

function LoadHandler(idx) {
    var wasChange = false, skipChange = false;
    try {
        TickerState(true);
        var f = Feeds[idx];
        var newItems = new Array();
        var items = null;
        var numItems = parseInt(f.topX);
        var loadDateTicks = NowDateTicks;
        var pubDateTicks = null;
        var pubDate = null;
        var codeSum = 0.0;
        var item, title, description, categories;
        var a, b, i, j, k, n, c, r, s, x, link, state, isatom, tagchn, tagdes, tagitem, tagdate1, tagdate2;
        var isAllowed, isNew, isFirst, hasFilters, cn;


        if (f.kindCode == KindPage) {
            item = CheckPage(f);
            if (item != null) {
                newItems.push(item);
                codeSum += item.hash;
                item = null;
            }
        } else {
            if (f.feedDoc.parseError.errorCode != 0) {
                item = new NewsItem("Feed load error.", f.feedDoc.parseError.reason + "<br/>Error code:0x" 
                    + DecToHexString(f.feedDoc.parseError.errorCode) + LoadErrorMessage,
                     "|error|", f.url, StdFormatDate(loadDateTicks), loadDateTicks, loadDateTicks + 1, f.compareContentFlag);
                item.state = StateUnread;

                if (f.feedDoc.parseError.reason.indexOf("locate") > 0) { // Network down, so schedule next reload for a minutes time.
                    loadDateTicks += 60000 - f.interval;
                }
                j = (f.sortedItems!=null) ? BinarySearch(f.sortedItems, item.hash) : -1;
                if (j >= 0) {
                    codeSum = f.codeSum;
                    ClearItem(item);
                } else {
                    f.codeSum += item.hash;
                    items = f.items;
                    if (items == null) { items = new Array(); f.items = items; }
                    items.push(item);               
                    if (GetSetting("/data/options/sortbydate", "false") == "true") {
                        items.sort(PubDateTicksDiff);
                    } else if (GetSetting("/data/options/sortbyload", "false") == "true") {
                        items.sort(LoadDateTicksDiff);
                    }
                    HasDuplicates = false;
                    items = f.sortedItems;
                    if (items == null) { items = new Array(); f.sortedItems = items; }
                    items.push(item);
                    items.sort(HashDiff);
                    RemoveItems(f.idx, false);
                    RedrawFeed(f.idx, -1);
                    skipChange = true;
                }
            } else {
                isatom = f.atomFlag;
                if (isatom) {
                    tagchn = "feed"; tagsub = "subtitle"; tagitem = "entry";
                    tagdate1 = "published"; tagdate2 = "updated";
                } else {
                    tagchn = "channel"; tagsub = "description"; tagitem = "item";
                    tagdate1 = "pubDate"; tagdate2 = "date";
                }
                f.name = GetItemProperty(f, SelectSinglePath(tagchn, "title", null), f.url);
                f.link = isatom ? GetAtomLink(f.feedDoc, SelectNodesPath(tagchn, "link")) 
                                    : GetItemProperty(f, SelectSinglePath(tagchn, "link", null), "No link");
                f.image = isatom ? GetAtomImage(f) : GetItemProperty(f, SelectSinglePath(tagchn, "image", "url"), "");
                f.description = GetItemProperty(f, SelectSinglePath(tagchn, tagsub, null), "No description");
                items = f.feedDoc.selectNodes(SelectNodesPath(tagchn, tagitem));
                if (items.length <= 0) {
                    items = f.feedDoc.selectNodes(SelectNodesPath(tagitem, null));
                }
                if (numItems < 1 || numItems > items.length) numItems = items.length;
                loadDateTicks += numItems;
                hasFilters = (f.reInclude != null || f.reExclude != null);
                for (i = 0; i < numItems; i++) {
                    state = StateUnread;
                    title = TrimNode(items[i].selectSingleNode(SelectSingleChild("title")), "Untitled");
                    description = isatom ? GetAtomContent(items[i]) 
                                    : TrimNode(items[i].selectSingleNode(SelectSingleChild("description")), "No description");
                    link = isatom ? GetAtomLink(items[i], SelectNodesChild("link")) 
                                    : TrimNode(items[i].selectSingleNode(SelectSingleChild("link")), "No link");
                    categories = null;
                    c = items[i].selectNodes(SelectNodesChild("category"));
                    if ((c != null) && ((k = c.length) > 0)) {
                        isAllowed = false;
                        isNew = true;
                        isFirst = true;
                        for (j = 0; j < k; j++) {
                            cn = isatom ? c[j].getAttribute("term") : c[j].text;
                            if (cn != null) {
                                cn = cn.replace(/\|/g, ":");
                                Trim(cn);
                                if (cn.length > 0) {
                                    if (isFirst) { categories = "|"; isFirst = false; }
                                    cn = cn.toLowerCase();
                                    categories += cn + "|";
                                    if (FilterByCategory && !isAllowed) {
                                        x = SearchMapIndex(Cats, cn);
                                        if (x >= 0) {
                                            isNew = false;
                                            isAllowed = Cats[x].value;
                                        }
                                    }
                                }
                                cn = null;
                            }
                        }
                        if (FilterByCategory) {
                            if (isNew) {
                                if (!ShowIfNew) state = StateHide;
                            } else if (!isAllowed) state = StateHide;
                        }
                    } else if (HideIfNone) {
                        state = StateHide;
                    }
                    if (categories == null) {
                        categories = "|" + f.folder + "|";
                    }
                    c = null;
                    if (hasFilters) {
                        try {
                            if (f.reInclude && !f.reInclude.test(description)) state = StateHide;
                            if (f.reExclude && f.reExclude.test(description)) state = StateHide;
                        } catch (e) { }
                    }
                    pubDateTicks = --loadDateTicks;
                    pubDate = null;
                    try {
                        var pubNode = items[i].selectSingleNode(SelectSingleChild(tagdate1));
                        if (pubNode == null) pubNode = items[i].selectSingleNode(SelectSingleChild(tagdate2));
                        if (pubNode != null && pubNode.text.length > 0) {
                            pubDate = pubNode.text;
                            pubDateTicks = ProcessDate(pubDate, f.dateFormat);
                        }
                        pubNode = null;
                    } catch (e) {
                    }

                    if (pubDateTicks == 0) {
                        pubDateTicks = loadDateTicks;
                    }
                    if (pubDate == null || pubDate.length == 0) {
                        pubDate = "undated";
                    } else if (DateDisplayFormat != null && DateDisplayFormat.length > 0 && (pubDateTicks != loadDateTicks)) {
                        pubDate = FormatDate(pubDateTicks,DateDisplayFormat);
                    }
                    item = new NewsItem(title, description, categories, link, pubDate, pubDateTicks, loadDateTicks, f.compareContentFlag);
                    item.state = state;
                    newItems.push(item);
                    codeSum += item.hash;
                    if ((state == StateHide) && !SearchCache) {
                        item.title = null;
                        item.description = null;
                        item.categories = null;
                        item.link = null;
                        item.pubDate = null;
                    }
                    item = null;
                    title = null;
                    description = null;
                    categories = null;
                    link = null;
                    pubDate = null;
                    pubDateTicks = null;
                }
            }
            numItems = null;
        }
        f.updated = loadDateTicks;
        wasChange = codeSum != f.codeSum;
        if (wasChange && !skipChange) {
            numItems = newItems.length;
            // Update state of new items that were in old items.
            var sortedItems = null;
            j = SearchMapIndex(FeedCacheMap, f.url);
            if (j >= 0) sortedItems = FeedCacheMap[j].value;
            if (sortedItems != null) {
                FeedCacheMap[j].value = null;
            } else {
                sortedItems = f.sortedItems;
            }
            var numOldItems = sortedItems.length;
            if (numOldItems > 0) {
                n = numItems;
                while (n-- > 0) {
                    item = newItems[n];
                    if (item.state != StateHide) {
                        var hash = item.hash;
                        j = BinarySearch(sortedItems, hash);
                        if (j >= 0) {
                            title = item.title;
                            var oldItem = null;
                            for (k = j; k < numOldItems; k++) {
                                oldItem = sortedItems[k];
                                if (hash != oldItem.hash) break;
                                if (!SearchCache || (title == oldItem.title)) {
                                    item.state = oldItem.state;
                                    item.loadDateTicks = oldItem.loadDateTicks;
                                    if (!SearchCache && (item.state == StateHide)) {
                                        item.title = null;
                                        item.description = null;
                                        item.categories = null;
                                        item.link = null;
                                        item.pubDate = null;
                                    }
                                    break;
                                }
                                oldItem = null;
                            }
                            oldItem = null;
                            title = null;
                        }
                        j = null;
                        hash = null;
                    }
                    item = null;
                }
                n = null;
            }
            numOldItems = null;
            sortedItems = null;
            var newSortedItems = new Array();
            if (numItems > 0) {
                for (s = 0; s < numItems; s++) {
                    newSortedItems.push(newItems[s]);
                }
                HasDuplicates = false;
                newSortedItems.sort(HashDiff);
                if (HasDuplicates && f.pruneFlag && (numItems > 1)) {
                    var baseTicks = newItems[0].actualDateTicks;
                    b = newSortedItems[0];
                    s = 1;
                    while (s < numItems) {
                        a = b;
                        b = newSortedItems[s];
                        if ((a.hash == b.hash) && (!SearchCache || (a.title == b.title))) {
                            k = s;
                            if (a.loadDateTicks < loadDateTicks) {
                                c = b;
                                b = a;
                            } else {
                                c = a;
                                --k;
                            }
                            r = baseTicks - c.actualDateTicks;
                            if ((r < 0) || (r >= newItems.length)) {
                                ++s;
                            } else {
                                --numItems;
                                ClearItem(newItems[r]);
                                newItems[r] = null;
                                newSortedItems[k] = null;
                                newSortedItems.splice(k, 1);
                            }
                        } else {
                            ++s;
                        }
                    }
                    baseTicks = null;
                    r = null;
                    a = null;
                    b = null;
                    s = 0;
                    while (s < newItems.length) {
                        if (newItems[s] == null) {
                            newItems.splice(s, 1);
                        } else ++s;
                    }
                    numItems = newItems.length;
                }
                // Check if no marks required.
                if (FlagDuration == 0) {
                    for (r = 0; r < numItems; r++) {
                        if (newItems[r].state == StateUnread) {
                            newItems[r].state = StateRead;
                        }
                    }
                }
                // Apply rules to new items.
                if (f.applyRulesFlag) {
                    for (var m = 0; m < numItems; m++) {
                        item = newItems[m];
                        if (item.state != StateHide) {
                            loadDateTicks = item.loadDateTicks;
                            pubDateTicks = item.pubDateTicks;
                            if ((KeepDuration > 0 && ((NowDateTicks - loadDateTicks) > KeepDuration))
                            || (AgeOfItem > 0 && ((NowDateTicks - pubDateTicks) > AgeOfItem))
                            || (ReadByTicks > 0 && (pubDateTicks <= ReadByTicks))) {
                                HideItem(item);
                            }
                            loadDateTicks = null;
                            pubDateTicks = null;
                        }
                        item = null;
                    }
                }
                if (GetSetting("/data/feeds/crosscompare", "false") == "true") {
                    for (c = 0; c < numItems; c++) {
                        item = newItems[c];
                        if (item.State == StateUnread) {
                            CrossSearch(item, f.idx);
                        }
                        item = null;
                    }
                }
                if (f.listeners != null) {
                    var listeners = f.listeners;
                    var count = 0;
                    for (var q = 0; q < listeners.length; q++) {
                        a = listeners[q];
                        for (var t = 0; t < numItems; t++) {
                            var ni = newItems[t];
                            if ((ni.state == StateUnread) && (ni.loadDateTicks >= NowDateTicks)) {
                                try {
                                    var pi = a.funcCode(a, f, ni, q);
                                    if (pi != null) {
                                        pubDateTicks = NowDateTicks + count++;
                                        pubDate = StdFormatDate(pubDateTicks);
                                        item = new NewsItem(pi.title, pi.description, "|" + a.folder + "|", ni.link, pubDate, pubDateTicks, pubDateTicks + 1, a.compareContentFlag);
                                        pi.title = null;
                                        pi.description = null;
                                        pi = null;
                                        a.items.push(item);
                                        RedrawFeed(a.idx, a.items.length - 1);
                                        if (a.emailFlag) {
                                            SendEMail(SMTPServer, SMTPPort, SMTPUseSSL, SMTPUserName, SMTPPassword,
                                                    FromAddress, a.toAddress, item.title, item.description, a.asHTMLFlag, IsRightToLeft);
                                        }
                                        if (a.playsoundFlag) {
                                            PlaySound(SoundFile);
                                        }
                                        if (a.showinflyoutFlag) {
                                            ShowInFlyout(item, a.idx)
                                        }
                                        item = null;
                                        pubDateTicks = null;
                                        pubDate = null;
                                    }
                                } catch (e) {
                                    BugReport("CheckAlert, calling usr func exception:" + e.message);
                                }
                            }
                            ni = null;
                        }
                        a = null;
                    }
                    count = null;
                    listeners = null;
                }
                if (GetSetting("/data/options/sortbydate", "false") == "true") {
                    newItems.sort(PubDateTicksDiff);
                } else if (GetSetting("/data/options/sortbyload", "false") == "true") {
                    newItems.sort(LoadDateTicksDiff);
                }
            }
            // Remove prior items of feed.
            RemoveItems(f.idx, false);
            var tmp = f.items; // Watch out for concurrent access to items.
            f.codeSum = codeSum;
            f.items = newItems;
            ClearItems(tmp);
            tmp = null;
            ClearArray(f.sortedItems);
            f.sortedItems = null;
            f.sortedItems = newSortedItems;
            newSortedItems = null;
            RedrawFeed(f.idx, -1);
        }   
        codeSum = null;
        item = null;
        title = null;
        loadDateTicks = null;
        numItems = null;
        newItems = null;
        items = null;
        f = null;
    } catch (e) {
        BugReport("LoadHandler exception: " + e.message);
    }
    TickerState(false);
    idx = null;
    return wasChange;
}

function LoadFeed(f) {
    if (f.kindCode == KindAlert) {
        var s = f.items;
        var n = 0;
        var compactItems = new Array();
        for (var c = 0; c < s.length; c++) {
            if (s[c] != null) {
                compactItems.push(s[c]);
                s[c] = n++;
            }
        }
        n = ItemList.firstChild;
        while (n != null) {
            if (parseInt(n.getAttribute("feedid")) == f.idx) {
                var x = parseInt(n.getAttribute("itemid"));
                n.setAttribute("itemid", s[x]);
                x = null;
            }
            n = n.nextSibling;
        }
        ClearArray(s);
        s = null;
        f.items = compactItems;
        compactItems = null;
    } else {
        try {
            TickerState(true);
            TickerCount(10);
            f.updated = NowDateTicks;
            var tryagain = true;
            if ((f.kindCode == KindFeed) && f.useFMFlag) {
                try {
                    if (FeedsManager == null) {
                        try {
                            FeedsManager = new ActiveXObject("Microsoft.FeedsManager");
                        } catch (e) {
                        }
                    }
                    if (FeedsManager != null) {
                        var feed = FeedsManager.GetFeedByUrl(f.url);
                        if (feed != null) {
                            var ok = false;
                            try {
                                // TO DO: It would be better to use AsyncDownload() if only we could easily hook to FeedWatcher.
                                feed.Download();
                                ok = (feed.LastDownloadError == 0);
                            } catch (e) {
                            }
                            if (ok) {
                                var xml = feed.Xml(1000, 0, 0, 0, 0);
                                if (xml != null) {
                                    if (f.feedDoc == null) {
                                        try {
                                            f.feedDoc = new ActiveXObject(DOMDocumentProgID);
                                        } catch (e) {
                                        }
                                    }
                                    if (f.feedDoc != null) {
                                        f.feedDoc.async = false;
                                        f.feedDoc.setProperty("ProhibitDTD", false);
                                        f.feedDoc.loadXML(xml);
                                        AsyncLoadHandler(f.idx, SettingId);
                                        tryagain = false;
                                    }
                                    xml = null;
                                }
                            }
                            ok = null;
                            feed = null;
                        }
                    }
                } catch (e) {
                    BugReport("LoadFeed via FeedsManager exception:" + e.message);
                }
            }
            if (tryagain) {
                if (f.feedDoc == null) {
                    try {
                        f.feedDoc = new ActiveXObject((f.kindCode == KindPage) ? XMLHTTPProgID : DOMDocumentProgID);
                    } catch (e) {
                    }
                    if (f.feedDoc != null) {
                        f.feedDoc.async = true;
                        f.feedDoc.setProperty("ProhibitDTD", false);
                        f.feedDoc.resolveExternals = false;
                        f.feedDoc.validateOnParse = false;
                    }
                }
                if (GetSetting("/data/proxy/url", "").length > 0) {
                    if (f.loader == null) {
                        try {
                            f.loader = new ActiveXObject(ServerXMLHTTPProgID);
                            f.asyncLoadByProxyReadyStateChange = CreateProxyAsyncLoadHandler(f.idx, SettingId);
                        } catch (e) {
                            BugReport("LoadFeed proxy exception: " + e.message);
                            f.loader = null;
                            f.asyncLoadByProxyReadyStateChange = null;
                        }
                    }
                    if (f.loader != null) {
                        f.loader.setProxy(2, GetSetting("/data/proxy/url", ""));
                        f.loader.open("GET", f.url, true);
                        if (GetSetting("/data/proxy/username", "").length > 0)
                            f.loader.setProxyCredentials(GetSetting("/data/proxy/username", ""), GetSetting("/data/proxy/password", ""));
                        f.loader.setRequestHeader("User-Agent", "Hermes/1.0.4 (Windows; U; Windows NT 6.0; en-US; rv:1.8.1.11)");
                        f.loader.setRequestHeader('Accept-Language', 'en-us;q=0.7,en;q=0.3');
                        f.loader.setRequestHeader("Accept", "text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5");
                        f.loader.setRequestHeader("Accept-Charset", "utf-8;q=0.7,*;q=0.7");
                        f.loader.onreadystatechange = f.asyncLoadByProxyReadyStateChange;
                        f.loader.send();
                    }
                } else {
                    if (f.asyncLoadReadyStateChange == null) {
                        f.asyncLoadReadyStateChange = CreateAsyncLoadHandler(f.idx, SettingId);
                    }
                    if (f.kindCode == KindPage) {
                        try {
                            f.feedDoc.open("GET", f.url, true);
                            // Probably don't need to set any header parameters, but just in case...
                            f.feedDoc.setRequestHeader("Cache-Control", "no-cache");
                            f.feedDoc.setRequestHeader("Pragma", "no-cache");
                            f.feedDoc.setRequestHeader("Expires", "-1");
                            f.feedDoc.setRequestHeader("If-Modified-Since", "1 Jan 1970 12:00:00 GMT");
                            f.feedDoc.onreadystatechange = f.asyncLoadReadyStateChange;
                            f.feedDoc.send();
                        } catch (e) {
                            BugReport("LoadFeed getting html exception:" + e.message);
                        }
                    } else {
                        f.feedDoc.onreadystatechange = f.asyncLoadReadyStateChange;
                        f.feedDoc.load(f.url);
                    }
                }
            }
            tryagain = null;
        }
        catch (e) {
            f.updated = NowDateTicks;
            //BugReport("LoadFeed exception:"+ e.message);
        }
    }
    TickerState(false);
    f = null;
}

function TimeOut() {
    document.getElementById("rssiconlarge").style.display = "none";
}

function TabOnMouseOut(ev) {
    this.style.filter = "Alpha(Opacity=50)";
    ev = null;
}

function TabOnMouseOver(ev) {
    this.style.filter = "Alpha(Opacity=100)";
    ev = null;
}

function SmallOnClick(ev) {
    SaveWindowSize("small");
    ev = null;
}

function MediumOnClick(ev) {
    SaveWindowSize("medium");
    ev = null;
}

function LargeOnClick(ev) {
    SaveWindowSize("large");
    ev = null;
}

function AboutOnClick(ev) {
    System.Shell.execute(System.Gadget.path + "\\manual.html");
    ev = null;
}

function AdjustOnClick(ev) {
    WasMenuActivated = true;
    System.Gadget.Flyout.file = "settings.html";
    System.Gadget.Flyout.show = true;
    ev = null;
}

function CacheItem(title, hash, state, ticks) {
    this.title = title;
    this.description = null;
    this.hash = hash;
    this.categories = null;
    this.link = null;
    this.pubDate = null;
    this.pubDateTicks = null;
    this.loadDateTicks = ticks;
    this.actualDateTicks = ticks;
    this.state = state;
    this.hasPubDate = false;
    title = null;
    hash = null;
    state = null;
    link = null;
    ticks = null;
}

function SaveCache() {
    var doc = null, f = null, c = null;
    try {
        doc = new ActiveXObject(DOMDocumentProgID);
        doc.async = false;
        doc.setProperty("ProhibitDTD", false);
        c = doc.createElement("cache");
        doc.appendChild(c);
        f = doc.createElement("feeds");
        c.appendChild(f);
        c = null;
        var a, b, i, j, n, g, h;
        for (i = 0; i < Feeds.length; ++i) {
            g = Feeds[i];
            if (g == null) continue;
            n = doc.createElement("feed");
            f.appendChild(n);
            n.setAttribute("url", g.url);
            h = g.sortedItems;
            for (j = 0; j < h.length; j++) {
                b = h[j];
                if (b.state != StateUnread) {
                    a = doc.createElement("item");
                    a.setAttribute("hash", b.hash);
                    a.setAttribute("ticks", b.loadDateTicks);
                    a.setAttribute("state", b.state);
                    a.setAttribute("title", b.title);
                    n.appendChild(a);
                    a = null;
                }
                b = null;
            }
            h = null;
            n = null;
            g = null;
        }
        f = null;
        doc.save(CachePath);
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "SaveCache exception: " + e.message;
    }
    f = null;
    c = null;
    doc = null;
}

function LoadCache() {
    var doc = null;
    try {
        var k, i, j, g, node, title, hash, state;
        doc = new ActiveXObject(DOMDocumentProgID);
        doc.async = false;
        doc.setProperty("ProhibitDTD", false);
        doc.load(CachePath);
        var nodes = doc.selectNodes("/cache/feeds/feed");
        if (nodes != null && nodes.length > 0) {
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                k = node.childNodes.length;
                if (k > 0) {
                    var url = node.getAttribute("url");
                    var items = new Array();
                    for (j = 0; j < k; j++) {
                        g = node.childNodes[j];
                        title = g.getAttribute("title");
                        hash = 1 * g.getAttribute("hash");
                        state = 1 * g.getAttribute("state");
                        ticks = 1 * g.getAttribute("ticks");
                        items[j] = new CacheItem(title, hash, state, ticks);
                    }
                    if (FeedCacheMap == null) FeedCacheMap = new Array();
                    InsertInMap(FeedCacheMap, url, items);
                    url = null;
                    items = null;
                }
            }
            n = null;
        }
        nodes = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Could not process cache file.";
    }
    doc = null;
}

function MainSetup() {
    try {
        window.detachEvent("onload", MainSetup);
    } catch (e) { }
    try {
        window.attachEvent("onunload", MainClear);

        for (var i = 0; i < DOMDocumentProgIDs.length; i++) {
            try {
                DOMDocumentProgID = DOMDocumentProgIDs[i];
                ServerXMLHTTPProgID = ServerXMLHTTPProgIDs[i];
                XMLHTTPProgID = XMLHTTPProgIDs[i];
                break;
            } catch (e) {
                DOMDocumentProgID = null;
                ServerXMLHTTPProgID = null;
                XMLHTTPProgID = null;
            }
        }
        var p = "";
        try {
            p = System.Gadget.path;
        } catch (e) {
            p = ".";
        }
        CachePath = p + "\\cache.xml";
        DefaultSettingsPath = p + "\\defaultsettings.xml";
        CurrentSettingsPath = p + "\\currentsettings.xml";
        CurrentSettingsDoc = new ActiveXObject(DOMDocumentProgID);
        CurrentSettingsDoc.async = false;
        CurrentSettingsDoc.setProperty("ProhibitDTD", false);
        CurrentSettingsDoc.load(CurrentSettingsPath);
        if (CurrentSettingsDoc.xml.length == 0) {
            CurrentSettingsDoc.load(DefaultSettingsPath);
        }
        Feeds = new Array();
        NowDateTicks = CurrentTicks();
        LoadCache();
        try {
            System.Gadget.settingsUI = "settings.html";
            System.Gadget.onSettingsClosed = onSettingsClosed;
        } catch (e) { }
        p = null;

        HeartBeat = document.getElementById("heartbeaticon");
        LoadingIcon = document.getElementById("loadingicon");
        ItemListContainer = document.getElementById("itemlistcontainer");
        sbBarNode = document.getElementById("scrollbar");
        sbTrackNode = document.getElementById("scrollbartrack");
        sbHandleNode = document.getElementById("scrollbarhandle");
        sbDownNode = document.getElementById("scrollbardown");
        sbUpNode = document.getElementById("scrollbarup");

        SetLoadTicker();
        UpdateSettings(true);

        document.onmouseover = OnMouseOver;
        document.onmouseout = OnMouseOut;
        document.onmousemove = OnMouseMove;
        document.onmousewheel = sbWheel;

        var el = null;
        el = document.getElementById("search");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = DisplaySearchWindow;
        el = null;

        el = document.getElementById("reload");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = UpdateFeeds;
        el = null;

        el = document.getElementById("about");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = AboutOnClick;
        el = null;

        el = document.getElementById("adjust");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = AdjustOnClick;
        el = null;

        el = document.getElementById("window1");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = SmallOnClick;
        el = null;

        el = document.getElementById("window2");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = MediumOnClick;
        el = null;

        el = document.getElementById("window3");
        el.onmouseout = TabOnMouseOut;
        el.onmouseover = TabOnMouseOver;
        el.onclick = LargeOnClick;
        el = null;
    } catch (e) {
        BugReport("MainSetup exception: " + e.message);
        document.getElementById("toppanel").style.display = "none";
        var wb = document.getElementById("welcomebox");
        wb.innerHTML = "<p>Setup Exception<br />" + e.message + "</p>";
        wb.style.display = "block";
    }
}

function MainClear() {
    try {
        clearInterval(LoadTickerId);
        clearInterval(ScrollTickerId);
        clearTimeout(ClickTimerId);
        clearTimeout(TimeOutId);
        LoadTickerId = null;
        ScrollTickerId = null;
        ClickTimerId = null;
        TimeOutId = null;

        sbOnUnload();

        window.detachEvent("onunload", MainClear);
        document.onmouseover = null;
        document.onmouseout = null;
        document.onmousemove = null;
        document.onmousewheel = null;

        var el = null;
        el = document.getElementById("search");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        el = document.getElementById("reload");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        el = document.getElementById("about");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        el = document.getElementById("adjust");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        el = document.getElementById("window1");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        el = document.getElementById("window2");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        el = document.getElementById("window3");
        el.onmouseout = null;
        el.onmouseover = null;
        el.onclick = null;
        el = null;

        RemoveItems(-1, false);
        ItemList = null;
        ItemListContainer = null;

        if (CurrentSettingsDoc != null) {
            CurrentSettingsDoc.loadXML(BlankXML);
            CurrentSettingsDoc = null;
        }
        FeedsManager = null;
        SaveCache();
        ClearMap(FeedCacheMap);
        FeedCacheMap = null;
        ClearFeeds(Feeds);
        Feeds = null;
        ClearMap(Filters);
        Filters = null;
        ClearMap(Cats);
        ClearMap(Folders);
        Folders = null;
        Cats = null;
        HeartBeat = null;
        LoadQueue = null;
        LoadingIcon = null;
        SearchKeyWords = null;
        ScrollNode = null;
        CtrlKey = null;
        ShiftKey = null;
        AltKey = null;
        AltLeft = null;
        ClickTarget = null;
        CachePath = null;
        DefaultSettingsPath = null;
        CurrentSettingsPath = null;
        DetailsFeedName = null;
        DetailsItemTitle = null;
        DetailsItemDescription = null;
        DetailsItemCategories = null;
        DetailsItemLink = null;
        DetailsItemDate = null;
        BlankXML = null;
        SubVarRegExp = null;
        try {
            System.Gadget.onSettingsClosed = BlankFunction;
        } catch (e) { }
    } catch (e) {
        BugReport("MainClear exception: " + e.message);
    }
}

function WelcomeOnClick() {
    document.getElementById("welcomebox").style.display = "none";
    document.getElementById("welcomeButton").onclick = null;
    MainSetup();
    document.getElementById("toppanel").style.display = "block";
}

function WelcomeSetup() {
    try {
        window.detachEvent("onload", WelcomeSetup);
        document.getElementById("rssiconlarge").style.display = "none";
        var g = document.getElementById("imgbackground");
        g.style.display = "block";
        g.style.height = "130px";
        g.style.width = "130px";
        g.style.top = "0px";
        g.style.left = "0px";
        g.opacity = 0;
        g.src = "url(images/transparent.png)";
        g = null;
        document.getElementById("welcomebox").style.display = "block";
        document.getElementById("welcomeButton").onclick = WelcomeOnClick;
        System.Gadget.Settings.writeString("Welcome", "false");
    } catch (e) {
        BugReport("WelcomeSetup exception: " + e.message);
    }
}

function MainInit() {
    try {
        var w = System.Gadget.Settings.readString("Welcome");
        window.attachEvent("onload", (((w == null) || (w.length == 0)) ? WelcomeSetup : MainSetup));
        w = null;
    } catch (e) {
        BugReport("MainInit exception: " + e.message);
    }
}

MainInit();
