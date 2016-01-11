// Date & Time parsing / formatting.

var Days = new Array("Sun", "Mon", "Tue", "Wed", "Thr", "Fri", "Sat");
var Months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

var Zones = new Array(
    "ACDT,+1030", "ACST,+0930", "ADT,-0300", "AEDT,+1100", "AEST,+1000", "AHDT,-0900",
    "AHST,-1000", "AST,-0400", "AT,-0200", "AWDT,+0900", "AWST,+0800", "BAT,+0300",
    "BDST,+0200", "BET,-1100", "BST,-0300", "BT,+0300", "BZT2,-0300", "CADT,+1030",
    "CAST,+0930", "CAT,-1000", "CCT,+0800", "CDT,-0500", "CED,+0200", "CET,+0100",
    "CST,-0600", "CENTRAL,-0600", "EAST,+1000", "EDT,-0400", "EED,+0300", "EET,+0200",
    "EEST,+0300", "EST,-0500", "EASTERN,-0500", "FST,+0200", "FWT,+0100",
    "GMT,-0000", "GST,+1000", "HDT,-0900", "HST,-1000", "IDLE,+1200", "IDLW,-1200",
    "IST,+0530", "IT,+0330", "JST,+0900", "JT,+0700", "MDT,-0600", "MED,+0200",
    "MET,+0100", "MEST,+0200", "MEWT,+0100", "MST,-0700", "MOUNTAIN,-0700",
    "MT,+0800", "NDT,-0230", "NFT,-0330", "NT,-1100", "NST,+0630", "NZ,+1100",
    "NZST,+1200", "NZDT,+1300", "NZT,+1200", "PDT,-0700", "PST,-0800",
    "PACIFIC,-0800", "ROK,+0900", "SAD,+1000", "SAST,+0900", "SAT,+0900",
    "SDT,+1000", "SST,+0200", "SWT,+0100", "USZ3,+0400", "USZ4,+0500",
    "USZ5,+0600", "USZ6,+0700", "UT,-0000", "UTC,-0000", "UZ10,+1100",
    "WAT,-0100", "WET,-0000", "WST,+0800", "YDT,-0800", "YST,-0900",
    "Z,-0000", "ZP4,+0400", "ZP5,+0500", "ZP6,+0600"
);

var ZoneMap = new Array();

function CurrentTicks() {
    var d = new Date();
    var t = d.getTime();
    d = null;
    return t;
}

function StdFormatDate(ticks) {
    if (isNaN(ticks) || ticks == 0) return "0";
    var d = new Date(ticks);
    return Days[d.getDay()] + ", " + d.getDate() + " " + Months[d.getMonth()] + " " + d.getFullYear()
        + " " + ((d.getHours() < 10) ? "0" : "") + d.getHours()
        + ":" + ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes()
        + ":" + ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
}

function UserParseDate(dateString) {
    var ticks = 0;
    try {
        if (dateString == "0") return 0;
        if (dateString == "") return (new Date()).getTime();
        ticks = Date.parse(dateString);
    } catch (e) {
        // Ignore any errors.
    }

    if (isNaN(ticks)) return 0;
    return ticks;
}

// [#](+|-)hh[:][mm]
function ZoneOffsetToMinutes(z) {
    if ((z != null) && (z.length > 1)) {
        if (z.charAt(0) == "#") z = z.substr(1);
        var m = ((z.indexOf(":") > 0) ? 1 : 0);
        return ((z.charAt(0) == '-') ? -1 : 1) * (z.substr(1, 2) * 60 + ((z.length > 3) ? (1 * z.substr(3 + m, 2)) : 0));
    }
    return 0;
}

function InitZones() {
    var n, x, z, s;
    for (n = 0; n < Zones.length; ++n) {
        s = Zones[n];
        x = s.indexOf(",");
        z = s.substr(1 + x);
        s = s.substr(0, x);
        InsertInMap(ZoneMap, s, ZoneOffsetToMinutes(z));
    }
}

// The following is based on code from Matt Kruse <matt@mattkruse.com>
function LZ(x) {
    return ((x < 0 || x > 9) ? "" : "0") + x;
}

function _getInt(str, i, minlength, maxlength) {
    var chr, num = "";
    while ((--maxlength >= 0) && ((chr = str.charAt(i++)) >= '0') && (chr <= '9')) num += chr;
    if (num.length < minlength) { return null; }
    return num;
}

// Returns a date in the output format specified.
// The format string uses the same abbreviations as in GetDateFromFormat.
function FormatDate(ticks, format) {
    format = format + "";
    var result = "";
    var i_format = 0;
    var c = "";
    var token = "";
    var date = new Date(ticks);
    var y = date.getYear() + "";
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var E = date.getDay();
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var f = date.getMilliseconds();
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    // Convert real date parts into formatted versions
    var value = new Object();
    if (y.length < 4) { y = "" + (y - 0 + 1900); }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M - 1];
    value["NNN"] = MONTH_NAMES[M + 11];
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E + 7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);
    if (H == 0) { value["h"] = 12; }
    else if (H > 12) { value["h"] = H - 12; }
    else { value["h"] = H; }
    value["hh"] = LZ(value["h"]);
    if (H > 11) { value["K"] = H - 12; } else { value["K"] = H; }
    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);
    if (H > 11) { value["a"] = "pm"; }
    else { value["a"] = "am"; }
    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);
    value["f"] = f;
    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) { result = result + value[token]; }
        else { result = result + token; }
    }
    return result;
}

