Hermes (v2.3.0.6) RSS/RDF/Atom auto scrolling feed reader. 23th January 2014.

Hermes is an open source (i.e. free) Windows sidebar gadget that displays
a scrolling list of items from an editable list of RSS, RDF and Atom feeds.

Features: 
1) Resizable ticker tape or vertical scrolling and auto scroll rate.
2) Options for right to left layout, changing fonts, colors, background image, size, etc.
3) Multiple rules for filtering items: Read-by date, Age, Top X, 
   Keep duration, Cross feed compare, Sort, Date & time zone format.
4) Preserves read & deleted state of items, now even after reboots.
5) Mouse keys for scrolling, deleting items, feeds, or read marks.
6) Item categories & folders for managing feeds.
7) Regex filters for including or excluding items based on content.
8) Page monitoring: track website page changes as-if via a feed.
9) Alerts: trigger email, flyout, or sound upon news event.
10) Importing or exporting settings, feeds, via XML & FeedsManager.
11) Keyword search options.
12) Option to use proxy server.
 
Created by Christian Westman.
Changes by Darren Whobrey.

We hope you like it :)

For change details see Change Log via link in Help.
Please report bugs via Issue Tracker at hermesgadget.codeplex.com.

Areas for Improvement and Known Issues:
1) Fix the remaining memory leaks! Most leaks from closures, circular refs and nulling vars have been eliminated.
   Apologies for all the redundant var null assignments - how's that for javascript paranoia!
2) Heart-beat stops after pressing reload icon when onmouseout event missed after loading via FeedsManager.
3) Exploit FeedsManager folder change events to async push updates, rather than polling.
   Use FeedsManager AsyncLoad per Feed via event handler added to FeedsWatcher.
   I couldn't figure out how to attach to FeedsWatcher per Feed without some messy html object ids.
4) Internationalization, for example, improve Right-To-Left text layout.
5) Use themes, e.g. to change palette, background color, etc.
6) Double-clicking is currently slow because second click event is missed if too quick,
   or maybe this is because my machine is old!
7) Cross compare checking is very simple and may remove too many items when feeds are removed!
8) Page monitoring: add commands to auto navigate forms to point of interest, 
   such as sequences of POST({id="x",inputY="z",...}), etc.

Any volunteers for the above?

Technical Notes:
1) The alert function for checking the gallery for new versions relies on the version number appearing
  in the gallery gadget title in the format: "Hermes (a.b.c.d) ...".
2) Quirks mode must be used for main.html due to gadget "g:background" tag, which only displays
   correctly under strict.dtd in block mode, but then no events work!
3) "g:background" is only used because it allows a window smaller than 70px high.
4) There is now very little dependance on the System.Gadget libraries: it could easily be made to work as
   a standard browser application.
5) Had to add the "Welcome" startup process to pass the gallery approval process.

Future Plans for Hermes:
Apart from bug fixes, no further improvements are planned by me (Darren),
so if you would like to contribute, or improve Hermes, feel free
and let me know how you get on ( hermes@mildai.org :).
