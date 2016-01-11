var DefaultSettingsPath = null;
var CurrentSettingsPath = null;
var CurrentSettingsDoc = null;
var DOMDocumentProgID = null;
var ServerXMLHTTPProgID = null;
var XMLHTTPProgID = null;
var WasMenuActivated = false;
var FeedsManager = null;
var ProxyLoader = null;
var TestLoader = null;
var TmpDoc = null;
var ToggleName = null;
var LastId = null;
var LastNode = null;
var LastCat = null;
var PageDoc = null;
var WindowSize = null;
var ScrollWidth = null;
var TestCount = 0;
var KindNames = new Array("feed", "page", "alert", "cat");
var CurrentFolders = new Array(null, null, null, null);
var Pickers = new Array();
var Fonts = "Arial;"
+ "Arial Black;"
+ "Book Antiqua;"
+ "Bookman Old Style;"
+ "Charcoal;"
+ "Comic Sans MS;"
+ "Courier;"
+ "Courier New;"
+ "Cursive;"
+ "Gadget;"
+ "Garamond;"
+ "Georgia;"
+ "Geneva;"
+ "Helvetica;"
+ "Impact;"
+ "Lucida Console;"
+ "Lucida Grande;"
+ "Lucida Sans Unicode;"
+ "Monaco;"
+ "Monospace;"
+ "MS Sans Serif;"
+ "MS Serif;"
+ "New York;"
+ "Palatino;"
+ "Palatino Linotype;"
+ "Serif;"
+ "Sans-Serif;"
+ "Symbol;"
+ "Tahoma;"
+ "Times;"
+ "Times New Roman;"
+ "Trebuchet MS;"
+ "Verdana"
;
var BackgroundImages = "\\spruce.jpg;"
+ "\\festivetree.jpg;"
+ "\\festiverunner.jpg;"
;
function AddColorPicker(id) {
    var node = document.getElementById(id);
    if (node != null) {
        AddToMap(Pickers, id, new jscolor.color(node, { required: false, adjust: false, hash: true,
            pickerPosition: 'top', positionElement: 'picker',
            pickerFaceColor: 'transparent', pickerFace: 3, pickerBorder: 0, pickerInsetColor: 'black'
        }));
        node = null;
    }
    id = null;
}
function UpdateColorPicker(id) {
    var node = document.getElementById(id);
    var i = GetMapIndex(Pickers, id);
    if ((node != null) && (i >= 0)) {
        node.style.color = "black";
        node.style.backgroundColor = "white";
        var v = Pickers[i].value;
        if (v != null) {
            v.importColor();
            v = null;
        }
    }
    node = null;
    id = null;
}
function RemoveColorPicker(id) {
    var i = GetMapIndex(Pickers, id);
    if (i >= 0) {
        var v = Pickers[i].value;
        if (v != null) {
            v.removeTarget();
            v = null;
        }
        ClearMapEntry(Pickers, i);
    }
    id = null;
}
function RemoveColorPickers() {
    for (var i = 0; i < Pickers.length; i++) {
        var p = Pickers[i];
        if (p != null) {
            var v = p.value;
            if (v != null) {
                v.removeTarget();
                v = null;
            }
            p = null;
            ClearMapEntry(Pickers, i);
        }
    }
}

function SetDisplay(id, state) {
    var el = document.getElementById(id);
    if (el != null) el.style.display = state;
    el = null;
    state = null;
    id = null;
}

function ShowTab(ev) {
    try {
        document.getElementById("messagebox").innerHTML = "";
        var targ = GetTarget(ev);
        var tabcontainer = document.getElementById("tabcontainer");
        var len = tabcontainer.childNodes.length;
        for (var i = 0; i < len; i++) {
            tabcontainer.childNodes[i].className = "tab";
        }
        tabcontainer = null;
        targ.className = "tab selectedtab";
        SetDisplay("feeds", "none");
        SetDisplay("pages", "none");
        SetDisplay("alerts", "none");
        SetDisplay("options", "none");
        SetDisplay("display", "none");
        SetDisplay("proxy", "none");
        SetDisplay("cats", "none");
        SetDisplay("filters", "none");
        SetDisplay("help", "none");
        SetDisplay(targ.id.substring(3), "block");
        len = null;
        targ = null;
    } catch (e) {
        BugReport("ShowTab exception:" + e.message);
    }
    ev = null;
}

function HelpInfo(ev) {
    System.Shell.execute(System.Gadget.path + "\\manual.html");
}
function ChangesInfo(ev) {
    System.Shell.execute(System.Gadget.path + "\\changes.txt");
}
function ReadmeInfo(ev) {
    System.Shell.execute(System.Gadget.path + "\\readme.txt");
}
function AboutInfo(ev) {
    System.Shell.execute(System.Gadget.path + "\\about.html");
}

function InitializePreviewBox() {
    try {
        var box = document.getElementById("previewbox");
        var cell = document.getElementById("previewtablecell");
        box.dir = (document.getElementById("righttoleft").checked ? "rtl" : "ltr");
        box.style.fontSize = document.getElementById("fontsize").value;
        box.style.fontFamily = document.getElementById("fontfamily").value;
        box.style.fontWeight = document.getElementById("fontweight").value;
        box.style.color = document.getElementById("textcolor").value;
        var val = document.getElementById("backgroundcolor").value;
        if (val == "") val = "black";
        box.style.backgroundColor = val;
        cell.style.backgroundColor = val;
        val = document.getElementById("bordercolor").value;
        if (val == "") val = "white";
        box.style.borderLeft = "2px solid " + val;
        box.style.borderRight = "10px solid " + document.getElementById("scrollbarcolor").value;
        box.style.borderTop = "2px solid " + document.getElementById("linecolor").value;
        box.style.borderBottom = "2px solid " + document.getElementById("dividercolor").value;
        box.style.filter = "Alpha(Opacity=" + document.getElementById("contrast").value + ");";
        val = null;
        box = null;
        cell = null;
    } catch (e) {
        // Ignore any errors.
    }
}

function OnKeyUpPreview(attribute, val) {
    try { // Must update in a try block in case of bad input values.
        if (attribute == "fontSize") {
            document.getElementById("previewbox").style.fontSize = val;
        } else if (attribute == "fontFamily") {
            document.getElementById("previewbox").style.fontFamily = val;
        } else if (attribute == "fontWeight") {
            document.getElementById("previewbox").style.fontWeight = val;
        } else if (attribute == "textcolor") {
            if (val == "") val = "grey";
            document.getElementById("previewbox").style.color = val;
        } else if (attribute == "backgroundcolor") {
            if (val == "") val = "black";
            document.getElementById("previewbox").style.backgroundColor = val;
            document.getElementById("previewtablecell").style.backgroundColor = val;
        } else if (attribute == "bordercolor") {
            if (val == "") val = "white";
            document.getElementById("previewbox").style.borderLeft = "2px solid " + val;
        } else if (attribute == "scrollbarcolor") {
            if (val == "") val = "lightgrey";
            document.getElementById("previewbox").style.borderRight = "10px solid " + val;
        } else if (attribute == "linecolor") {
            if (val == "") val = "grey";
            document.getElementById("previewbox").style.borderTop = "2px solid " + val;
        } else if (attribute == "dividercolor") {
            if (val == "") val = "grey";
            document.getElementById("previewbox").style.borderBottom = "2px solid " + val;
        } else if (attribute == "contrast") {
            document.getElementById("previewbox").style.filter = "Alpha(Opacity=" + val + ");";
        }
    } catch (e) {
        // Ignore any errors.
    }
    attribute = null;
    val = null;
}

function FeedOnClick(ev) {
    try {
        var targ = GetClassNode(GetTarget(ev), "feedtable");
        if (targ != null) {
            targ.style.backgroundColor = "#0080ff";
            if (LastNode != null && LastNode != targ) {
                LastNode.style.backgroundColor = (LastNode.className.indexOf("feedtablealt") >= 0) ? "#eeeeee" : "white";
            }
            LastNode = targ;
            LastId = targ.id;
            targ = null;
        }
    }
    catch (e) {
        BugReport("FeedOnClick exception:" + e.message);
    }
    ev = null;
}

function CheckBoxOnClick(ev) {
    var targ = GetTarget(ev);
    ToggleName = targ.name;
    targ = null;
    ev = null;
}

function ToggleCheckBoxes(ev, kindCode) {
    try {
        var newState = false;
        var isFirst = true;
        if (ToggleName == null) {
            ToggleName = "enable";
        }
        var item = document.getElementById(KindNames[kindCode] + "list").firstChild;
        if ((kindCode == 3) && (item != null)) item = item.nextSibling; // Skip "All".
        while (item != null) {
            if ((item.style.display == "block") || (kindCode == 3)) {
                var t = document.getElementById(ToggleName + item.getAttribute("id"));
                if (t != null) {
                    if (isFirst) {
                        isFirst = false;
                        newState = !(t.checked);
                    }
                    t.checked = newState;
                    t = null;
                }
            }
            item = item.nextSibling;
        }
        isFirst = null;
        newState = null;
    } catch (e) {
        BugReport("ToggleCheckBoxes exception: " + e.message);
    }
    kindCode = null;
    ev = null;
}

function ClearDataNode(n) {
    if (n != null) {
        RemoveColorPicker("color" + n.id);
        if (n == LastNode) { LastNode = null; LastId = null; }
        n.onclick = null;
        var list, i, k;
        list = n.getElementsByTagName("a");
        for (i = 0; i < list.length; i++) {
            list[i].onclick = null;
        }
        list = null;
        list = n.getElementsByTagName("input");
        for (k = 0; k < list.length; k++) {
            list[k].onclick = null;
        }
        list = null;
        list = n.getElementsByTagName("tr");
        for (k = 0; k < list.length; k++) {
            list[k].onclick = null;
        }
        list = null;
        list = n.getElementsByTagName("td");
        for (k = 0; k < list.length; k++) {
            list[k].onclick = null;
        }
        list = null;
        list = n.getElementsByTagName("div");
        for (k = 0; k < list.length; k++) {
            list[k].onclick = null;
        }
        list = null;
        list = n.getElementsByTagName("select");
        for (k = 0; k < list.length; k++) {
            list[k].onchange = null;
        }
        list = null;
        RemoveAllChildren(n);
        n = null;
    }
}

function ClearDataList(name) {
    var n = document.getElementById(name);
    if (n != null) {
        var node = n.firstChild;
        while (node != null) {
            ClearDataNode(node);
            node = node.nextSibling;
        }
        RemoveAllChildren(n);
        n = null;
    }
    name = null;
}

function UpdateBands(next) {
    var count = 0;
    while (next != null) {
        if ((next.style.display == null) || (next.style.display != "none")) {
            var i = next.className.indexOf("alt");
            if (count++ % 2) {
                if (i > 0) next.className = next.className.substring(0, i);
            } else {
                if (i < 0) next.className = (next.className + "alt");
            }
            i = null;
        }
        next = next.nextSibling;
    }
}

function DeleteListEntry(node) {
    if (node != null) {
        var p = node.parentNode;
        ClearDataNode(node);
        p.removeChild(node);
        UpdateBands(p.firstChild);
        p = null;
        node = null;
    }
}

function DeleteButtonOnClick(ev) {
    try {
        var targ = GetClassNode(GetTarget(ev), "feedtable");
        if (targ != null) {
            if (targ.className.indexOf("catfeed") >= 0) {
                LastCat = targ;
                if ((targ.getAttribute("name").charAt(0) == "@") && document.getElementById("confirmdelete").checked) {
                    SetDisplay("catdeletebox","block");
                } else {
                    DeleteCategoryOnClick(ev);
                }
            } else if (targ.className.indexOf("filterfeed") >= 0) {
                LastCat = targ;
                DeleteFilterOnClick(ev);
            } else {
                DeleteListEntry(targ);
            }
            targ = null;
        }
    }
    catch (e) {
        BugReport("DeleteButtonOnClick exception:" + e.message);
    }
    ev = null;
}

function DeleteFilterOnClick(ev) {
    if (LastCat != null) {
        DeleteFromFilterFolders(LastCat.getAttribute("name"));
        DeleteListEntry(LastCat);
        LastCat = null;
    }
    ev = null;
}

function DeleteCategoryOnClick(ev) {
    SetDisplay("catdeletebox","none");
    if (LastCat != null) {
        var catname = LastCat.getAttribute("name");
        DeleteListEntry(LastCat);
        LastCat = null;
        if (catname.charAt(0) == "@") {
            DeleteFolderFromList("feedlist", catname);
            DeleteFolderFromList("pagelist", catname);
            DeleteFolderFromList("alertlist", catname);
        }
        catname = null;
    }
    ev = null;
}

function CancelPopupBox(ev) {
    var targ = GetTarget(ev);
    var c = GetClassNode(targ,"popupbox");
    if (c != null) {
        c.style.display = "none";
        c = null;
    }
    targ = null;
    ev = null;
}

function DeleteFolderFromList(scrolllistid, catname) {
    var p = document.getElementById(scrolllistid);
    var i = 0, k = 0, c = p.childNodes.length;
    if (scrolllistid.indexOf("page") >= 0) i = 1;
    else if (scrolllistid.indexOf("alert") >= 0) i = 2;
    if (CurrentFolders[i] == catname) CurrentFolders[i] = "All";
    while (k < c) {
        var n = p.childNodes[k++];
        if ((n != null) && (n.getAttribute("folder") == catname)) {
            ClearDataNode(n);
            p.removeChild(n);
            --c;
            --k;
        }
        n = null;
    }
    UpdateBands(p.firstChild);
    scrolllistid = null;
    catname = null;
    p = null;
}

function GetCatNode(name) {
    if (name != null && name.length > 0) {
        var n = document.getElementById("catlist")
        if (n != null) {
            n = n.firstChild;
            name = name.toLowerCase();
            while (n != null) {
                if (n.getAttribute("name").toLowerCase() == name) {
                    name = null;
                    return n;
                }
                n = n.nextSibling;
            }
        }
    }
    name = null;
    return null;
}

function IsEnabledCat(name) {
    var c = GetCatNode(name);
    var ok = false;
    if (c != null) {
        ok = document.getElementById("enable" + c.id).checked;
        c = null;
    }
    name = null;
    return ok;
}

