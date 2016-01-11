var Folders = null;
var CatTotals = null;
var FeedTotals = null;
var ScrollWidth = null;

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

function ItemOnClick(ev) {
    var targ = GetTarget(ev);
    if (targ != null) {
        while (targ.className.indexOf("details") < 0) targ = targ.parentNode;
        if (targ.innerHTML == "more...")
            targ.innerHTML = targ.getAttribute("content");
        else
            targ.innerHTML = "more...";
        targ = null;
    }
    ev = null;
}

function ItemOnMouseOver(ev) {
    var targ = GetTarget(ev);
    if (targ != null) {
        while (targ.className.indexOf("matchtable") < 0) targ = targ.parentNode;
        targ.style.backgroundColor = "#454545";
        targ.style.color = "white";
        targ = null;
    }
    ev = null;
}

function ItemOnMouseOut(ev) {
    var targ = GetTarget(ev);
    if (targ != null) {
        while (targ.className.indexOf("matchtable") < 0) targ = targ.parentNode;
        targ.style.backgroundColor = (targ.className.indexOf("matchtablealt") >= 0) ? "#eeeeee" : "white";
        targ.style.color = "black";
        targ = null;
    }
    ev = null;
}

function MatchItem(feedIdx, item) {
    this.feedIdx = feedIdx;
    this.item = item;
    feedIdx = null;
    item = null;
}

function ClearMatches(matches) {
    if (matches!=null) {
        for (var i = 0; i < matches.length; i++) {
            matches[i].feedIdx = null;
            matches[i].item = null;
            matches[i] = null;
        }
        matches = null;
    }
}

function ClearResults(resultsNode) {
    if (resultsNode!=null) {
        var list = document.getElementsByName("DetailsRow");
        for (var i = 0; i < list.length; i++) {
            list[i].onclick = null;
        }
        list = null;
        list = document.getElementsByName("DetailsCell");
        for (var i = 0; i < list.length; i++) {
            list[i].removeAttribute("content");
        }
        list = null;
        while (resultsNode.hasChildNodes()) {
            var node = resultsNode.lastChild;
            node.onmouseover = null;
            node.onmouseout = null;
            resultsNode.removeChild(node);
            node = null;
        }
        resultsNode = null;
    }
}

function PopulateFeedSearchList() {
    var n = document.getElementById("feedsearchlist");
    if ((n != null) && (Folders!=null)) {
        RemoveAllChildren(n);
        var s = document.createElement("option");
        n.options.add(s);
        s.value = "All";
        s.innerHTML = "All";
        s.selected = "selected";
        s = null;
        s = document.createElement("option");
        n.options.add(s);
        s.value = "Ignore";
        s.innerHTML = "Ignore";
        s = null;
        for(var i = 0;i<Folders.length;i++) {
            var name = Folders[i].key;
            s = document.createElement("option");
            n.options.add(s);
            s.value = name;
            s.innerHTML = name + ((FeedTotals!=null) ? ("(" + FeedTotals[i] + ")") : "");
            s = null;
            name = null;
        }
    }
    n = null;
}

function PopulateCatSearchList() {
    var n = document.getElementById("catsearchlist");
    if ((n != null) && (CatTotals!=null)) {
        RemoveAllChildren(n);
        var s = document.createElement("option");
        n.options.add(s);
        s.value = "All";
        s.innerHTML = "All";
        s.selected = "selected";
        s = null;
        for(var i = 1;i<CatTotals.length;i++) {
            var name = CatTotals[i].key;
            s = document.createElement("option");
            n.options.add(s);
            s.value = name;
            s.innerHTML = name + "(" + CatTotals[i].value[0] + ")";
            s = null;
            name = null;
        }
    }
    n = null;
}

function PubDateMatchDiff(a, b) {
    var d = b.item.pubDateTicks - a.item.pubDateTicks;
    a = null;
    b = null;
    return d;
}

