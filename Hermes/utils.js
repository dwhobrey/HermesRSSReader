
var BlankXML = "";
var DebugOn = false;
var LogOn = false;
var IDCount = 0;
var LogID = 0;

function LogReport(a) {
    var v = null;
    try {
        v = System.Gadget.version;
    } catch(e) { v = "2.3.0.3+";}
    if (LogOn) {
        System.Diagnostics.EventLog.writeEntry("Hermes(" + v + "):" + LogID++ + "," + a);
    }
}

function BugReport(a) {
    if (DebugOn) {
        LogReport(a); 
        // debugger;
        DebugOn = false;
    }
}

function DecToHexString(number) {
    if (number < 0) { number = 0xFFFFFFFF + number + 1; }
    return number.toString(16).toUpperCase(); 
}

function HashCode(str) {
    var result = 0;
    for (var i = 0; i < str.length; ++i) {
        result = 31 * result + str.charCodeAt(i);
        result %= 0x100000000;
    }
    return result;
}

function Trim(str) {
    if ((str != null) && (str.length > 0)) {
        str = str.replace(/^\s\s*/, '');
        str = str.replace(/\s\s*$/, '');
    }
    return str;
}

function TrimDefault(str, defaultstr) {
    if ((str != null) && (str.length > 0)) {
        str = str.replace(/^\s\s*/, '');
        str = str.replace(/\s\s*$/, '');
        if (str.length > 0) return str;
    }
    return defaultstr;
}

function TrimNode(node, defaultstr) {
    if (node != null) {
        var str = node.text;
        if ((str != null) && (str.length > 0)) {
            str = str.replace(/^\s\s*/, '');
            str = str.replace(/\s\s*$/, '');
            if (str.length > 0) return str;
        }
    }
    return defaultstr;
}

function ReplaceAll(s, a, b) {
    var p = 0, n = a.length;
    while ((p=s.indexOf(a,p)) != -1) {
        s = s.slice(0, p) + b + s.slice(p + n);
    }
    return (s);
}

function UniqueID() {
    var d = new Date();
    var t = d.getTime();
    d = null;
    return t +"_" + IDCount++;
}

function ClearArray(list) {
    if (list != null) {
        for (var i = 0; i < list.length; i++) {
            list[i] = null;
        }
        list = null;
    }
}

function RemoveAllChildren(node) {
    if (node != null) {
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }
}

function GetTarget(ev) {
    var targ = null;
    if (ev == null) ev = window.event;
    if (ev.target!=null) targ = ev.target;
    else targ = ev.srcElement;
    ev = null;
    return targ;
}

function GetClassNode(p, name) {
    while (p!=null && ((p.className==null)|| (p.className.indexOf(name) < 0))) p = p.parentNode;
    return p;
}

function CreateTableHeader(t) {
    var h = document.createElement("thead");
    h.style.height = "0px";
    var f = document.createElement("tfoot");
    f.style.height = "0px";
    var b = document.createElement("tbody");
    t.appendChild(h);
    t.appendChild(f);
    t.appendChild(b);
    t = b;
    b = null;
    h = null;
    f = null;
    return t;
}

function CreateTable() {
    var t = document.createElement("table");
    t.style.display = "block";
    t.cellpadding = "0px";
    t.cellspacing = "0px";
    return t;
}

function BlankFunction() {
}

function Pair(key,value) {
    this.key = key;
    this.value = value;
}
function MapKeyDiff(a,b) {
    var d = (a.key < b.key) ? -1 : ((a.key>b.key) ? 1 : 0);
    a = null;
    b = null;
    return d;
}
function GetMapIndex(map,key) {
    var n = -1;
    if(map!=null) {
        for(var i = 0; i<map.length; i++) {
            if((map[i]!=null) && (map[i].key==key)) {
                n = i;
                break;    
            }
        }
    }
    map = null;
    key = null;
    return n;
}
function GetMapValue(map,key) {
    var v = null;
    if(map!=null) {
        for(var i = 0; i<map.length; i++) {
            if((map[i]!=null) && (map[i].key==key)) {
                v = map[i].value;
                break;    
            }
        }
    }
    map = null;
    key = null;
    return v;
}
function AddToMap(map,key,value) {
    var i = GetMapIndex(map,key);
    if(i>=0) {
        map[i].key = key;
        map[i].value = value;
    } else {
        i = -i-1;
        map.splice(i,0,new Pair(key,value));
    }
    map = null;
    key = null;
    value = null;
}
function SearchMapIndex(map, key) {
    var mid, val, hi, lo = 0;
    if(map!=null) {
        hi = map.length;
        while (lo < hi) {
            mid = (lo + hi) >> 1;
            val = map[mid].key;
            if (key < val) {
                hi = mid;
            } else if (key > val) {
                lo = mid + 1;
            } else {
                while (mid > 0) {
                    if (map[mid - 1].key != key) break;
                    --mid;
                }
                map = null;
                key = null;
                lo = null;
                hi = null;
                val = null;
                return mid;
            }
            mid = null;
            val = null;
        }
        hi = null;
    }
    map = null;
    key = null;
    return -lo-1;
}
function SearchMapValue(map,key) {
    var i = SearchMapIndex(map,key);
    var v = null;
    if(i>=0) v = map[i].value;
    map = null;
    key = null;
    return v;
}
function InsertInMap(map,key,value) {
    var i = SearchMapIndex(map,key);
    if(i>=0) {
        map[i].key = key;
        map[i].value = value;
    } else {
        i = -i-1;
        map.splice(i,0,new Pair(key,value));
    }
    map = null;
    key = null;
    value = null;
    return i;
}