function GetSelectedCat(catlistid, minidx) {
    var n = document.getElementById(catlistid);
    var catname = null;
    if (n.selectedIndex < minidx) {
        document.getElementById("messagebox").innerHTML = "A category must be selected first.";
    } else {
        catname = n.options[n.selectedIndex].value;
    }
    n = null;
    catlistid = null;
    minidx = null;
    return catname;
}

function PrepareFolders(kindCode) {
    var catname = CurrentFolders[kindCode];
    if (!IsEnabledCat(catname)) catname = "All";
    CurrentFolders[kindCode] = catname;
    var n = document.getElementById("cat" + KindNames[kindCode] + "list");
    var c = document.getElementById("catlist");
    if ((n != null) && (c != null)) {
        RemoveAllChildren(n);
        if ((catname == null) || (catname.length == 0)) catname = "All";
        c = c.firstChild;
        while (c != null) {
            if (document.getElementById("enable" + c.id).checked) {
                var name = c.getAttribute("name");
                if ((name == "All") || (name.charAt(0) == "@")) {
                    var s = document.createElement("option");
                    n.options.add(s);
                    s.value = name;
                    s.innerHTML = name;
                    if (catname == name) s.selected = "selected";
                    s = null;
                }
                name = null;
            }
            c = c.nextSibling;
        }
    }
    n = null;
    c = null;
    ActivateFolders(KindNames[kindCode] + "list", catname);
    kindCode = null;
    catname = null;
}

function ActivateFolders(scrolllistid, catname) {
    var n = document.getElementById(scrolllistid);
    var count = 0;
    var isAll = ((catname == null) || (catname.length == 0) || (catname.toLowerCase() == "all"));
    n = n.firstChild;
    while (n != null) {
        var name = n.getAttribute("folder");
        if (IsEnabledCat(name) && (isAll || (name == catname))) {
            var i = n.className.indexOf("alt");
            if (count++ % 2) {
                if (i > 0) n.className = n.className.substring(0, i);
            } else {
                if (i < 0) n.className = (n.className + "alt");
            }
            n.style.display = "block";
            i = null;
        } else {
            n.style.display = "none";
        }
        name = null;
        n = n.nextSibling;
    }
    scrolllistid = null;
    catname = null;
    isAll = null;
    count = null;
}

function RenameFolder(listname, oldname, name) {
    var n = document.getElementById(listname);
    if (n != null) {
        n = n.firstChild;
        while (n != null) {
            if (n.getAttribute("folder") == oldname) {
                n.setAttribute("folder", name);
                document.getElementById(n.id + "catname").innerHTML = "Folder: " + name;
            }
            n = n.nextSibling;
        }
        var i = 0;
        if (listname.indexOf("page") >= 0) i = 1;
        else if (listname.indexOf("alert") >= 0) i = 2;
        if (CurrentFolders[i] == oldname) CurrentFolders[i] = name;
    }
    listname = null;
    oldname = null;
    name = null;
}

function FolderDropOnChange(ev) {
    try {
        var targ = GetClassNode(GetTarget(ev), "catdrops");
        if (targ != null) {
            var catname = targ.options[targ.selectedIndex].value;
            if (catname != null) {
                var sid = targ.id.substring(3);
                var i = 0;
                if (sid.indexOf("page") >= 0) i = 1;
                else if (sid.indexOf("alert") >= 0) i = 2;
                CurrentFolders[i] = catname;
                ActivateFolders(sid, catname);
                catname = null;
                i = null;
                sid = null;
            }
            targ = null;
        }
    } catch (e) {
    }
    ev = null;
}

function ShowContents(ev) {
    try {
        var targ = GetClassNode(GetTarget(ev), "feedtable");
        if (targ != null) {
            targ.style.backgroundColor = "#0080ff";
            if (LastNode != null && LastNode != targ) {
                LastNode.style.backgroundColor = (LastNode.className.indexOf("feedtablealt") >= 0) ? "#eeeeee" : "white";
                if (LastNode.className.indexOf("selected") >= 0) {
                    LastNode.className = LastNode.className.replace(" rowselected", "");
                }
            }
            var id = targ.id;
            var container = document.getElementById("rowcontents" + id);
            if (targ.className.indexOf("selected") >= 0) {
                targ.className = targ.className.replace(" rowselected", "");
                container.style.display = "none";
            } else {
                targ.className += " rowselected";
                container.style.display = "block";
            }
            LastNode = targ;
            LastId = targ.id;
            container = null;
            id = null;
            targ = null;
        }
    } catch (e) {
        BugReport("ShowContents exception:" + e.message);
    }
    ev = null;
}

function PopulateFilter(item, name) {
    var rootNode = document.getElementById("filterlist");
    var node = rootNode.firstChild;
    var p = 0, num = rootNode.childNodes.length;
    var lowname = name.toLowerCase();
    var doAdd = true;
    while (node != null) {
        var n = node.getAttribute("name").toLowerCase();
        if (n == lowname) {
            doAdd = false;
            break;
        }
        if (n > lowname) { n = null; break; }
        n = null;
        node = node.nextSibling;
        ++p;
    }
    if (doAdd) {
        var t = CreateTable();
        t.className = (p % 2) ? "filterfeedtablealt" : "filterfeedtable";
        t.onclick = FeedOnClick;
        var ct = UniqueID();
        var id = "Filter" + ct;
        ct = null;
        t.id = id;
        t.setAttribute("name", name);
        t.style.display = "block";
        if (node != null) {
            rootNode.insertBefore(t, node);
        } else {
            rootNode.appendChild(t);
        }

        var b = CreateTableHeader(t);
        t = null;

        var r = null;
        var d = null;
        var a = null;
        var s = null;
        var i = null;

        //
        r = document.createElement("tr");
        r.className = "filterrow";
        r.height = "20px";
        b.appendChild(r);

        d = document.createElement("td");
        r.appendChild(d);
        d.onclick = ShowContents;
        d.title = "Click to show options.";
        d.id = id + "filtername";
        d.innerHTML = name;
        d = null;
        //

        d = document.createElement("td");
        d.align = "right";
        r.appendChild(d);
        a = document.createElement("a");
        a.innerHTML = "X";
        a.className = "delete";
     //X   a.id = "deletefilterbutton"; //?
        a.title = "Press this to delete filter."
        a.onclick = DeleteButtonOnClick;
        d.appendChild(a);
        s = document.createElement("span");
        s.innerHTML = "&nbsp;";
        d.appendChild(s);
        a = null;
        s = null;
        d = null;
        //
        r = document.createElement("tr");
        r.className = "filterrow";
        b.appendChild(r);
        d = document.createElement("td");
        d.colSpan = "2";
        r.appendChild(d);
 
        var v = document.createElement("div");
        v.className = "rowcontents"
        v.id = "rowcontents" + id;
        v.style.display = "none";
        d.appendChild(v);
        var ta = document.createElement("textarea");
        ta.className = "filtertextarea";
        ta.id = "regex" + id;
        ta.value = SetLocalValue(item, null, "");
        v.appendChild(ta);
        ta = null;
        v = null;
        //...
        
        r = null;
        b = null;
    }
    id = null;
    name = null;
    lowname = null;
    num = null;
    item = null;
    node = null;
    rootNode = null;
}

function GetFilterNode(name) {
    if (name != null && name.length > 0) {
        var n = document.getElementById("filterlist")
        if (n != null) {
            n = n.firstChild;
            name = name.toLowerCase();
            while (n != null) {
                if (n.getAttribute("name").toLowerCase() == name) {
                    name = null;
                    return n;
                }
                n = n.nextSibling;
            }
        }
    }
    name = null;
    return null;
}

function CreateFilter(name) {
    if (name!=null && name.length>0 && GetFilterNode(name) == null) {
        PopulateFilter(null, name);
        UpdateBands(document.getElementById("filterlist").firstChild);
    }
    return name;
}

function AddFilterOnClick(ev) {
    try {
        var name = document.getElementById("filtername").value;
        if (name == null) {
            document.getElementById("messagebox").innerHTML = "Enter a name first."
        } else {
            name = Trim(name).replace(/\|/g, ':');
            if ((name.length > 0) && (GetFilterNode(name) == null)) {
                CreateFilter(name);
                document.getElementById("messagebox").innerHTML = "";
            } else {
                document.getElementById("messagebox").innerHTML = "A valid name that does not exist must be entered.";
            }
        }
        name = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Filter could not be added.";
    }
    ev = null;
}

function PopulateFilterList(f, n, filtername) {
    if (f !=null && n != null) {
        RemoveAllChildren(n);
        if ((filtername == null) || (filtername.length == 0)) filtername = "";
        var c = f.firstChild;
        if (c != null) {
            var s = document.createElement("option");
            n.options.add(s);
            s.value = "";
            s.innerHTML = "";
            s = null;
            while (c != null) {
                var name = c.getAttribute("name");
                s = document.createElement("option");
                n.options.add(s);
                s.value = name;
                s.innerHTML = name;
                if (filtername == name) s.selected = "selected";
                s = null;
                name = null;
                c = c.nextSibling;
            }
        }
        n = null;
    }
    filtername = null;
}

function FindInSelect(n, name) {
    var c = -1;
    if (n != null && name!=null) {
        c = 0;
        n = n.firstChild;
        while (n != null) {
            if (n.value == name) break;
            ++c;
            n = n.nextSibling;
        }
        if (n == null) c = -1;
    }
    n = null;
    name = null;
    return c;
}

function RemoveFromSelect(n, name) {
    var c = FindInSelect(n, name);
    if (c >= 0) {
        n.remove(c);
    }
    n = null;
    name = null;
}

function DeleteFromFilterFolders(name) {
    var c = document.getElementById("catlist");
    if (c != null && name!=null && name.length>0) {
        c = c.firstChild;
        while (c != null) {
            if (c.getAttribute("includefilter") == name) {
                c.setAttribute("includefilter") = "";
            }
            if (c.getAttribute("excludefilter") == name) {
                c.setAttribute("excludefilter") = "";
            }
            var id = "catfilterinclude" + c.id;
            RemoveFromSelect(document.getElementById(id), name);
            id = "catfilterexclude" + c.id;
            RemoveFromSelect(document.getElementById(id), name);
            c = c.nextSibling;
        }
    }
    name = null;
    c = null;
}

function UpdateFilterFolders() {
    var c = document.getElementById("catlist");
    var f = document.getElementById("filterlist");
    if (f != null && c != null) {
        c = c.firstChild;
        while (c != null) {
            var id = "catfilterinclude" + c.id;
            var n = document.getElementById(id);
            PopulateFilterList(f, n, c.getAttribute("includefilter"));
            id = "catfilterexclude" + c.id;
            n = document.getElementById(id);
            PopulateFilterList(f, n, c.getAttribute("excludefilter"));
            c = c.nextSibling;
        }
    }
    f = null;
    c = null;
}

function FilterFolderOnChange(ev) {
    try {
        var targ = GetClassNode(GetTarget(ev), "filterdrops");
        if (targ != null) {
            var name = (targ.selectedIndex >= 0) ? targ.options[targ.selectedIndex].value : "";
            if (name != null) {
                var t = GetClassNode(targ,"feedtable");
                if (t != null) {
                    t.setAttribute((targ.id.indexOf("include") > 0) ? "includefilter" : "excludefilter", name);
                    t = null;
                }
                name = null;
            }
            targ = null;
        }
    } catch (e) {
    }
    ev = null;
}

function PopulateCat(item, name, isenabled) {
    var rootNode = document.getElementById("catlist");
    var node = rootNode.firstChild;
    var p = 0, num = rootNode.childNodes.length;
    var lowname = name.toLowerCase();
    var isAll = (lowname == "all"), doAdd = true;
    if (isAll) {
        num = 0;
        item = null;
        isenabled = true;
    }
    while (node != null) {
        var n = node.getAttribute("name").toLowerCase();
        if (n == lowname) {
            document.getElementById("enable" + node.id).checked = SetLocalFlag(item, "enable", isenabled);
            if (name.charAt(0) == "@") {
                document.getElementById("color" + node.id).value = SetLocalValue(item, "color", "");
            }
            doAdd = false;
            break;
        }
        if ((n != "all") && (n > lowname)) { n = null; break; }
        n = null;
        node = node.nextSibling;
        ++p;
    }
    if (doAdd) {
        var t = CreateTable();
        t.className = (p % 2) ? "catfeedtablealt" : "catfeedtable";
        t.onclick = FeedOnClick;
        var ct = UniqueID();
        var id = "Cat" + ct;
        ct = null;
        t.id = id;
        t.setAttribute("name", name);
        t.setAttribute("includefilter", SetLocalValue(item, "includefilter", ""));
        t.setAttribute("excludefilter", SetLocalValue(item, "excludefilter", ""));
        if (isAll) {
            t.style.display = "none";
        } else {
            t.style.display = "block";
        }
        if (node != null) {
            rootNode.insertBefore(t, node);
        } else {
            rootNode.appendChild(t);
        }

        var b = CreateTableHeader(t);
        t = null;

        var isFolder = (name.charAt(0) == "@");

        var r = null;
        var d = null;
        var a = null;
        var s = null;
        var i = null;

        //
        r = document.createElement("tr");
        r.className = "catrow";
        b.appendChild(r);

        d = document.createElement("td");
        d.style.width = "20px";
        r.appendChild(d);
        i = document.createElement("input");
        i.type = "checkbox";
        i.name = "enable";
        i.id = "enable" + id;
        d.appendChild(i);
        i.title = (isFolder ? "Check this to display feeds belonging to this folder." :
                    "Check (uncheck) this to enable (disable) category during filtering.");
        i.style.margin = "0px";
        i.onclick = CheckBoxOnClick;
        i.checked = SetLocalFlag(item, "enable", isenabled);
        d = null;
        i = null;

        d = document.createElement("td");
        r.appendChild(d);
        d.onclick = ShowContents;
        d.title = "Click to show options.";
        d.id = id + "catname";
        d.innerHTML = name;
        d = null;

        d = document.createElement("td");
        d.align = "right";
        r.appendChild(d);
        a = document.createElement("a");
        a.innerHTML = "X";
        a.className = "delete";
      //X  a.id = "deletecatbutton"; //?
        a.title = "Press this to delete category."
        a.onclick = DeleteButtonOnClick;
        d.appendChild(a);
        s = document.createElement("span");
        s.innerHTML = "&nbsp;";
        d.appendChild(s);
        a = null;
        s = null;
        d = null;

        r = null;
        if (isFolder) {
            r = document.createElement("tr");
            r.className = "catrow";
            b.appendChild(r);
            d = document.createElement("td");
            d.colSpan = "4";
            r.appendChild(d);
            var v = document.createElement("div");
            v.className = "rowcontents"
            v.id = "rowcontents" + id;
            v.style.display = "none";
            d.appendChild(v);

            t = CreateTable();
            t.className = "rowtable";
            v.appendChild(t);
            b = CreateTableHeader(t);
            r = document.createElement("tr");
            b.appendChild(r);
            d = document.createElement("td");
            r.appendChild(d);
            d.innerHTML = "Text color: ";
            d.title = "Enter the text color for feeds belonging to this folder, blank=default.";
            d = document.createElement("td");
            r.appendChild(d);
            i = document.createElement("input");
            i.type = "text";
            i.className = "feedcolor";
            i.id = "color" + id;
            i.value = SetLocalValue(item, "color", "");
            d.appendChild(i);
            AddColorPicker(i.id);
            i = null;
            d = null;
            r = null;
            
            r = document.createElement("tr");
            b.appendChild(r);
            d = document.createElement("td");
            r.appendChild(d);
            d.innerHTML = "Include filter: ";
            d.title = "Permitted items must match selected filter.";
            d = document.createElement("td");
            r.appendChild(d);
            f = document.createElement("select");
            f.className = "filterdrops";
            f.size = "1";
            f.id = "catfilterinclude" + id;
            f.onchange = FilterFolderOnChange;
            d.appendChild(f);
            f = null;
            d = null;
            r = null;

            r = document.createElement("tr");
            b.appendChild(r);
            d = document.createElement("td");
            r.appendChild(d);
            d.innerHTML = "Exclude filter: ";
            d.title = "Permitted items must not match selected filter.";
            d = document.createElement("td");
            r.appendChild(d);
            f = document.createElement("select");
            f.className = "filterdrops";
            f.size = "1";
            f.id = "catfilterexclude" + id;
            f.onchange = FilterFolderOnChange;
            d.appendChild(f);
            f = null;
            d = null;
            r = null;
        }
        
        b = null;
    }
    id = null;
    name = null;
    lowname = null;
    num = null;
    item = null;
    node = null;
    rootNode = null;
    isenabled = null;
}