function Search(ev) {
    try {
        var feeds = System.Gadget.document.parentWindow.Feeds;
        var isSort = document.getElementById("sort").checked;
        var andWords = document.getElementById("andwords").checked;
        var andCats = document.getElementById("andcats").checked;
        var words = document.getElementById("keywords").value;
        var catIndex = document.getElementById("feedsearchlist").selectedIndex;
        var tmp = document.getElementById("catsearchlist");
        var groups = new Array(new Array());     
        var catWords = new Array();
        var matches = null;
        var keyWords = null;
        var count = 0, andCount;
        var c,s,f,j,i,k,n,v,w;
        var title,description;
        
        if(words.length>0) {
            keyWords = words.split(",");
            n = keyWords.length;
            for(i=0;i<n;i++) keyWords[i]=keyWords[i].toLowerCase();
        } else {
            n = 0;
        }
        words = null;
        
        k = tmp.options.length;
        for (i = 0; i < k; i++) {
            if (tmp.options[i].selected) {
                if(i==0) {
                    break;
                } else {
                    catWords.push("|"+CatTotals[i].key+"|");
                }
            }
        }
        w = catWords.length;
               
        for(c = 0; c < Folders.length; c++) groups.push(new Array());
        i = feeds.length;
        while (i-- > 0) {
            f = feeds[i];
            if((catIndex<2) || (f.folder==Folders[catIndex-2].key)) {
                matches = (catIndex==1) ? groups[0] : groups[1+SearchMapIndex(Folders,f.folder)];
                j = f.items.length;
                while (j-- > 0) {
                    tmp = f.items[j];
                    if((tmp!=null) && (tmp.title!=null) && (tmp.description!=null)) {
                        if(w!=0) {
                            andCount=0;
                            s = tmp.categories;
                            for(v=0;v<w;v++) {
                                if(s.indexOf(catWords[v])>=0) {
                                    ++andCount;
                                    if(!andCats) break;
                                }
                            }
                            if((andCount==0)||(andCats && (andCount!=w))) continue;
                        }
                        if(n!=0) {
                            title = tmp.title.toLowerCase();
                            description = tmp.description.toLowerCase();
                            andCount = 0;
                            for (k = 0; k < n; k++) {
                                var key = keyWords[k];
                                if((title.indexOf(key) >= 0) || (description.indexOf(key) >= 0)) {
                                    ++andCount;
                                    if(!andWords) break;
                                }
                            }
                            if((andCount==0)||(andWords && (andCount!=n))) continue;
                        }
                        ++count;
                        matches.push(new MatchItem(i, tmp));
                    }
                }
                tmp = null;
            }
            j = null;
            matches = null;
            f = null;
        }
        ClearArray(keyWords);
        keyWords = null;
        var lo = 0;
        var hi = 0;
        if(catIndex!=1) {
            lo = 1;
            hi = groups.length-1;
        }    
        var g;
        if(isSort) {
            for(g = lo; g<=hi; g++) {
                groups[g].sort(PubDateMatchDiff);
            }
        }

        var matchesNode = document.getElementById("matches");
        matchesNode.innerHTML = "Results: " + count;
        matchesNodes = null;
        var resultsNode = document.getElementById("results");
        ClearResults(resultsNode);
        var rownum = 0;
        for(g = lo; g <=hi; g++) {
            matches = groups[g];
            if(catIndex!=1 && matches.length>0) {
                s = document.createElement("span");
                s.className = "cattitle";
                s.innerHTML = Folders[g-1].key;
                resultsNode.appendChild(s);
                s = null;
            }           
            for (n = 0; n < matches.length; n++) {
                var match = matches[n];

                t = CreateTable();
                t.className = (n % 2) ? "matchtable" : "matchtablealt";
                t.onmouseover = ItemOnMouseOver;
                t.onmouseout = ItemOnMouseOut;
                resultsNode.appendChild(t);

                var b = CreateTableHeader(t);
                t = null;

                var r = document.createElement("tr");
                r.className = "match";
                b.appendChild(r);

                var d = document.createElement("td");
                d.className = "feedname";
                d.innerHTML = ++rownum + ") " + feeds[match.feedIdx].name;
                r.appendChild(d);
                d = null;

                d = document.createElement("td");
                d.className = "pubdate";
                d.innerHTML = match.item.pubDate;
                r.appendChild(d);
                d = null;

                d = document.createElement("td");
                d.className = "feedlink";
                r.appendChild(d);
                var aNode = document.createElement("a");
                aNode.href = match.item.link;
                aNode.innerHTML = "link"; 
                d.appendChild(aNode);
                s= document.createElement("span");
                s.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
                d.appendChild(s);
                s = null;
                aNode = null;
                d = null;
                r = null;

                r = document.createElement("tr");
                b.appendChild(r);
                d = document.createElement("td");
                d.className = "itemtitle";
                d.colSpan = "3";
                d.innerHTML = match.item.title;
                r.appendChild(d);
                d = null;
                r = null;

                r = document.createElement("tr");
                r.name = "DetailsRow";
                r.onclick = ItemOnClick;
                b.appendChild(r);
                d = document.createElement("td");
                d.name = "DetailsCell";
                d.className = "details";
                d.colSpan = "3";
                d.innerHTML = "more...";
                d.setAttribute("content",match.item.description + "<br/>Categories:"+match.item.categories);
                r.appendChild(d);
                d = null;
                r = null;

                r = document.createElement("tr");
                b.appendChild(r);
                d = document.createElement("td");
                d.className = "spacer";
                d.colSpan = "3";
                r.appendChild(d);
                d = null;
                r = null;
                b = null;

                match = null;
            }
        }
        resultsNode = null;
        for(g = 0;g<groups.length;g++) {
            ClearMatches(groups[g]);
            groups[g] = null;
        }
        groups = null;
        feeds = null;
    }
    catch (e) {
        BugReport("Search exception:" + e.message);
    }
    ev = null;
}