function ClearMapEntry(map,index) {
    if(map!=null) {
        if((index>=0) && (index<map.length)) {
            var p = map[index];
            if(p!=null) {
                p.key = null;
                p.value = null;
                p = null;
                map[index] = null;
            }
        }
        map = null;
    }
    index = null;
} 
function ClearMap(map) {
    if(map!=null) {
        for(var i=0;i<map.length;i++) {
            var p = map[i];
            if(p!=null) {
                p.key = null;
                p.value = null;
                p = null;
                map[i] = null;
            }
        }
        map = null;
    }
}

function SelectSingleChild(a) {
    var p = "*"; 
    if(a!=null) p += "[local-name()='" + a + "']";
    a = null;
    return p;
}

function SelectSinglePath(a, b, c) {
    var p = "/";
    if (a != null) p += "/*[local-name()='" + a + "']";
    if (b != null) p += "/*[local-name()='" + b + "']";
    if (c != null) p += "/*[local-name()='" + c + "']";
    a = null;
    b = null;
    c = null;
    return p;
}

function SelectNodesChild(a) {
    var p = "*";
    if(a!=null) p += "[local-name()='" + a + "']";
    a = null;
    return p;
}

function SelectNodesPath(a, b) {
    var p = "/";
    if (a != null) p += "/*[local-name()='" + a + "']";
    if (b != null) p += "/*[local-name()='" + b + "']";
    a = null;
    b = null;
    return p;
}

function GetDocAttribute(doc, nodeName, attributeName, defaultValue) {
    var val = null;
    var node = doc.selectSingleNode(nodeName);
    if (node != null) {
        val = node.getAttribute(attributeName);
    } else {
        val = defaultValue;
    }
    node = null;
    doc = null;
    nodeName = null;
    attributeName = null;
    return val;
}

function SetLocalFlag(obj, propertyName, defaultValue) {
    var res;
    if (obj != null) {
        var tmp = obj.getAttribute(propertyName);
        res = ((tmp != null) ? (tmp == "true") : defaultValue);
        tmp = null;
    } else {
        res = defaultValue;
    }
    obj = null;
    propertyName = null;
    defaultValue = null;
    return res;
}

function SetLocalValue(obj, propertyName, defaultValue) {
    var tmp;
    if (obj == null) {
        tmp = defaultValue;
    } else {
        if (propertyName != null) {
            tmp = obj.getAttribute(propertyName);
        } else {
            tmp = obj.text;
        }
        if (tmp == null) tmp = defaultValue;
    }
    obj = null;
    propertyName = null;
    defaultValue = null;
    return tmp;
}

function RegExpFromStr(str) {
    var flags = "";
    if (str != null && str.length > 0) {
        if (str.charAt(0) == '/') {
            str = str.substring(1);
            var i = str.lastIndexOf("/");
            if (i >= 0) {
                flags = str.substring(i + 1);
                str = str.substring(0, i);
            }
            i = null;
        }
    } else {
        str = "";
    }
    var re = new RegExp(str, flags);
    re.compile(str, flags);
    str = null;
    flags = null;
    return re;
}

function SetPattern(p) {
    var re = null;
    try {
        if ((p != null) && (p.length > 0)) {
            re = RegExpFromStr(p);
        }
    } catch (e) { }
    return re;
}

function PlaySound(soundfileurl) {
    try {
        if (soundfileurl == null) {
            soundfileurl = "C:\\Windows\\Media\\Windows Notify.wav";
        }
        System.Sound.playSound(soundfileurl);
    } catch (e) {
    }
    soundfileurl = null;
}

function SendEMail(server, port, usessl, username, password, from, to, subject, body, ashtml,isrtl) {
    var c = 0;
    var s = "http://schemas.microsoft.com/cdo/configuration/";
    var m = null;
    try {
        m = new ActiveXObject("CDO.Message");
    } catch (e) {
        c = 1;
    }
    if (c != 0 || m == null) {
        c = 1;
    } else {
        try {
            var isSecure = (password != null && password.length > 0);
            m.Configuration.Fields(s + "sendusing") = 2;
            m.Configuration.Fields(s + "smtpserverport") = port;
            m.Configuration.Fields(s + "smtpserver") = server;
            m.Configuration.Fields(s + "smtpauthenticate") = (isSecure ? 1 : 0);
            if (usessl) m.Configuration.Fields(s + "smtpusessl") = "True";
            //m.Configuration.Fields(s + "smtpaccountname") = username;
            if (isSecure) {
                m.Configuration.Fields(s + "sendusername") = username;
                m.Configuration.Fields(s + "sendpassword") = password;
            }
            m.Configuration.Fields.Update();
            s = "urn:schemas:mailheader:";
            m.Fields(s + "thread-topic") = "";
            m.Fields(s + "importance") = "";
            m.Fields(s + "priority") = "";
            m.Fields(s + "content-class") = "";
            m.Fields(s + "content-type") = (ashtml ? 'text/html; charset="utf-8"' : 'text/plain; charset="utf-8"');
            m.Fields(s + "x-mailer") = "Microsoft CDO";
            m.Fields(s + "content-languge") = "en-gb";
            m.Fields.Update();

            m.From = from;
            m.To = to;
            m.Subject = subject;
            if (ashtml) {
                m.HTMLBody = "<html><head><title>" + subject + "</title></head>"
                    + (isrtl ? '<body dir="rtl">' : "<body>") + body + "</body></html>";
            } else {
                m.TextBody = body;
            }
            m.Send();
        } catch (e) {
            c = 2;
        }
    }
    m = null;
    s = null;
    server = null;
    port = null;
    username = null;
    password = null;
    from = null;
    to = null;
    subject = null;
    body = null;
    ashtml = null;
    isrtl = null;
    return c;
}