function PopulateFeed(num, item, id, name, url, usefm, applyrules, catname, isatom) {
    catname = SetLocalValue(item, "folder", catname)
    var rootNode = document.getElementById("feedlist");
    var t = CreateTable();
    t.className = (num % 2) ? "feedtable" : "feedtablealt";
    t.style.display = IsEnabledCat(catname) ? "block" : "none";
    t.id = id;
    t.setAttribute("folder", catname);
    t.setAttribute("name", name);
    t.setAttribute("url", url);
    t.setAttribute("atom", SetLocalValue(item, "atom", isatom ? "true" : "false"));
    t.onclick = FeedOnClick;
    rootNode.appendChild(t);
    rootNode = null;

    var b = CreateTableHeader(t);
    t = null;

    var r = null;
    var d = null;
    var a = null;
    var s = null;
    var i = null;

    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    
    d = document.createElement("td");
    r.appendChild(d);
    d.align = "left";
    d.width = "20px";
    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "enable";
    i.id = "enable" + id;
    i.title = "Check this to display the feed in the scrolling list.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "enable", false);
    i = null;
    d = null;
    
    d = document.createElement("td");
    r.appendChild(d);
    d.onclick = ShowContents;
    d.align = "left";
    d.innerHTML = name;
    d.title = url + "\nClick to show options.";
    d = null;

    d = document.createElement("td");
    r.appendChild(d);
    d.align = "right";
    a = document.createElement("a");
    a.innerHTML = "X";
    a.className = "delete";
    //X    a.id = "deletebutton"; //?
    a.title = "Press this to delete feed."
    a.onclick = DeleteButtonOnClick;
    d.appendChild(a);
    a = null;
    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    d.appendChild(s);
    s = null;
    d = null;
    r = null;
    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    b = null;
    d = document.createElement("td");
    d.colSpan = "3";
    r.appendChild(d);
    var v = document.createElement("div");
    v.className = "rowcontents"
    v.id = "rowcontents" + id;
    v.style.display = "none";
    d.appendChild(v);
    d = null;
    //
    t = CreateTable();
    t.className = "rowtable";
    v.appendChild(t);
    b = CreateTableHeader(t);
    v = null;
    t = null;
    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);
    s = document.createElement("span");
    s.innerHTML = "Folder: " + catname;
    s.id = id + "catname";
    d.appendChild(s);
    s = null;
    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "applyrules";
    i.id = "applyrules" + id;
    i.title = "Check this to apply common rules to feed items.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = applyrules;
    s = document.createElement("span");
    s.innerHTML = "Apply rules&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "displayname";
    i.id = "displayname" + id;
    i.title = "Check this to display the feed name over each news item in the scrolling list.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "displayname", false);
    s = document.createElement("span");
    s.innerHTML = "Show name&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "usefm";
    i.id = "usefm" + id;
    i.title = "Check this to load items via FeedsManager.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = usefm;
    s = document.createElement("span");
    s.innerHTML = "Use FM";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;
    
    d = null;
    r = null;
    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);


    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "comparecontent";
    i.id = "comparecontent" + id;
    i.title = "Check this to include item content in comparison tests.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "comparecontent", false);
    s = document.createElement("span");
    s.innerHTML = "Compare content&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;
    
    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "prune";
    i.id = "prune" + id;
    i.title = "Check this to prune duplicate items from feed.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "prune", false);
    s = document.createElement("span");
    s.innerHTML = "Prune duplicates&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    d = null;
    r = null;
    //
    
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = "Color:";
    s.title = "Enter the feed text color, blank = default.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "feedcolor";
    i.id = "color" + id;
    i.value = SetLocalValue(item, "color", "");
    d.appendChild(i);
    AddColorPicker(i.id);
    s = null;
    i = null;
    
    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;Interval:";
    d.appendChild(s);
    s = null;

    i = document.createElement("input");
    i.type = "text";
    i.className = "interval";
    i.title = "Set feed refresh interval, default units in minutes.";
    i.id = "interval" + id;
    i.value = SetLocalValue(item, "interval", "20");
    d.appendChild(i);
    i = null;

    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;Top X:";
    d.appendChild(s);
    s = null;

    i = document.createElement("input");
    i.type = "text";
    i.className = "topx";
    i.title = "When non zero, only this many articles will be read from feed.";
    i.id = "topx" + id;
    i.value = SetLocalValue(item, "topx", "0");
    d.appendChild(i);
    i = null;
    
    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = "Date format:";
    s.title = "Enter a date input format string, see help for syntax, blank = default.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.title = s.title;
    i.className = "feeddateformat";
    i.id = "dateformat" + id;
    i.value = SetLocalValue(item, "dateformat", (isatom&&(item==null))?"y-M-dTHH:m:s":"");
    d.appendChild(i);
    i = null;
    s = null;
    d = null;
    r = null;

    b = null;
    id = null;
    item = null
    name = null;
    catname = null;
    url = null;
    num = null;
}

function PageShowTab(ev) {
    try {
        var targ = GetTarget(ev);
        var element = targ;
        targ = GetClassNode(targ,"pagefeedtable");
        var id = targ.id;
        var tabcontainer = document.getElementById("pagetabcontainer" + id);
        var len = tabcontainer.childNodes.length;
        for (var i = 0; i < len; i++) {
            tabcontainer.childNodes[i].className = "pagetab";
        }
        tabcontainer = null;
        element.className = "pagetab pageselectedtab";
        SetDisplay("pageconoptions" + id, "none");
        SetDisplay("pageconsuccess" + id, "none");
        SetDisplay("pageconreject" + id, "none");
        SetDisplay("pageconfail" + id, "none");
        SetDisplay("pageconurl" + id, "none");
        SetDisplay("pageconpattern" + id, "none");
        SetDisplay("pageconfunc" + id, "none");
        SetDisplay("pagecon" + element.innerHTML + id, "block");
        id = null;
        targ = null;
        element = null;
    } catch (e) {
        BugReport("PageShowTab exception:" + e.message);
    }
    ev = null;
}

function PopulatePage(num, item, id, catname) {
    var rootNode = document.getElementById("pagelist");
    var t = CreateTable();
    t.className = (num % 2) ? "pagefeedtable" : "pagefeedtablealt";
    t.id = id;
    catname = SetLocalValue(item, "folder", catname);
    t.setAttribute("folder", catname);
    t.onclick = FeedOnClick;
    rootNode.appendChild(t);
    rootNode = null;

    var b = CreateTableHeader(t);
    t = null;

    var r = null;
    var d = null;
    var a = null;
    var s = null;
    var i = null;
    var v = null;
    var q = null;

    //
    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);

    d = document.createElement("td");
    r.appendChild(d);
    d.align = "left";
    d.width = "20px";
    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "enable";
    i.id = "enable" + id;
    i.title = "Check this to display the page in the scrolling list.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "enable", false);
    i = null;
    s = null;
    
    d = document.createElement("td");
    r.appendChild(d);
    d.onclick = ShowContents;
    d.title = "Click to show options.";
    d.align = "left";
    var ta = document.createElement("input");
    ta.className = "pagename";
    ta.id = "name" + id;
    ta.value = SetLocalValue(item, "name", "My name for this page.");
    d.appendChild(ta);
    ta = null;
    d = null;
    
    d = document.createElement("td");
    r.appendChild(d);
    d.align = "right";
    a = document.createElement("a");
    a.innerHTML = "X";
    a.className = "pagedelete";
    //X   a.id = "deletepagebutton"; //?
    a.title = "Press this to delete page."
    a.onclick = DeleteButtonOnClick;
    d.appendChild(a);
    a = null;
    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    d.appendChild(s);
    s = null;
    d = null;
    r = null;

    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    b = null;
    d = document.createElement("td");
    d.colSpan = "3";
    r.appendChild(d);
    r = null;
    q = document.createElement("div");
    q.className = "rowcontents"
    q.id = "rowcontents" + id;
    q.style.display = "none";
    d.appendChild(q);
    d = null;
    //
    d = q;
    v = document.createElement("div");
    v.className = "pagetabcontrol";
    v.id = "pagetabcontainer" + id;
    d.appendChild(v);

    q = document.createElement("div");
    q.className = "pagetab pageselectedtab";
    q.id = "pagetaboptions" + id;
    q.style.display = "block";
    q.innerHTML = "options";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "pagetab";
    q.id = "pagetaburl" + id;
    q.style.display = "block";
    q.innerHTML = "url";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "pagetab";
    q.id = "pagetabpattern" + id;
    q.style.display = "block";
    q.innerHTML = "pattern";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "pagetab";
    q.id = "pagetabfunc" + id;
    q.style.display = "block";
    q.innerHTML = "func";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "pagetab";
    q.id = "pagetabsuccess" + id;
    q.style.display = "block";
    q.innerHTML = "success";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "pagetab";
    q.id = "pagetabreject" + id;
    q.style.display = "block";
    q.innerHTML = "reject";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "pagetab";
    q.id = "pagetabfail" + id;
    q.style.display = "block";
    q.innerHTML = "fail";
    q.onclick = PageShowTab;
    v.appendChild(q);
    q = null;
    v = null;

    //...
    var vo = document.createElement("div");
    vo.className = "pagetabcontents"
    vo.id = "pageconoptions" + id;
    vo.style.display = "block";
    d.appendChild(vo);

    //...
    v = document.createElement("div");
    v.className = "pagetabcontents"
    v.id = "pageconsuccess" + id;
    v.style.display = "none";
    d.appendChild(v);
    s = document.createElement("span");
    s.innerHTML = "Title:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "successtitle" + id;
    ta.value = SetLocalValue(item, "successtitle", "Page has changed.");
    v.appendChild(ta);
    ta = null;
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Description:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "successdescription" + id;
    ta.value = SetLocalValue(item, "successdescription", "Page hashcode is $#.");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "pagetabcontents"
    v.id = "pageconreject" + id;
    v.style.display = "none";
    d.appendChild(v);
    s = document.createElement("span");
    s.innerHTML = "Title:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "rejecttitle" + id;
    ta.value = SetLocalValue(item, "rejecttitle", "");
    v.appendChild(ta);
    ta = null;
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Description:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "rejectdescription" + id;
    ta.value = SetLocalValue(item, "rejectdescription", "");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "pagetabcontents"
    v.id = "pageconfail" + id;
    v.style.display = "none";
    d.appendChild(v);
    s = document.createElement("span");
    s.innerHTML = "Title:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "failtitle" + id;
    ta.value = SetLocalValue(item, "failtitle", "Unable to load page.");
    v.appendChild(ta);
    ta = null;
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Description:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "faildescription" + id;
    ta.value = SetLocalValue(item, "faildescription", "The page could not be loaded at this time.");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "pagetabcontents"
    v.id = "pageconurl" + id;
    v.style.display = "none";
    d.appendChild(v);
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "url" + id;
    ta.value = SetLocalValue(item, "url", "http://www.pageurl.com");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "pagetabcontents"
    v.id = "pageconpattern" + id;
    v.style.display = "none";
    d.appendChild(v);
    ta = document.createElement("textarea");
    ta.className = "pagetabarea";
    ta.id = "pattern" + id;
    ta.value = SetLocalValue(item, "pattern", "");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "pagetabcontents"
    v.id = "pageconfunc" + id;
    v.style.display = "none";
    d.appendChild(v);
    ta = document.createElement("textarea");
    ta.className = "pagetabareafunc";
    ta.id = "func" + id;
    ta.value = SetLocalValue(item, null, "StandardPageCheck");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    q = null;
    d = null;
    r = null;

    // Options.
    t = CreateTable();
    t.className = "rowtable";
    vo.appendChild(t);
    vo = null;
    b = CreateTableHeader(t);
    t = null;
    
    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);
    s = document.createElement("span");
    s.innerHTML = "Folder: " + catname;
    s.id = id + "catname";
    d.appendChild(s);
    s = null;
    d = null;
    r = null;
    //
    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);
    
    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "applyrules";
    i.id = "applyrules" + id;
    i.title = "Check this to apply common rules to page items.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "applyrules", true);
    s = document.createElement("span");
    s.innerHTML = "Apply rules&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "displayname";
    i.id = "displayname" + id;
    i.title = "Check this to display the page name over each item in the scrolling list.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "displayname", false);
    s = document.createElement("span");
    s.innerHTML = "Show name&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "headers";
    i.id = "headers" + id;
    i.title = "Check this to test header timestamp.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "headers", false);
    s = document.createElement("span");
    s.innerHTML = "Timestamp";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "comparecontent";
    i.id = "comparecontent" + id;
    i.title = "Check this to include item content in comparison tests.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "comparecontent", true);
    s = document.createElement("span");
    s.innerHTML = "Compare content&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "ignore";
    i.id = "ignore" + id;
    i.title = "Check this to skip reporting when no matches occur.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "ignore", "true");
    s = document.createElement("span");
    s.innerHTML = "Ignore&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "matchpositions";
    i.id = "matchpositions" + id;
    i.title = "Check this to include match positions.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "matchpositions", false);
    s = document.createElement("span");
    s.innerHTML = "Positions ";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = "Color:";
    s.title = "Enter the page text color, blank = default.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "feedcolor";
    i.id = "color" + id;
    i.title = s.title;
    i.value = SetLocalValue(item, "color", "");
    d.appendChild(i);
    AddColorPicker(i.id);
    s = null;
    i = null;

    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;Interval:";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "interval";
    i.title = "Set feed refresh interval, default units in minutes.";
    i.id = "interval" + id;
    i.value = SetLocalValue(item, "interval", "1440");
    d.appendChild(i);
    s = null;
    i = null;

    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = "Sort submatch index:";
    s.title = "Set to submatch index to use in sort, no sort = -1.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "submatchindex";
    i.id = "submatchindex" + id;
    i.title = s.title;
    i.value = SetLocalValue(item, "submatchindex", "-1");
    d.appendChild(i);
    s = null;
    i = null;

    d = null;
    r = null;
   
    //
    r = document.createElement("tr");
    r.className = "feedrow";
    b.appendChild(r);
    d = document.createElement("td");
    d.colSpan = "2";
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = "Date format:";
    s.title = "Enter a date input format string, see help for syntax, blank = default.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "feeddateformat";
    i.id = "dateformat" + id;
    i.value = SetLocalValue(item, "dateformat", "");
    d.appendChild(i);
    i = null;
    s = null;
    d = null;
    r = null;
    
    b = null;
    id = null;
    item = null;
    num = null;
    catname = null;
}