// GetDateFromFormat( date_string , format_string )
// This function takes a day string and a format string. It matches
// If the day string matches the format string, it returns the 
// getTime() of the day. If it does not match, it returns 0.
// The format string consists of the following abbreviations:
// 
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// Fraction     | f [.][1, 2 or 3 digits]
// AM/PM        | a
// Zone postfix | z [zone][[+|-]hh[:][mm]]
// Adjust  p.f. | #[+|-]hh[:][mm]
//
// Note the difference between MM and mm, Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
//  "y-M-dTHH:m:sfz" matches "2011-09-06T00:01:35.123 GMT-07:00"
function GetDateFromFormat(val, format) {
    val = val + "";
    format = format + "";
    var i_val = 0;
    var i_format = 0;
    var c = "";
    var token = "";
    var i, x, y, z, w;
    var now = new Date();
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var day = 1;
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
    var fff = 0;
    var zofs = 0;
    var ampm = 0;

    while (i_format < format.length) {
        // Get next token from format string
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        if (token.length > 0) {
            switch (token.charAt(0)) {
                case 'y':
                    if (token == "yyyy") { x = 4; y = 4; }
                    else if (token == "yy") { x = 2; y = 2; }
                    else if (token == "y") { x = 2; y = 4; }
                    year = _getInt(val, i_val, x, y);
                    if (year == null) { return 0; }
                    i_val += year.length;
                    if (year.length == 2) {
                        if (year > 70) { year = 1900 + (year - 0); }
                        else { year = 2000 + (year - 0); }
                    }
                    break;
                case 'M': case 'N':
                    if (token == "MM" || token == "M") {
                        month = _getInt(val, i_val, token.length, 2);
                        if (month == null || (month < 1) || (month > 12)) { return 0; }
                        i_val += month.length;
                    } else {
                        month = 0;
                        for (i = 0; i < MONTH_NAMES.length; i++) {
                            var month_name = MONTH_NAMES[i];
                            if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                                if (token == "MMM" || (token == "NNN" && i > 11)) {
                                    month = i + 1;
                                    if (month > 12) { month -= 12; }
                                    i_val += month_name.length;
                                    break;
                                }
                            }
                        }
                        if ((month < 1) || (month > 12)) { return 0; }
                    }
                    break;
                case 'E':
                    for (i = 0; i < DAY_NAMES.length; i++) {
                        var day_name = DAY_NAMES[i];
                        if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                            i_val += day_name.length;
                            break;
                        }
                    }
                    break;
                case 'd':
                    day = _getInt(val, i_val, token.length, 2);
                    if (day == null || (day < 1) || (day > 31)) { return 0; }
                    i_val += day.length;
                    break;
                case 'h':
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 12)) { return 0; }
                    i_val += hh.length;
                    break;
                case 'H':
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 23)) { return 0; }
                    i_val += hh.length;
                    break;
                case 'K':
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 0) || (hh > 11)) { return 0; }
                    i_val += hh.length;
                    break;
                case 'k':
                    hh = _getInt(val, i_val, token.length, 2);
                    if (hh == null || (hh < 1) || (hh > 24)) { return 0; }
                    i_val += hh.length; hh--;
                    break;
                case 'm':
                    mm = _getInt(val, i_val, token.length, 2);
                    if (mm == null || (mm < 0) || (mm > 59)) { return 0; }
                    i_val += mm.length;
                    break;
                case 's':
                    ss = _getInt(val, i_val, token.length, 2);
                    if (ss == null || (ss < 0) || (ss > 59)) { return 0; }
                    i_val += ss.length;
                    break;
                case 'f':
                    if (val.substr(i_val, 1) == ".") ++i_val;
                    fff = _getInt(val, i_val, 0, 3);
                    i_val += fff.length;
                    if (fff.length == 0) fff = 0;
                    else if (fff.length == 1) fff *= 100;
                    else if (fff.length == 2) fff *= 10;
                    if (fff == null || (fff < 0) || (fff > 999)) { return 0; }
                    break;
                case 'a':
                    if (val.substring(i_val, i_val + 2).toLowerCase() == "am") { ampm = 1; }
                    else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm") { ampm = 2; }
                    else { return 0; }
                    i_val += 2;
                    break;
                case 'z': // parse: [zone][[+|-]hh[:][mm]]
                    z = val.substring(i_val);
                    i_val += z.length;
                    z = z.replace(/\s/g, '').toUpperCase();
                    x = 0;
                    while (x < z.length && ((w = z.charAt(x)) >= 'A') && (w <= 'Z')) ++x;
                    if (x > 0) {
                        zofs = SearchMapValue(ZoneMap, z.substr(0, x));
                        if (zofs == null) zofs = 0;
                        z = z.substr(x);
                    }
                    zofs += ZoneOffsetToMinutes(z);
                    break;
                case '#': // parse: #[+|-]hh[:][mm]
                    z = format.substring(i_format);
                    i_format += z.length;
                    z = z.replace(/\s/g, '').toUpperCase();
                    zofs -= ZoneOffsetToMinutes(z);
                    break;             
                default:
                    if (val.substring(i_val, i_val + token.length) != token) { return 0; }
                    else { i_val += token.length; }
                    break;
            }
        }
    }
    // Allow trailing space if at end of format string.
    if ((i_format < format.length) && (i_val != val.length)) { return 0; }

    // Is day valid for month?
    if (month == 2) {
        // Check for leap year
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
            if (day > 29) { return 0; }
        } else {
            if (day > 28) { return 0; }
        }
    } else if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
        if (day > 30) { return 0; }
    }
    // Correct hours value
    if (hh < 12 && ampm == 2) { hh += 12; }
    else if (hh > 11 && ampm == 1) { hh -= 12; }
    var utcTicks = Date.UTC(year, month - 1, day, hh, mm, ss, fff);
    if (zofs != 0) utcTicks -= zofs * 60000;
    return utcTicks;
}

InitZones();