function CategoryTotals() {
    try {
        var feeds = System.Gadget.document.parentWindow.Feeds;
        var numCatFeeds = Folders.length;
        var f,h,i,j,c,n,t,name,names,tmp;
        var k = 1+numCatFeeds;
        var s = new Array(k);
        FeedTotals = new Array(k);
        i = k;
        while(i-- >0) { s[i] = 0; FeedTotals[i] = 0; }
        CatTotals = new Array(new Pair("@All",s));
        h = feeds.length;
        while (h-- > 0) {
            f = feeds[h];
            c = SearchMapIndex(Folders,f.folder);
            j = f.items.length;
            FeedTotals[c]+=j;
            while (j-- > 0) {
                tmp = f.items[j];
                if((tmp!=null) && (tmp.categories!=null)) {
                    names = tmp.categories.substring(1,tmp.categories.length-1).split("|");
                    n = names.length;
                    while(n-- > 0) {
                        name = names[n];
                        i = SearchMapIndex(CatTotals,name);
                        if(i>=0) {
                            ++(CatTotals[i].value[1+c]);
                        } else {
                            i = -i-1;
                            t = new Array(k);
                            CatTotals.splice(i,0,new Pair(name,t));
                            i = k;
                            while(i-- >0) t[i] = 0;
                            t[1+c] = 1;
                            t = null;
                        }
                        name = null;
                    }
                    names = null;
                }
                tmp = null; 
            }
            f = null;
        }
        c = CatTotals.length;
        for(j=1;j<c;j++) {
            t = CatTotals[j].value;
            i = k;
            for(i=1;i<k;i++) {
                t[0]+=t[i];
                s[i]+=t[i];
            }
            t = null;
        }
    } catch(e) {
        BugReport("ComputeTotals exception:"+e.message);
    }
}


function Save(ev) {
    var pw = System.Gadget.document.parentWindow;
    if (pw!=null) {
        var keyWords = document.getElementById("keywords").value.split(",");
        if (keyWords == null || keyWords.length == 0 || keyWords[0].length == 0) {
            keyWords = null;
        } else {
            for (var i = 0; i < keyWords.length; i++) {
                keyWords[i] = keyWords[i].toLowerCase();
            }
        }
        pw.SearchKeyWords = keyWords;
        pw.UpdateSearchMarks();
        keyWords = null;
        pw = null;
    }
    ev = null;
    System.Gadget.Flyout.show = false;
}

function SearchInit() {
    try {
        window.attachEvent("onload", SearchSetup);
    } catch (e) {
        BugReport("SearchInit exception: " + e.message);
    }
}

function SearchSetup() {
    try {
        var pw = System.Gadget.document.parentWindow;
        pw.ScrollBusy = true;
        window.detachEvent("onload", SearchSetup);
        window.attachEvent("onunload", SearchClear);
        document.getElementById("plus").onclick = PlusOnClick;
        document.getElementById("minus").onclick = MinusOnClick;
        var el = null;
        el = document.getElementById("searchButton");
        el.onclick = Search;
        el = null;
        el = document.getElementById("saveButton");
        el.onclick = Save;
        el = null;
        
        Folders = pw.Folders;
        if(Folders==null) {
            System.Gadget.Flyout.show = false;
        } else {
            CategoryTotals();
            PopulateFeedSearchList();
            PopulateCatSearchList();
            
            var keyWords = pw.SearchKeyWords;
            if (keyWords!=null) {
                for (var i = 0; i < keyWords.length; i++) {
                    document.getElementById("keywords").value += keyWords[i];
                    if (i != (keyWords.length - 1))
                        document.getElementById("keywords").value += ",";
                }
                keyWords = null;
            }
        }
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
        BugReport("SearchSetup exception:" + e.message);
    }
}

function SearchClear() {
    try {
        if(ScrollWidth!=null) {
            System.Gadget.document.body.style.width = ScrollWidth;
        }
        window.detachEvent("onunload", SearchClear);
        document.getElementById("plus").onclick = null;
        document.getElementById("minus").onclick = null;       
        var el = null;
        el = document.getElementById("searchButton");
        el.onclick = null;
        el = null;
        el = document.getElementById("saveButton");
        el.onclick = null;
        el = null;
        var resultsNode = document.getElementById("results");
        ClearResults(resultsNode);
        resultsNode = null;
        Folders = null;
        ClearArray(CatTotals);
        CatTotals = null;
        FeedTotals = null;
    } catch (e) {
        BugReport("SearchClear exception: " + e.message);
    }
    System.Gadget.document.parentWindow.ScrollBusy = false;
}

SearchInit();