function HasFeedsManager() {
    try {
        if (FeedsManager == null) {
            var pw = System.Gadget.document.parentWindow;
            FeedsManager = pw.FeedsManager;
            if (FeedsManager == null) {
                FeedsManager = new ActiveXObject("Microsoft.FeedsManager");
                pw.FeedsManager = FeedsManager;
            }
            pw = null;
        }
    } catch (e) {
        BugReport("HasFeedsManager exception: " + e.message);
    }
    return FeedsManager != null;
}
//
function AlertShowTab(ev) {
    try {
        var targ = GetTarget(ev);
        var element = targ;
        targ = GetClassNode(targ,"alertfeedtable");
        var id = targ.id;
        var tabcontainer = document.getElementById("alerttabcontainer" + id);
        var len = tabcontainer.childNodes.length;
        for (var i = 0; i < len; i++) {
            tabcontainer.childNodes[i].className = "alerttab";
        }
        element.className = "alerttab alertselectedtab";
        SetDisplay("alertconoptions" + id, "none");
        SetDisplay("alertconsuccess" + id, "none");
        SetDisplay("alertconpattern" + id, "none");
        SetDisplay("alertconfunc" + id, "none");
        SetDisplay("alertcon" + element.innerHTML + id, "block");
        len = null;
        id = null;
        targ = null;
        element = null;
        tabcontainer = null;
    } catch (e) {
        BugReport("AlertShowTab exception:" + e.message);
    }
    ev = null;
}

function PopulateAlert(num, item, id, catname) {
    var rootNode = document.getElementById("alertlist");
    var t = CreateTable();
    t.className = (num % 2) ? "alertfeedtable" : "alertfeedtablealt";
    t.id = id;
    catname = SetLocalValue(item, "folder", catname);
    t.setAttribute("folder", catname);
    t.onclick = FeedOnClick;
    rootNode.appendChild(t);
    rootNode = null;

    var b = CreateTableHeader(t);
    t = null;

    var r = null;
    var d = null;
    var a = null;
    var s = null;
    var i = null;
    var v = null;
    var q = null;

    //
    r = document.createElement("tr");
    r.className = "alertrow";
    b.appendChild(r);
    //
    d = document.createElement("td");
    r.appendChild(d);
    d.align = "left";
    d.width = "20px";
    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "enable";
    i.id = "enable" + id;
    i.title = "Check this to display the alert in the scrolling list.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "enable", false);
    i = null;
    s = null;

    d = document.createElement("td");
    r.appendChild(d);
    d.onclick = ShowContents;
    d.title = "Click to show options.";
    d.align = "left";
    var ta = document.createElement("input");
    ta.className = "pagename";
    ta.id = "name" + id;
    ta.value = SetLocalValue(item, "name", "My name for this alert.");
    d.appendChild(ta);
    ta = null;
    d = null;

    d = document.createElement("td");
    r.appendChild(d);
    d.align = "right";
    a = document.createElement("a");
    a.innerHTML = "X";
    a.className = "alertdelete";
    //X   a.id = "deletealertbutton"; //?
    a.title = "Press this to delete alert."
    a.onclick = DeleteButtonOnClick;
    d.appendChild(a);
    a = null;
    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    d.appendChild(s);
    s = null;
    d = null;
    r = null;

    r = document.createElement("tr");
    r.className = "pagerow";
    b.appendChild(r);
    b = null;
    d = document.createElement("td");
    d.colSpan = "3";
    r.appendChild(d);
    r = null;
    q = document.createElement("div");
    q.className = "rowcontents"
    q.id = "rowcontents" + id;
    q.style.display = "none";
    d.appendChild(q);
    d = null;
    //
    d = q;
    v = document.createElement("div");
    v.className = "alerttabcontrol";
    v.id = "alerttabcontainer" + id;
    d.appendChild(v);

    q = document.createElement("div");
    q.className = "alerttab alertselectedtab";
    q.id = "alerttaboption" + id;
    q.style.display = "block";
    q.innerHTML = "options";
    q.onclick = AlertShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "alerttab";
    q.id = "alerttabpattern" + id;
    q.style.display = "block";
    q.innerHTML = "pattern";
    q.onclick = AlertShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "alerttab";
    q.id = "alerttabfunc" + id;
    q.style.display = "block";
    q.innerHTML = "func";
    q.onclick = AlertShowTab;
    v.appendChild(q);
    q = null;

    q = document.createElement("div");
    q.className = "alerttab";
    q.id = "alerttabsuccess" + id;
    q.style.display = "block";
    q.innerHTML = "success";
    q.onclick = AlertShowTab;
    v.appendChild(q);
    q = null;
    v = null;

    //...
    var vo = document.createElement("div");
    vo.className = "alerttabcontents"
    vo.id = "alertconoptions" + id;
    vo.style.display = "block";
    d.appendChild(vo);

    //...
    v = document.createElement("div");
    v.className = "alerttabcontents"
    v.id = "alertconsuccess" + id;
    v.style.display = "none";
    d.appendChild(v);
    s = document.createElement("span");
    s.innerHTML = "Title:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "successtitle" + id;
    ta.value = SetLocalValue(item, "successtitle", "Alert triggered.");
    v.appendChild(ta);
    ta = null;
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Description:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "successdescription" + id;
    ta.value = SetLocalValue(item, "successdescription", "Alert hashcode is $#.");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "alerttabcontents"
    v.id = "alertconpattern" + id;
    v.style.display = "none";
    d.appendChild(v);
    //--
    s = document.createElement("span");
    s.innerHTML = "Folder:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "patternfolder" + id;
    ta.value = SetLocalValue(item, "patternfolder", "");
    v.appendChild(ta);
    ta = null
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Categories:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "patterncategories" + id;
    ta.value = SetLocalValue(item, "patterncategories", "");
    v.appendChild(ta);
    ta = null
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Name:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "patternname" + id;
    ta.value = SetLocalValue(item, "patternname", "");
    v.appendChild(ta);
    ta = null
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Title:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "patterntitle" + id;
    ta.value = SetLocalValue(item, "patterntitle", "");
    v.appendChild(ta);
    ta = null;
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Description:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "patterndescription" + id;
    ta.value = SetLocalValue(item, "patterndescription", "");
    v.appendChild(ta);
    ta = null;
    //--
    s = document.createElement("span");
    s.innerHTML = "<br/>Link:";
    v.appendChild(s);
    s = null;
    ta = document.createElement("textarea");
    ta.className = "alerttabarea";
    ta.id = "patternlink" + id;
    ta.value = SetLocalValue(item, "patternlink", "");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    v = document.createElement("div");
    v.className = "alerttabcontents"
    v.id = "alertconfunc" + id;
    v.style.display = "none";
    d.appendChild(v);
    ta = document.createElement("textarea");
    ta.className = "alerttabareafunc";
    ta.id = "func" + id;
    ta.value = SetLocalValue(item, null, "StandardAlertCheck");
    v.appendChild(ta);
    ta = null;
    v = null;
    //...
    q = null;
    d = null;
    r = null;

    // Options.
    t = CreateTable();
    t.className = "rowtable";
    vo.appendChild(t);
    vo = null;
    b = CreateTableHeader(t);
    t = null;
        
    r = document.createElement("tr");
    r.className = "alertrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);
    s = document.createElement("span");
    s.innerHTML = "Folder: " + catname;
    s.id = id + "catname";
    d.appendChild(s);
    s = null;
    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "alertrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "applyrules";
    i.id = "applyrules" + id;
    i.title = "Check this to apply common rules to alert items.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "applyrules", true);
    s = document.createElement("span");
    s.innerHTML = "Apply rules&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "displayname";
    i.id = "displayname" + id;
    i.title = "Check this to display the alert name over each item in the scrolling list.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "displayname", false);
    s = document.createElement("span");
    s.innerHTML = "Show name&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "ashtml";
    i.id = "ashtml" + id;
    i.title = "Check this to send email in html format.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "ashtml", "false");
    s = document.createElement("span");
    s.innerHTML = "HTML ";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    d = null;
    r = null;

    //
    r = document.createElement("tr");
    r.className = "alertrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "comparecontent";
    i.id = "comparecontent" + id;
    i.title = "Check this to include item content in comparison tests.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "comparecontent", true);
    s = document.createElement("span");
    s.innerHTML = "Content&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;
    
    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "playsound";
    i.id = "playsound" + id;
    i.title = "Check this to play sound when alert occurs.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "playsound", false);
    s = document.createElement("span");
    s.innerHTML = "Sound&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "showinflyout";
    i.id = "showinflyout" + id;
    i.title = "Check this to show alert in flyout.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "showinflyout", false);
    s = document.createElement("span");
    s.innerHTML = "Flyout&nbsp;&nbsp;";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    i = document.createElement("input");
    i.type = "checkbox";
    i.name = "email";
    i.id = "email" + id;
    i.title = "Check this to email report when alert occurs.";
    i.style.margin = "0px";
    i.onclick = CheckBoxOnClick;
    d.appendChild(i);
    i.checked = SetLocalFlag(item, "email", "false");
    s = document.createElement("span");
    s.innerHTML = "Email";
    s.title = i.title;
    d.appendChild(s);
    i = null;
    s = null;

    d = null;
    r = null;


    //
    r = document.createElement("tr");
    r.className = "alertrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = "Color:";
    s.title = "Enter the alert text color, blank = default.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "feedcolor";
    i.id = "color" + id;
    i.title = s.title;
    i.value = SetLocalValue(item, "color", "");
    d.appendChild(i);
    AddColorPicker(i.id);
    s = null;
    i = null;

    s = document.createElement("span");
    s.innerHTML = "&nbsp;&nbsp;Interval:";
    d.appendChild(s);
    s = null;

    i = document.createElement("input");
    i.type = "text";
    i.className = "interval";
    i.title = "Set feed refresh interval, default units in minutes.";
    i.id = "interval" + id;
    i.value = SetLocalValue(item, "interval", "20");
    d.appendChild(i);
    i = null;

    d = null;
    r = null;
    
    //
    r = document.createElement("tr");
    r.className = "alertrow";
    b.appendChild(r);
    d = document.createElement("td");
    r.appendChild(d);

    s = document.createElement("span");
    s.innerHTML = " To: ";
    s.title = "To email address.";
    d.appendChild(s);
    i = document.createElement("input");
    i.type = "text";
    i.className = "toaddress";
    i.title = s.title;
    i.id = "toaddress" + id;
    i.value = SetLocalValue(item, "toaddress", "");
    d.appendChild(i);
    s = null;
    i = null;

    b = null;
    id = null;
    item = null;
    num = null;
    catname = null;
}
//
function TestProxy(ev) {
    try {
        var errorbox = document.getElementById("messagebox");
        errorbox.innerHTML = "Testing settings...";
        if (TestLoader == null) {
            TestLoader = new ActiveXObject(ServerXMLHTTPProgID);
        }
        if (TestLoader == null) {
            errorbox.innerHTML = "Could not create proxy server object.";
        } else {
            TestLoader.setProxy(2, document.getElementById("proxyserver").value);
            TestLoader.setTimeouts(50000, 50000, 50000, 50000);
            TestLoader.open("GET", "http://www.microsoft.com", false);
            if (document.getElementById("proxyusername").value.length > 0) {
                TestLoader.setProxyCredentials(document.getElementById("proxyusername").value, document.getElementById("proxypassword").value);
            }
            TestLoader.send();
            if ((TestLoader.readyState == 4) && (TestLoader.status == 200)) {
                if (TestLoader.responseText.indexOf("<title>Microsoft Corporation</title>") >= 0) {
                    errorbox.innerHTML = "Settings seems to be okay.";
                } else {
                    errorbox.innerHTML = "Connection test did not return the expected contents.";
                }
            } else {
                errorbox.innerHTML = "Settings are not okay!";
            }
        }
        errorbox = null;
    }
    catch (e) {
        document.getElementById("messagebox").innerHTML = e.message;
    }
    ev = null;
}

function GetFeedNode(url, name) {
    var node = null;
    if (((url != null) && (url.length > 0)) || ((name != null) && (name.length > 0))) {
        var f = document.getElementById("feedlist").firstChild;
        while (f != null) {
            if ((f.getAttribute("url") == url) || (f.getAttribute("name") == name)) {
                node = f;
                break;
            }
            f = f.nextSibling;
        }
        f = null;
    }
    url = null;
    name = null;
    return node;
}

function AddFeed(usefm, catname) {
    try {
        var errorbox = document.getElementById("messagebox");
        var url = document.getElementById("newurl").value;
        var isatom = false;
        do {
            errorbox.innerHTML = "";
            if ((url == null) || (url.length == 0)) {
                errorbox.innerHTML = "Enter a valid url.";
                break;
            }
            if (TmpDoc == null) {
                TmpDoc = new ActiveXObject(DOMDocumentProgID);
                if (TmpDoc == null) {
                    errorbox.innerHTML = "Could not create DOM object.";
                    break;
                }
                TmpDoc.async = false;
                TmpDoc.setProperty("ProhibitDTD", false); 
            }
            if (usefm) {
                if (!HasFeedsManager()) {
                    errorbox.innerHTML = "Could not access FeedsManager.";
                    break;
                }
                var feed = null;
                try {
                    feed = FeedsManager.GetFeedByUrl(url);
                } catch (e) {
                    feed = null;
                }
                if (feed == null) {
                    errorbox.innerHTML = "Try adding feed to FM first.";
                    break;
                }
                feed.Download();
                var xml = feed.Xml(1000, 0, 0, 0, 0);
                feed = null;
                if (xml == null) {
                    errorbox.innerHTML = "The feed xml could not be parsed.";
                    break;
                }
                TmpDoc.loadXML(xml);
                xml = null;
            } else if (document.getElementById("proxyserver").value.length > 0) {
                if (ProxyLoader == null) {
                    ProxyLoader = new ActiveXObject(ServerXMLHTTPProgID);
                }
                if (ProxyLoader == null) {
                    errorbox.innerHTML = "The proxy object could not be created.";
                    break;
                }
                ProxyLoader.setProxy(2, document.getElementById("proxyserver").value);
                ProxyLoader.open("GET", url, false);
                if (document.getElementById("proxyusername").value.length > 0)
                    ProxyLoader.setProxyCredentials(document.getElementById("proxyusername").value,
                        document.getElementById("proxypassword").value);
                ProxyLoader.setRequestHeader("User-Agent", "Hermes/1.0.4 (Windows; U; Windows NT 6.0; en-US; rv:1.8.1.11)");
                ProxyLoader.setRequestHeader('Accept-Language', 'en-us;q=0.7,en;q=0.3');
                ProxyLoader.setRequestHeader("Accept", "text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5");
                ProxyLoader.setRequestHeader("Accept-Charset", "utf-8;q=0.7,*;q=0.7");
                ProxyLoader.send();
                if ((ProxyLoader.readyState != 4) || (ProxyLoader.status != 200)) {
                    errorbox.innerHTML = "The feed url could not be loaded via proxy.";
                    break;
                }
                if (ProxyLoader.responseXML == null)
                    ProxyLoader.loadXML(ProxyLoader.responseText);
                else
                    ProxyLoader.loadXML(ProxyLoader.responseXML.xml);
            } else {
                try {
                    TmpDoc.load(url);
                } catch (e) {
                    errorbox.innerHTML = "Could not load feed:" + e.message + "<br />"
                        +"Check IE security settings, see Adding a new feed on help page.";
                    break;
                }
            }
            if (TmpDoc.childNodes.length == 0) {
                errorbox.innerHTML = "Could not parse xml of new feed.";
                break;
            }
            var name = null;
            try {
                name = TmpDoc.selectSingleNode(SelectSinglePath("channel", "title",null)).text;
            } catch (e) {
                name = null;
            }
            if (name == null) try {
                name = TmpDoc.selectSingleNode(SelectSinglePath("feed", "title",null)).text;
                isatom = true;
            } catch (e) {
                name = null;
            }
            TmpDoc.loadXML(BlankXML);
            var t = UniqueID();
            if (name == null || name.length == 0) {
                name = url;  //X "RSS" + t;
            }
            var oldFeed = document.getElementById("feedlist").firstChild;
            var ver = 0;
            while (oldFeed != null) {
                try {
                    var oldUrl = oldFeed.getAttribute("url");
                    var oldName = oldFeed.getAttribute("name");
                    if (oldUrl == url) {
                        errorbox.innerHTML = "The feed '" + oldName + "' with the same url already exists.";
                        oldFeed = null;
                        oldUrl = null;
                        oldName = null;
                        ver = -1;
                        break;
                    }
                    oldUrl = null;
                    var oldVer = 0;
                    var verIndex = oldName.indexOf("(");
                    if (verIndex > 0) {
                        oldVer = parseInt(oldName.substring(verIndex + 1));
                        oldName = oldName.substring(0, verIndex);
                    }
                    verIndex = null;
                    if (oldName == name) {
                        if (oldVer >= ver) ver = oldVer + 1;
                    }
                    oldName = null;
                    oldVer = 0;
                } catch (e) { }
                oldFeed = oldFeed.nextSibling;
            }
            if (ver >= 0) {
                if (ver > 0) {
                    name += "(" + ver + ")";
                }
                var num = document.getElementById("feedlist").childNodes.length;
                PopulateFeed(num, null, "Feed" + t, name, url, usefm, true, catname, isatom);
                num = null;
                document.getElementById("newurl").value = "";
            }
            t = null;
            ver = null;
            curFeedsRoot = null;
            name = null;
        } while (false);
        url = null;
        errorbox = null;
        isatom = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Add feed exception:" + e.message;
    }
    usefm = null;
    catname = null;
}

function SetElementProperty(doc, propertyName, nodeName, attributeName) {
    var node = doc.selectSingleNode(nodeName);
    if (node != null) {
        var val = node.getAttribute(attributeName);
        if (val != null) {
            document.getElementById(propertyName).value = val;
            val = null;
        }
    }
    node = null;
    doc = null;
    propertyName = null;
    nodeName = null;
    attributeName = null;
}

function SetElementFlag(doc, propertyName, nodeName, attributeName) {
    var node = doc.selectSingleNode(nodeName);
    if (node != null) {
        var val = node.getAttribute(attributeName);
        if (val != null) {
            document.getElementById(propertyName).checked = ((val == "true") ? true : false);
            val = null;
        }
    }
    node = null;
    doc = null;
    propertyName = null;
    nodeName = null;
    attributeName = null;
}

function LoadSettings(doc) {
    try {
        WindowSize = GetDocAttribute(doc, "/data/display", "windowsize", "medium");
        CurrentFolders[0] = GetDocAttribute(doc, "/data/feeds", "folder", "All");
        CurrentFolders[1] = GetDocAttribute(doc, "/data/pages", "folder", "All");
        CurrentFolders[2] = GetDocAttribute(doc, "/data/alerts", "folder", "All");
        SetElementProperty(doc, "scrollrate", "/data/display", "scrollrate");
        SetElementProperty(doc, "autoclick", "/data/display", "autoclick");
        SetElementProperty(doc, "scrollwidth", "/data/display", "scrollwidth");
        SetElementProperty(doc, "scrollheight", "/data/display", "scrollheight");
        SetElementProperty(doc, "fontfamily", "/data/display", "fontfamily");
        SetElementProperty(doc, "fontsize", "/data/display", "fontsize");
        SetElementProperty(doc, "fontweight", "/data/display", "fontweight");
        SetElementProperty(doc, "textcolor", "/data/display", "textcolor");
        SetElementProperty(doc, "linecolor", "/data/display", "linecolor");
        SetElementProperty(doc, "dividercolor", "/data/display", "dividercolor");
        SetElementProperty(doc, "scrollbarcolor", "/data/display", "scrollbarcolor");
        SetElementProperty(doc, "bordercolor", "/data/display", "bordercolor");
        SetElementProperty(doc, "backgroundcolor", "/data/display", "backgroundcolor");
        SetElementProperty(doc, "backgroundimage", "/data/display", "backgroundimage");
        SetElementProperty(doc, "contrast", "/data/display", "contrast");
        SetElementProperty(doc, "transparency", "/data/display", "transparency");
        SetElementProperty(doc, "proxyusername", "/data/proxy", "username");
        SetElementProperty(doc, "proxypassword", "/data/proxy", "password");
        SetElementProperty(doc, "proxyserver", "/data/proxy", "server");
        SetElementProperty(doc, "smtpusername", "/data/alerts", "username");
        SetElementProperty(doc, "smtppassword", "/data/alerts", "password");
        SetElementProperty(doc, "smtpserver", "/data/alerts", "server");
        SetElementProperty(doc, "smtpport", "/data/alerts", "port");
        SetElementProperty(doc, "fromaddress", "/data/alerts", "fromaddress");
        SetElementProperty(doc, "soundfile", "/data/alerts", "soundfile");
        SetElementProperty(doc, "flagduration", "/data/options", "flagduration");
        SetElementProperty(doc, "keepduration", "/data/options", "keepduration");
        SetElementProperty(doc, "ageofitem", "/data/options", "ageofitem");
        SetElementProperty(doc, "readbydate", "/data/options", "readbydate");
        SetElementProperty(doc, "datedisplayformat", "/data/feeds", "datedisplayformat");
        SetElementFlag(doc, "flushcache", "/data/feeds", "flushcache");
        SetElementFlag(doc, "crosscompare", "/data/feeds", "crosscompare");
        SetElementFlag(doc, "confirmdelete", "/data/categories", "confirmdelete");
        SetElementFlag(doc, "filterbycategory", "/data/categories", "filterbycategory");
        SetElementFlag(doc, "hideifnone", "/data/categories", "hideifnone");
        SetElementFlag(doc, "showifnew", "/data/categories", "showifnew");
        SetElementFlag(doc, "smtpusessl", "/data/alerts", "ssl");
        SetElementFlag(doc, "horizontal", "/data/display", "horizontal");
        SetElementFlag(doc, "hidescrollbar", "/data/display", "hidescrollbar");
        SetElementFlag(doc, "hidehover", "/data/display", "hidehover");
        SetElementFlag(doc, "righttoleft", "/data/display", "righttoleft");
        SetElementFlag(doc, "lineseparator", "/data/display", "lineseparator");
        SetElementFlag(doc, "clicktosetreadbydate", "/data/options", "clicktosetreadbydate");
        SetElementFlag(doc, "hideifread", "/data/options", "hideifread");
        SetElementFlag(doc, "clicktoremoveflag", "/data/options", "clicktoremoveflag");
        SetElementFlag(doc, "searchcache", "/data/options", "searchcache");
        SetElementFlag(doc, "sortbydate", "/data/options", "sortbydate");
        SetElementFlag(doc, "sortbyload", "/data/options", "sortbyload");

        var n, i, id, name, node, curnode;
        var nodes = doc.selectNodes("/data/feeds/feed");
        var els = document.getElementById("feedlist");
        if (nodes != null && nodes.length > 0) {
            n = els.childNodes.length;
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                id = node.getAttribute("id");
                name = node.getAttribute("name");
                var url = node.getAttribute("url");
                curnode = document.getElementById(id);
                if (curnode != null) {
                    DeleteListEntry(curnode);
                    curnode = null;
                    --n;
                }
                while ((curnode = GetFeedNode(url, name)) != null) {
                    DeleteListEntry(curnode);
                    curnode = null;
                    --n;
                }
                PopulateFeed(n++, node, id, name, url,
                            SetLocalFlag(node, "usefm", false), SetLocalFlag(node, "applyrules", true), "@General",false);
                id = null;
                node = null;
                name = null;
                url = null;
            }
            n = null;
        }
        UpdateBands(els.firstChild);
        nodes = null;
        els = null;

        nodes = doc.selectNodes("/data/pages/page");
        els = document.getElementById("pagelist");
        if (nodes != null && nodes.length > 0) {
            n = els.childNodes.length;
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                id = node.getAttribute("id");
                curnode = document.getElementById(id);
                if (curnode != null) {
                    DeleteListEntry(curnode);
                    curnode = null;
                    --n;
                }
                PopulatePage(n++, node, id, "@General");
                id = null;
                node = null;
            }
            n = null;
        }
        UpdateBands(els.firstChild);
        nodes = null;
        els = null;

        nodes = doc.selectNodes("/data/alerts/alert");
        els = document.getElementById("alertlist");
        if (nodes != null && nodes.length > 0) {
            n = els.childNodes.length;
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                id = node.getAttribute("id");
                curnode = document.getElementById(id);
                if (curnode != null) {
                    DeleteListEntry(curnode);
                    curnode = null;
                    --n;
                }
                PopulateAlert(n++, node, id, "@General");
                id = null;
                node = null;
            }
            n = null;
        }
        UpdateBands(els.firstChild);
        nodes = null;
        els = null;

        nodes = doc.selectNodes("/data/categories/category");
        els = document.getElementById("catlist");
        if (nodes != null && nodes.length > 0) {
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                PopulateCat(node, node.getAttribute("name"), false);
                node = null;
            }
        }
        // Make sure first cat is "All" cat and enabled.
        PopulateCat(null, "All", true);
        UpdateBands(els.firstChild);
        nodes = null;
        els = null;

        nodes = doc.selectNodes("/data/filters/filter");
        els = document.getElementById("filterlist");
        if (nodes != null && nodes.length > 0) {
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                PopulateFilter(node, node.getAttribute("name"));
                node = null;
            }
        }
        UpdateBands(els.firstChild);
        nodes = null;
        els = null;

        UpdateColorPicker("textcolor");
        UpdateColorPicker("linecolor");
        UpdateColorPicker("dividercolor");
        UpdateColorPicker("bordercolor");
        UpdateColorPicker("backgroundcolor");
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Could not process load file.";
    }
    doc = null;
}

function ExportSettingsToXML(ev) {
    try {
        var storefile = System.Shell.saveFileDialog("", "XML File\0*.xml\0\0");
        if ((storefile == null) || (storefile.length == 0)) {
            document.getElementById("messagebox").innerHTML = "A file name is needed for saving to.";
        }
        if ((storefile != null) && (storefile.length > 0)) {
            if (storefile.indexOf(".") < 0) storefile += ".xml";
            var exportDoc = new ActiveXObject(DOMDocumentProgID);
            exportDoc.async = false;
            exportDoc.validateOnParse = false;
            var pi = exportDoc.createProcessingInstruction("xml", " version='1.0' encoding='UTF-16'");
            exportDoc.appendChild(pi);
            SaveSettings(exportDoc, storefile, true);
            exportDoc = null;
            pi = null;
        }
        storefile = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Could not save to file.";
    }
    ev = null;
}

function MergeSettingsFromXML(ev) {
    try {
        var storefile = null;
        var oShellItem = System.Shell.chooseFile(true, "XML File\0*.xml\0\0", "", "hermes.xml");
        if (oShellItem != null) {
            storefile = oShellItem.path;
        }
        if ((storefile == null) || (storefile.length == 0)) {
            document.getElementById("messagebox").innerHTML = "A file name is needed for loading from.";
        }
        if ((storefile != null) && (storefile.length > 0)) {
            if (storefile.indexOf(".") < 0) storefile += ".xml";
            var importDoc = new ActiveXObject(DOMDocumentProgID);
            importDoc.async = false;
            importDoc.load(storefile);
            LoadSettings(importDoc);
            importDoc = null;
        }
        oShellItem = null;
        storefile = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Could not load from file.";
    }
    ev = null;
}

function ImportSettingsFromXML(ev) {
    ClearDataList("feedlist");
    ClearDataList("pagelist");
    ClearDataList("alertlist");
    ClearDataList("catlist");
    ClearDataList("filterlist");
    MergeSettingsFromXML(ev);
}

function RestoreSettingsFromXML(ev) {
    try {
        var storefile = DefaultSettingsPath;
        if ((storefile != null) && (storefile.length > 0)) {
            if (storefile.indexOf(".") < 0) storefile += ".xml";
            var importDoc = new ActiveXObject(DOMDocumentProgID);
            importDoc.async = false;
            importDoc.load(storefile);
            ClearDataList("feedlist");
            ClearDataList("pagelist");
            ClearDataList("alertlist");
            ClearDataList("catlist");
            ClearDataList("filterlist");
            LoadSettings(importDoc);
            importDoc = null;
        }
        storefile = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Could not load from default settings file.";
    }
    ev = null;
}

function ExportFeedsToIE(ev) {
    try {
        if (HasFeedsManager()) {
            var rootFolder = FeedsManager.RootFolder;
            if (rootFolder != null) {
                var feed = document.getElementById("feedlist").firstChild;
                while (feed != null) {
                    try {
                        var catname = feed.getAttribute("folder").substring(1);
                        var folder = null;
                        if (catname == "Imported") {
                            folder = rootFolder;
                        } else if (!rootFolder.ExistsSubfolder(catname)) {
                            folder = rootFolder.CreateSubfolder(catname);
                        } else {
                            folder = rootFolder.GetSubfolder(catname);
                        }
                        if (folder == null) {
                            folder = rootFolder;
                        }
                        folder.CreateFeed(feed.getAttribute("name"), feed.getAttribute("url"));
                        folder = null;
                        catname = null;
                    } catch (e) { }
                    feed = feed.nextSibling;
                }
                rootFolder = null;
                document.getElementById("messagebox").innerHTML = "Exporting finished.";
            } else {
                document.getElementById("messagebox").innerHTML = "Could not access root folder of FeedsManager.";
            }
        } else {
            document.getElementById("messagebox").innerHTML = "Unable to contact FeedsManager.";
        }
    } catch (e) { }
    ev = null;
}

function AddFolderFeeds(folder) {
    var ieFeeds = folder.Feeds;
    var path = folder.Path;
    if (path != null) {
        path = Trim(path).replace(/\|/g, ':');
        while ((path.length > 0) && (path.charAt(0) == "@")) path = path.substring(1);
    }
    if ((path == null) || (path.length == 0)) path = "Imported";
    var isFirst = true;
    for (var i = 0; i < ieFeeds.Count; i++) {
        var url = ieFeeds.Item(i).Url;
        var name = null;
        try {
            name = ieFeeds.Item(i).Title; // Catch the case when feed not loaded.
        } catch (e) { }
        document.getElementById("newurl").value = url;
        var fn = GetFeedNode(url, name);
        if (fn == null) {
            if (isFirst) {
                path = CreateCategory("@" + path, "@Imported");
                isFirst = false;
            }
            AddFeed(true, path);
        } else {
            fn = null;
        }
        url = null;
        name = null;
    }
    ieFeeds = null;
    path = null;
    var subFolders = folder.Subfolders;
    if (subFolders != null) {
        for (var k = 0; k < subFolders.Count; k++) AddFolderFeeds(subFolders.Item(k));
        subFolders = null;
    }
    folder = null;
}

function ImportFeedsFromIE(ev) {
    try {
        if (HasFeedsManager()) {
            AddFolderFeeds(FeedsManager.RootFolder);
            PrepareFolders(0);
            document.getElementById("messagebox").innerHTML =
                "Importing finished.<br/>Remember to enable new folders if required.";
        } else {
            document.getElementById("messagebox").innerHTML = "Import feeds: unable to contact Feeds Manager";
        }
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Import feeds: encountered a problem:" + e.message;
    }
    ev = null;
}

function SaveProperty(node, propertyName) {
    var p = document.getElementById(propertyName);
    if (p != null) {
        node.setAttribute(propertyName, p.value);
    }
    p = null;
    node = null;
    propertyName = null;
}

function SaveAttribute(node, propertyName, attributeName) {
    var p = document.getElementById(propertyName);
    if (p != null) {
        node.setAttribute(attributeName, p.value);
    }
    p = null;
    node = null;
    propertyName = null;
    attributeName = null;
}

function SaveAttributeFlag(node, propertyName, attribute) {
    var p = document.getElementById(propertyName);
    if (p != null) {
        node.setAttribute(attribute, ((p.checked) ? "true" : "false"));
    }
    p = null;
    node = null;
    propertyName = null;
    attributeName = null;
}

function SaveFlag(node, propertyName) {
    var p = document.getElementById(propertyName);
    if (p != null) {
        node.setAttribute(propertyName, ((p.checked) ? "true" : "false"));
    }
    p = null;
    node = null;
    propertyName = null;
}

function SaveFeedProperty(node, propertyName, isFlag, id) {
    var p = document.getElementById(propertyName + ((id == null) ? node.getAttribute("id") : id));
    if (p != null) {
        node.setAttribute(propertyName, (isFlag ? (((p.checked) ? "true" : "false")) : p.value));
        p = null;
    }
    node = null;
    propertyName = null;
    isFlag = null;
}

function SaveSettings(doc, savepath, pretty) {
    try {
        var h = doc.selectSingleNode("/data");
        if (h != null) {
            h.parentNode.removeChild(h);
        }
        h = doc.createElement("data");
        var o = doc.createElement("options");
        var d = doc.createElement("display");
        var x = doc.createElement("proxy");
        var f = doc.createElement("feeds");
        var p = doc.createElement("pages");
        var a = doc.createElement("alerts");
        var c = doc.createElement("categories");
        var r = doc.createElement("filters");
        doc.appendChild(h);
        h.appendChild(o);
        h.appendChild(d);
        h.appendChild(x);
        h.appendChild(f);
        h.appendChild(p);
        h.appendChild(a);
        h.appendChild(c);
        h.appendChild(r);
        SaveProperty(o, "flagduration");
        SaveProperty(o, "keepduration");
        SaveProperty(o, "readbydate");
        SaveProperty(o, "ageofitem");
        d.setAttribute("windowsize", WindowSize);
        SaveProperty(d, "scrollrate");
        SaveProperty(d, "autoclick");
        SaveProperty(d, "scrollwidth");
        SaveProperty(d, "scrollheight");
        SaveProperty(d, "fontfamily");
        SaveProperty(d, "fontsize");
        SaveProperty(d, "fontweight");
        SaveProperty(d, "textcolor");
        SaveProperty(d, "linecolor");
        SaveProperty(d, "dividercolor");
        SaveProperty(d, "scrollbarcolor");
        SaveProperty(d, "bordercolor");
        SaveProperty(d, "backgroundcolor");
        SaveProperty(d, "backgroundimage");
        SaveProperty(d, "contrast");
        SaveProperty(d, "transparency");
        SaveProperty(f, "datedisplayformat");
        SaveFlag(f, "flushcache");
        SaveFlag(c, "confirmdelete");
        SaveFlag(c, "showifnew");
        SaveFlag(c, "filterbycategory");
        SaveFlag(c, "hideifnone");
        SaveFlag(f, "crosscompare");
        f.setAttribute("folder", CurrentFolders[0]);
        p.setAttribute("folder", CurrentFolders[1]);
        a.setAttribute("folder", CurrentFolders[2]);
        SaveFlag(d, "horizontal");
        SaveFlag(d, "hidescrollbar");
        SaveFlag(d, "hidehover");
        SaveFlag(d, "righttoleft");
        SaveFlag(d, "lineseparator");
        SaveFlag(o, "searchcache");
        SaveFlag(o, "sortbydate");
        SaveFlag(o, "sortbyload");
        SaveFlag(o, "clicktosetreadbydate");
        SaveFlag(o, "hideifread");
        SaveFlag(o, "clicktoremoveflag");
        SaveAttribute(x, "proxyusername", "username");
        SaveAttribute(x, "proxypassword", "password");
        SaveAttribute(x, "proxyserver", "server");
        SaveAttribute(a, "smtpusername", "username");
        SaveAttribute(a, "smtppassword", "password");
        SaveAttribute(a, "smtpserver", "server");
        SaveAttribute(a, "smtpport", "port");
        SaveAttributeFlag(a, "smtpusessl", "ssl");
        SaveProperty(a, "fromaddress");
        SaveProperty(a, "soundfile");

        x = null;
        d = null;
        o = null;
        h = null;

        var n = null;
        var t = null;
        var node = document.getElementById("feedlist").firstChild;
        var s;
        while (node != null) {
            n = doc.createElement("feed");
            f.appendChild(n);
            n.setAttribute("id", node.getAttribute("id"));
            n.setAttribute("name", node.getAttribute("name"));
            n.setAttribute("url", node.getAttribute("url"));
            n.setAttribute("folder", node.getAttribute("folder"));
            n.setAttribute("atom", node.getAttribute("atom"));

            SaveFeedProperty(n, "interval", false);
            SaveFeedProperty(n, "color", false);
            SaveFeedProperty(n, "dateformat", false);
            SaveFeedProperty(n, "enable", true);
            SaveFeedProperty(n, "comparecontent", true);
            SaveFeedProperty(n, "applyrules", true);
            SaveFeedProperty(n, "displayname", true);

            SaveFeedProperty(n, "topx", false);
            SaveFeedProperty(n, "usefm", true);
            SaveFeedProperty(n, "prune", true);

            n = null;
            node = node.nextSibling;
        }
        f = null;

        node = document.getElementById("pagelist").firstChild;
        while (node != null) {
            n = doc.createElement("page");
            p.appendChild(n);

            n.setAttribute("id", node.getAttribute("id"));
            n.setAttribute("folder", node.getAttribute("folder"));
            SaveFeedProperty(n, "name", false);
            SaveFeedProperty(n, "url", false);

            SaveFeedProperty(n, "interval", false);
            SaveFeedProperty(n, "color", false);
            SaveFeedProperty(n, "dateformat", false);
            SaveFeedProperty(n, "enable", true);
            SaveFeedProperty(n, "comparecontent", true);
            SaveFeedProperty(n, "applyrules", true);
            SaveFeedProperty(n, "displayname", true);

            SaveFeedProperty(n, "ignore", true);
            SaveFeedProperty(n, "headers", true);
            SaveFeedProperty(n, "submatchindex", false);
            SaveFeedProperty(n, "matchpositions", true);
            SaveFeedProperty(n, "pattern", false);
            SaveFeedProperty(n, "successtitle", false);
            SaveFeedProperty(n, "successdescription", false);
            SaveFeedProperty(n, "rejecttitle", false);
            SaveFeedProperty(n, "rejectdescription", false);
            SaveFeedProperty(n, "failtitle", false);
            SaveFeedProperty(n, "faildescription", false);
            t = document.getElementById("func" + node.getAttribute("id"));
            if (t != null) {
                n.text = t.value;
                t = null;
            }
            n = null;
            node = node.nextSibling;
        }
        p = null;

        node = document.getElementById("alertlist").firstChild;
        while (node != null) {
            n = doc.createElement("alert");
            a.appendChild(n);
            n.setAttribute("id", node.getAttribute("id"));
            n.setAttribute("folder", node.getAttribute("folder"));
            SaveFeedProperty(n, "name", false);

            SaveFeedProperty(n, "interval", false);
            SaveFeedProperty(n, "color", false);
            SaveFeedProperty(n, "enable", true);
            SaveFeedProperty(n, "comparecontent", true);
            SaveFeedProperty(n, "applyrules", true);
            SaveFeedProperty(n, "displayname", true);

            SaveFeedProperty(n, "email", true);
            SaveFeedProperty(n, "ashtml", true);
            SaveFeedProperty(n, "playsound", true);
            SaveFeedProperty(n, "showinflyout", true);
            SaveFeedProperty(n, "toaddress", false);

            SaveFeedProperty(n, "patternfolder", false);
            SaveFeedProperty(n, "patterncategories", false);
            SaveFeedProperty(n, "patternname", false);
            SaveFeedProperty(n, "patterntitle", false);
            SaveFeedProperty(n, "patterndescription", false);
            SaveFeedProperty(n, "patternlink", false);

            SaveFeedProperty(n, "successtitle", false);
            SaveFeedProperty(n, "successdescription", false);
            t = document.getElementById("func" + node.getAttribute("id"));
            if (t != null) {
                n.text = t.value;
                t = null;
            }
            n = null;
            node = node.nextSibling;
        }
        a = null;

        node = document.getElementById("catlist").firstChild;
        var name,id,inc,exc;
        while (node != null) {
            name = node.getAttribute("name");
            inc = node.getAttribute("includefilter");
            exc = node.getAttribute("excludefilter");
            id = node.getAttribute("id");
            n = doc.createElement("category");
            c.appendChild(n);
            n.setAttribute("name", name);
            if (name.charAt(0) == "@") SaveFeedProperty(n, "color", false, id);
            SaveFeedProperty(n, "enable", true, id);
            n.setAttribute("includefilter", inc);
            n.setAttribute("excludefilter", exc);
            n = null;
            node = node.nextSibling;
        }
        c = null;

        node = document.getElementById("filterlist").firstChild;
        while (node != null) {
            name = node.getAttribute("name");
            n = doc.createElement("filter");
            r.appendChild(n);
            n.setAttribute("name", name);
            t = document.getElementById("regex" + node.getAttribute("id"));
            if (t != null) {
                n.text = t.value;
                t = null;
            }
            n = null;
            node = node.nextSibling;
        }
        r = null;

        if (pretty) {
            var prettyDoc = null;
            var styleDoc = null;
            try {
                prettyDoc = new ActiveXObject(DOMDocumentProgID); 
                prettyDoc.async = false;  
                styleDoc = new ActiveXObject(DOMDocumentProgID);
                styleDoc.async = false;
                styleDoc.loadXML('<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">'
                    + '<xsl:output method="xml" indent="yes"/> <xsl:template match="@* | node()">'
                    + '<xsl:copy> <xsl:apply-templates select="@* | node()"/> </xsl:copy> </xsl:template> </xsl:stylesheet> ');
                doc.transformNodeToObject(styleDoc, prettyDoc);     
                prettyDoc.save(savepath);
            } catch (e) {
                BugReport("SaveSettings: writing pretty xml: " + e.message);
                pretty = false;
            }
            prettyDoc = null;
            styleDoc = null;
        }
        if (!pretty) {
            doc.save(savepath);
        }
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "SaveSettings exception: " + e.message;
    }
    doc = null;
    savepath = null;
}
function AddFeedOnClick(ev) {
    SetDisplay("feedaddbox", "block");
}
function ConfirmAddFeedOnClick(ev) {
    SetDisplay("feedaddbox", "none");
    var catname = GetSelectedCat("catfeedlist", 1);
    if (catname != null) {
        AddFeed(document.getElementById("addviafm").checked, catname);
        UpdateBands(document.getElementById("feedlist").firstChild);
        catname = null;
    }
    ev = null;
}

function AddAlertOnClick(ev) {
    try {
        var catname = GetSelectedCat("catalertlist", 1);
        if (catname != null) {
            var n = document.getElementById("alertlist").childNodes.length;
            var t = UniqueID();
            PopulateAlert(n, null, "Alert" + t, catname);
            t = null;
            n = null;
            catname = null;
        }
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "A new alert could not be added.";
    }
    ev = null;
}

function AddPageOnClick(ev) {
    try {
        var catname = GetSelectedCat("catpagelist", 1);
        if (catname != null) {
            var n = document.getElementById("pagelist").childNodes.length;
            var t = UniqueID();
            PopulatePage(n, null, "Page" + t, catname);
            t = null;
            n = null;
            catname = null;
        }
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "A new page could not be added.";
    }
    ev = null;
}

function CreateCategory(name, defaultname) {
    if ((name == null) || (name.length == 0)) {
        name = defaultname;
    }
    if (GetCatNode(name) == null) {
        PopulateCat(null, name, false);
        UpdateBands(document.getElementById("catlist").firstChild);
    }
    defaultname = null;
    return name;
}

function AddCatOnClick(ev) {
    try {
        var name = document.getElementById("catname").value;
        if (name == null) {
            document.getElementById("messagebox").innerHTML = "Enter a name first."
        } else {
            name = Trim(name).replace(/\|/g, ':');
            if ((name.length > 0) && (name.charAt(0) == "@")) {
                document.getElementById("messagebox").innerHTML = "Item categories cannot start with an '@' character.";
            } else if ((name.length > 0) && (GetCatNode(name) == null)) {
                CreateCategory(name, null);
                document.getElementById("messagebox").innerHTML = "";
            } else {
                document.getElementById("messagebox").innerHTML = "A valid name that does not exist must be entered.";
            }
        }
        name = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Category could not be added.";
    }
    ev = null;
}
function AddFolderOnClick(ev) {
    try {
        var name = document.getElementById("catname").value;
        if (name == null) {
            document.getElementById("messagebox").innerHTML = "Enter a name first."
        } else {
            name = Trim(name).replace(/\|/g, ':');
            while ((name.length > 0) && (name.charAt(0) == "@")) name = name.substring(1);
            if ((name.length > 0) && (GetCatNode("@" + name) == null)) {
                CreateCategory("@" + name, null);
                document.getElementById("messagebox").innerHTML = "";
            } else {
                document.getElementById("messagebox").innerHTML = "A valid name that does not exist must be entered.";
            }
        }
        name = null;
    } catch (e) {
        document.getElementById("messagebox").innerHTML = "Folder category could not be added.";
    }
    ev = null;
}

function RenameCatOnClick(ev) {
    try {
        if ((LastId != null) && (LastId.indexOf("Cat") >= 0)) {
            var cat = document.getElementById(LastId);
            var oldname = cat.getAttribute("name");
            var name = Trim(document.getElementById("catname").value);
            if ((name != null) && (name.length > 0) && (name.toLowerCase() != "all") && (oldname.toLowerCase() != name.toLowerCase())) {
                if (((name.charAt(0) == "@") && (oldname.charAt(0) == "@"))
                    || ((name.charAt(0) != "@") && (oldname.charAt(0) != "@"))) {
                    var c = GetCatNode(name);
                    if (c == null) {
                        cat.setAttribute("name", name);
                        document.getElementById(cat.id + "catname").innerHTML = name;
                    }
                    if (name.charAt(0) == "@") {
                        RenameFolder("feedlist", oldname, name);
                        RenameFolder("pagelist", oldname, name);
                        RenameFolder("alertlist", oldname, name);
                    }
                    if (c != null) {
                        DeleteListEntry(cat);
                    }
                    document.getElementById("messagebox").innerHTML = "";
                } else {
                    document.getElementById("messagebox").innerHTML = "Cannot mix folders and categories.";
                }
            } else {
                document.getElementById("messagebox").innerHTML = "Enter a valid unique name.";
            }
            cat = null;
            oldname = null;
            name = null;
        } else {
            document.getElementById("messagebox").innerHTML = "Click on a category first.";
        }
    } catch (e) {
        BugReport("RenameCatOnClick exception: " + e.message);
    }
    ev = null;
}

function TestPagePattern(text, label) {
    try {
        if ((LastId != null) && (LastId.indexOf("Page") >= 0)) {
            var pattern = document.getElementById("pattern" + LastId).value;
            if (text != null && text.length > 0) {
                var re = null;
                var result = null;
                var description = "";
                try {
                    re = SetPattern(pattern);
                    result = re.exec(text);
                } catch (e) {
                    re = null;
                    result = null;
                    description = "Bad regular expression(?):" + e.message;
                    e = null;
                }
                if (re != null) {
                    var oldlastindex = 0;
                    while (result != null && result.lastIndex != oldlastindex) {
                        description += "<br />" + result[0] + " " + result.index + "-" + result.lastIndex + ".";
                        oldlastindex = result.lastIndex;
                        result = re.exec(text);
                    }
                    result = null;
                    re = null;
                    oldlastindex = null;
                    pattern = "<br />'" + pattern + "'";
                    if (description.length > 0) {
                        description = "Matches on " + label + " using:" + pattern + description;
                    } else {
                        description = "There were no matches on " + label + " using:" + pattern + ".";
                    }
                }
                document.getElementById("messagebox").innerHTML = description;
                description = null;
            } else {
                document.getElementById("messagebox").innerHTML = "Enter some test text first.";
            }
            pattern = null;
        } else {
            document.getElementById("messagebox").innerHTML = "Click on a page first.";
        }
    } catch (e) {
        BugReport("TestPagePattern exception: " + e.message);
    }
    text = null;
    label = null;
}

function TextPatternTestPageOnClick(ev) {
    TestPagePattern(document.getElementById("testtext").value, "text");
    ev = null;
}

function URLPatternTestPageOnClick(ev) {
    try {
        if ((LastId != null) && (LastId.indexOf("Page") >= 0)) {
            var url = document.getElementById("url" + LastId).value;
            if (url == null || url.length == 0) {
                document.getElementById("messagebox").innerHTML = "Set page url value first.";
            } else {
                var text = null;
                try {
                    if (PageDoc == null) {
                        PageDoc = new ActiveXObject(XMLHTTPProgID);
                    }
                    PageDoc.open("GET", url, false);
                    PageDoc.setRequestHeader("Cache-Control", "no-cache");
                    PageDoc.setRequestHeader("Pragma", "no-cache");
                    PageDoc.setRequestHeader("Expires", "-1");
                    PageDoc.setRequestHeader("If-Modified-Since", "1 Jan 1970 12:00:00 GMT");
                    PageDoc.send();
                    text = PageDoc.responseText;
                } catch (e) {
                    text = null;
                }
                if (text == null || text.length == 0) {
                    document.getElementById("messagebox").innerHTML = "GET on page url produced no text.";
                } else {
                    TestPagePattern(text, "url");
                }
                text = null;
            }
            url = null;
        } else {
            document.getElementById("messagebox").innerHTML = "Click on a page first.";
        }
    } catch (e) {
        BugReport("URLPatternTestPageOnClick exception: " + e.message);
    }
    ev = null;
}

function TestSoundOnClick(ev) {
    var soundfile = document.getElementById("soundfile").value;
    if (soundfile == null || soundfile.length == 0) {
        document.getElementById("messagebox").innerHTML = "Enter a valid sound file.";
    } else {
        PlaySound(soundfile);
    }
    soundfile = null;
    ev = null;
}

function TestEmailOnClick(ev) {
    if ((LastId != null) && (LastId.indexOf("Alert") >= 0)) {
        var to = document.getElementById("toaddress" + LastId).value;
        if ((to == null) || (to.length == 0)) {
            document.getElementById("messagebox").innerHTML = "Set 'To' email address value first.";
        } else {
            var asHTML = document.getElementById("ashtml" + LastId).checked;
            var isrtl = document.getElementById("righttoleft").checked;
            var server = document.getElementById("smtpserver").value;
            var port = document.getElementById("smtpport").value;
            var useSSL = document.getElementById("smtpusessl").checked;
            var username = document.getElementById("smtpusername").value;
            var password = document.getElementById("smtppassword").value;
            var from = document.getElementById("fromaddress").value;
            if ((server == null) || (port == null) || (from == null)
                || (server.length == 0) || (port.length == 0) || (from.length == 0)) {
                document.getElementById("messagebox").innerHTML
                    = "Set SMTP server, From, and To address to valid values.";
            } else {
                var c = SendEMail(server, port, useSSL, username, password, from, to,
                     "Hermes email test.", "Test body (" + ++TestCount + ").", asHTML, isrtl);
                if (c == 1) {
                    document.getElementById("messagebox").innerHTML
                        = "Couldn't create message: check Outlook CDO library is installed.";
                } else if (c == 2) {
                    document.getElementById("messagebox").innerHTML
                        = "Couldn't send message: check smtp server, username and password.";
                } else {
                    document.getElementById("messagebox").innerHTML
                        = "A test message was sent (" + TestCount + ").";
                }
                c = null;

            }
            asHTML = null;
            isrtl = null;
            server = null;
            port = null;
            useSSL = null;
            username = null;
            password = null;
            from = null;
        }
        to = null;
    } else {
        document.getElementById("messagebox").innerHTML
            = "Select an alert to use for 'To' email address.";
    }
    ev = null;
}

function FeedsOnClick(ev) {
    PrepareFolders(0);
    ShowTab(ev);
    ev = null;
}
function PagesOnClick(ev) {
    PrepareFolders(1);
    ShowTab(ev);
    ev = null;
}
function AlertsOnClick(ev) {
    PrepareFolders(2);
    ShowTab(ev);
    ev = null;
}

function CatsOnClick(ev) {
    UpdateFilterFolders();
    ShowTab(ev);
    ev = null;
}

function FontsOnClick(ev) {
    ShowTab(ev);
    InitializePreviewBox();
    ev = null;
}

function FontSizeOnChange(ev) {
    var targ = GetTarget(ev);
    OnKeyUpPreview("fontSize", targ.options[targ.selectedIndex].value);
    targ = null;
    ev = null;
}
function FontWeightOnChange(ev) {
    var targ = GetTarget(ev);
    OnKeyUpPreview("fontWeight", targ.options[targ.selectedIndex].value);
    targ = null;
    ev = null;
}
function FontFamilyOnKeyUp(ev) {
    OnKeyUpPreview("fontFamily", this.value);
    ev = null;
}
function TextColorOnKeyUp(ev) {
    OnKeyUpPreview("textcolor", this.value);
    ev = null;
}
function LineColorOnKeyUp(ev) {
    OnKeyUpPreview("linecolor", this.value);
    ev = null;
}
function DividerColorOnKeyUp(ev) {
    OnKeyUpPreview("dividercolor", this.value);
    ev = null;
}
function ScrollbarColorOnKeyUp(ev) {
    OnKeyUpPreview("scrollbarcolor", this.value);
    ev = null;
}
function BorderColorOnKeyUp(ev) {
    OnKeyUpPreview("bordercolor", this.value);
    ev = null;
}
function BackgroundColorOnKeyUp(ev) {
    OnKeyUpPreview("backgroundcolor", this.value);
    ev = null;
}
function ContrastOnKeyUp(ev) {
    OnKeyUpPreview("contrast", this.value);
    ev = null;
}
function RightToLeftOnClick(ev) {
    document.getElementById("previewbox").dir = (this.checked ? "rtl" : "ltr");
    ev = null;
}
function ToggleFeedCheckboxes(ev) {
    ToggleCheckBoxes(ev, 0);
    ev = null;
}
function TogglePageCheckboxes(ev) {
    ToggleCheckBoxes(ev, 1);
    ev = null;
}
function ToggleAlertCheckboxes(ev) {
    ToggleCheckBoxes(ev, 2);
    ev = null;
}
function ToggleCatCheckboxes(ev) {
    ToggleCheckBoxes(ev, 3);
    ev = null;
}
function SortByDateOnClick(ev) {
    if (document.getElementById("sortbydate").checked) {
        document.getElementById("sortbyload").checked = false;
    }
    ev = null;
}
function SortByLoadOnClick(ev) {
    if (document.getElementById("sortbyload").checked) {
        document.getElementById("sortbydate").checked = false;
    }
    ev = null;
}

function OKButtonOnClick(ev) {
    SaveSettings(CurrentSettingsDoc, CurrentSettingsPath, false);
    System.Gadget.document.parentWindow.UpdateSettings(false);
    ev = null;
    System.Gadget.Flyout.show = false;
}

function CancelButtonOnClick(ev) {
    ev = null;
    System.Gadget.Flyout.show = false;
}

function SettingsClosing(ev) {
    if ((ev != null) && (ev.closeAction == ev.Action.commit)) {
        SaveSettings(CurrentSettingsDoc, CurrentSettingsPath, false);
    }
    ev = null;
}

function SettingsInit() {
    try {
        var pw = System.Gadget.document.parentWindow;
        WasMenuActivated = pw.WasMenuActivated;
        pw.WasMenuActivated = false;
        DOMDocumentProgID = pw.DOMDocumentProgID;
        ServerXMLHTTPProgID = pw.ServerXMLHTTPProgID;
        XMLHTTPProgID = pw.XMLHTTPProgID;
        DefaultSettingsPath = pw.DefaultSettingsPath;
        CurrentSettingsPath = pw.CurrentSettingsPath;
        CurrentSettingsDoc = pw.CurrentSettingsDoc;
        FeedsManager = pw.FeedsManager;
        try {
            System.Gadget.onSettingsClosing = SettingsClosing;
        } catch (e) { }
        pw = null;
        window.attachEvent("onload", SettingsSetup);
    } catch (e) {
        BugReport("SettingsInit exception: " + e.message);
    }
}

function SettingsSetup() {
    try {
        window.detachEvent("onload", SettingsSetup);
        window.attachEvent("onunload", SettingsClear);
        System.Gadget.document.parentWindow.ScrollBusy = true;
        System.Gadget.document.parentWindow.LoadIgnore = true;

        if (WasMenuActivated) {
            document.getElementById("footer").style.display = "block";
            document.getElementById("picker").style.bottom = "30px";
            // Test enough space for popup.
            var pw = System.Gadget.document.parentWindow;
            var w = document.body.clientWidth;
            var s = window.screen.width;
            var sw = pw.document.body.clientWidth;
            var sl = pw.screenLeft;
            if ((sl < w) && ((s - sl - sw) < w)) {
                ScrollWidth = pw.document.body.style.width;
                pw.document.body.style.width = (s - sl - w) + "px";
            }
            pw = null;
        } else {
            document.body.style.backgroundImage = "none";
            document.body.style.border = "0px";
            document.body.style.padding = "0px";
            document.body.style.margin = "0px";
            document.body.style.width = "320px";
            document.body.style.height = "400px";

            document.getElementById("proxy").className = "tabcontentsnormal";
            document.getElementById("help").className = "tabcontentsnormal";
            document.getElementById("display").className = "tabcontentsnormal";
            document.getElementById("options").className = "tabcontentsnormal";
            document.getElementById("feeds").className = "tabcontentsnormal";
            document.getElementById("pages").className = "tabcontentsnormal";
            document.getElementById("alerts").className = "tabcontentsnormal";
            document.getElementById("cats").className = "tabcontentsnormal";
            document.getElementById("filters").className = "tabcontentsnormal";
            
            document.getElementById("footer").style.display = "none";
            document.getElementById("messagebox").style.bottom = "0px";
            document.getElementById("messagebox").style.left = "0px";
        }

        var el = null;
        el = document.getElementById("tabfeeds");
        el.onclick = FeedsOnClick;
        el = null;
        el = document.getElementById("tabpages");
        el.onclick = PagesOnClick;
        el = null;
        el = document.getElementById("tabalerts");
        el.onclick = AlertsOnClick;
        el = null;
        el = document.getElementById("taboptions");
        el.onclick = ShowTab;
        el = null;
        el = document.getElementById("tabdisplay");
        el.onclick = FontsOnClick;
        el = null;
        el = document.getElementById("tabproxy");
        el.onclick = ShowTab;
        el = null;
        el = document.getElementById("tabhelp");
        el.onclick = ShowTab;
        el = null;
        el = document.getElementById("tabcats");
        el.onclick = CatsOnClick;
        el = null;
        el = document.getElementById("tabfilters");
        el.onclick = ShowTab;
        el = null;
        el = document.getElementById("catfeedlist");
        el.onchange = FolderDropOnChange;
        el = null;
        el = document.getElementById("catpagelist");
        el.onchange = FolderDropOnChange;
        el = null;
        el = document.getElementById("catalertlist");
        el.onchange = FolderDropOnChange;
        el = null;
        el = document.getElementById("testsettingbutton");
        el.onclick = TestProxy;
        el = null;
        el = document.getElementById("helpbutton");
        el.onclick = HelpInfo;
        el = null;
        el = document.getElementById("changesbutton");
        el.onclick = ChangesInfo;
        el = null;
        el = document.getElementById("readmebutton");
        el.onclick = ReadmeInfo;
        el = null;
        el = document.getElementById("aboutbutton");
        el.onclick = AboutInfo;
        el = null;       
        el = document.getElementById("fontfamily");
        el.onkeyup = FontFamilyOnKeyUp;
        el = null;
        el = document.getElementById("fontsize");
        el.onchange = FontSizeOnChange;
        el = null;
        el = document.getElementById("fontweight");
        el.onchange = FontWeightOnChange;
        el = null;
        el = document.getElementById("textcolor");
        el.onkeyup = TextColorOnKeyUp;
        el = null;
        el = document.getElementById("linecolor");
        el.onkeyup = LineColorOnKeyUp;
        el = null;
        el = document.getElementById("dividercolor");
        el.onkeyup = DividerColorOnKeyUp;
        el = null;
        el = document.getElementById("scrollbarcolor");
        el.onkeyup = ScrollbarColorOnKeyUp;
        el = null;
        el = document.getElementById("bordercolor");
        el.onkeyup = BorderColorOnKeyUp;
        el = null;
        el = document.getElementById("backgroundcolor");
        el.onkeyup = BackgroundColorOnKeyUp;
        el = null;
        el = document.getElementById("contrast");
        el.onkeyup = ContrastOnKeyUp;
        el = null;
        el = document.getElementById("righttoleft");
        el.onclick = RightToLeftOnClick;
        el = null;
        el = document.getElementById("importButton");
        el.onclick = ImportFeedsFromIE;
        el = null;
        el = document.getElementById("exportButton");
        el.onclick = ExportFeedsToIE;
        el = null;
        el = document.getElementById("settingsimportButton");
        el.onclick = ImportSettingsFromXML;
        el = null;
        el = document.getElementById("settingsmergeButton");
        el.onclick = MergeSettingsFromXML;
        el = null;
        el = document.getElementById("settingsexportButton");
        el.onclick = ExportSettingsToXML;
        el = null;
        el = document.getElementById("settingsrestoreButton");
        el.onclick = RestoreSettingsFromXML;
        el = null;
        el = document.getElementById("renameCatButton");
        el.onclick = RenameCatOnClick;
        el = null;
        el = document.getElementById("addButton");
        el.onclick = AddFeedOnClick;
        el = null;
        el = document.getElementById("ConfirmAddFeedButton");
        el.onclick = ConfirmAddFeedOnClick;
        el = null;
        el = document.getElementById("CancelAddFeedButton");
        el.onclick = CancelPopupBox;
        el = null;
        el = document.getElementById("addCatButton");
        el.onclick = AddCatOnClick;
        el = null;
        el = document.getElementById("addFilterButton");
        el.onclick = AddFilterOnClick;
        el = null;
        el = document.getElementById("addFolderButton");
        el.onclick = AddFolderOnClick;
        el = null;
        el = document.getElementById("DeleteCategoryButton");
        el.onclick = DeleteCategoryOnClick;
        el = null;
        el = document.getElementById("CancelDeleteCategoryButton");
        el.onclick = CancelPopupBox;
        el = null;
        el = document.getElementById("toggleButton");
        el.onclick = ToggleFeedCheckboxes;
        el = null;
        el = document.getElementById("addPageButton");
        el.onclick = AddPageOnClick;
        el = null;
        el = document.getElementById("addAlertButton");
        el.onclick = AddAlertOnClick;
        el = null;
        el = document.getElementById("toggleCatButton");
        el.onclick = ToggleCatCheckboxes;
        el = null;
        el = document.getElementById("togglePageButton");
        el.onclick = TogglePageCheckboxes;
        el = null;
        el = document.getElementById("toggleAlertButton");
        el.onclick = ToggleAlertCheckboxes;
        el = null;
        el = document.getElementById("testEmailButton");
        el.onclick = TestEmailOnClick;
        el = null;
        el = document.getElementById("testSoundButton");
        el.onclick = TestSoundOnClick;
        el = null;
        el = document.getElementById("testPageButton");
        el.onclick = URLPatternTestPageOnClick;
        el = null;
        el = document.getElementById("patternPageButton");
        el.onclick = TextPatternTestPageOnClick;
        el = null;
        el = document.getElementById("sortbydate");
        el.onclick = SortByDateOnClick;
        el = null;
        el = document.getElementById("sortbyload");
        el.onclick = SortByLoadOnClick;
        el = null;
        el = document.getElementById("okButton");
        el.onclick = OKButtonOnClick;
        el = null;
        el = document.getElementById("cancelButton");
        el.onclick = CancelButtonOnClick;
        el = null;
        el = document.getElementById("fontfamily");
        el.selectBoxOptions = Fonts;
        createEditableSelect(el, 110);
        el = null;
        el = document.getElementById("backgroundimage");
        el.selectBoxOptions = BackgroundImages;
        createEditableSelect(el, 200);
        el = null;

        AddColorPicker("textcolor");
        AddColorPicker("linecolor");
        AddColorPicker("dividercolor");
        AddColorPicker("scrollbarcolor");
        AddColorPicker("bordercolor");
        AddColorPicker("backgroundcolor");

        LoadSettings(CurrentSettingsDoc);
        PrepareFolders(0);
    } catch (e) {
        BugReport("SettingsSetup exception: " + e.message);
    }
}

function SettingsClear() {
    try {
        if (ScrollWidth != null) {
            System.Gadget.document.body.style.width = ScrollWidth;
        }
        window.detachEvent("onunload", SettingsClear);
        var el = null;
        el = document.getElementById("tabfeeds");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabpages");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabalerts");
        el.onclick = null;
        el = null;
        el = document.getElementById("taboptions");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabdisplay");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabproxy");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabhelp");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabcats");
        el.onclick = null;
        el = null;
        el = document.getElementById("tabfilters");
        el.onclick = null;
        el = null;
        el = document.getElementById("catfeedlist");
        el.onchange = null;
        el = null;
        el = document.getElementById("catpagelist");
        el.onchange = null;
        el = null;
        el = document.getElementById("catalertlist");
        el.onchange = null;
        el = null;
        el = document.getElementById("testsettingbutton");
        el.onclick = null;
        el = null;
        el = document.getElementById("helpbutton");
        el.onclick = null;
        el = null;
        el = document.getElementById("changesbutton");
        el.onclick = null;
        el = null;
        el = document.getElementById("readmebutton");
        el.onclick = null;
        el = null;
        el = document.getElementById("aboutbutton");
        el.onclick = null;
        el = null;
        el = document.getElementById("fontfamily");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("fontsize");
        el.onchange = null;
        el = null;
        el = document.getElementById("fontweight");
        el.onchange = null;
        el = null;
        el = document.getElementById("textcolor");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("linecolor");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("dividercolor");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("scrollbarcolor");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("bordercolor");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("backgroundcolor");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("contrast");
        el.onkeyup = null;
        el = null;
        el = document.getElementById("righttoleft");
        el.onclick = null;
        el = null;
        el = document.getElementById("importButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("exportButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("settingsimportButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("settingsmergeButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("settingsexportButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("settingsrestoreButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("renameCatButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("addButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("ConfirmAddFeedButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("CancelAddFeedButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("addCatButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("addFilterButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("addFolderButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("DeleteCategoryButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("CancelDeleteCategoryButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("toggleButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("addPageButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("addAlertButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("toggleCatButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("togglePageButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("toggleAlertButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("testEmailButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("testSoundButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("testPageButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("patternPageButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("sortbydate");
        el.onclick = null;
        el = null;
        el = document.getElementById("sortbyload");
        el.onclick = null;
        el = null;
        el = document.getElementById("okButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("cancelButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("fontfamily");
        el.selectBoxOptions = null;
        el = null;
        el = document.getElementById("backgroundimage");
        el.selectBoxOptions = null;
        el = null;

        RemoveColorPickers();

        ClearDataList("feedlist");
        ClearDataList("pagelist");
        ClearDataList("alertlist");
        ClearDataList("catlist");
        ClearDataList("filterlist");

        SelectBoxClear();

        ProxyLoader = null;
        if (TestLoader != null) {
            TestLoader.onreadystatechange = BlankFunction;
            TestLoader = null;
        }
        if (TmpDoc != null) {
            TmpDoc.loadXML(BlankXML);
            TmpDoc = null;
        }
        Fonts = null;
        ClearMap(Pickers);
        Pickers = null;
        ColorClass = null;
        BlankXML = null;
        ToggleName = null;
        LastId = null;
        LastNode = null;
        LastCat = null;
        DefaultSettingsPath = null;
        CurrentSettingsPath = null;
        CurrentSettingsDoc = null;
        PageDoc = null;
        FeedsManager = null;
        WindowSize = null;
        KindNames = null;
        CurrentFolders = null;
    } catch (e) {
        BugReport("SettingsClear exception: " + e.message);
    }
    System.Gadget.document.parentWindow.LoadIgnore = false;
    System.Gadget.document.parentWindow.ScrollBusy = false;
}

SettingsInit();
