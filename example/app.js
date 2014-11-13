/*
PSPDFKit Appcelerator Sample Code

To install the module copy the included com.pspdfkit folder to the following directory on your Mac
/Library/Aplication Support/Titanium/modules
Then on your project modify the tiapp.xml and include the following before the final </ti:app>
<modules>
<module version="INSERT_CURRENT_PSPDFKIT_VERSION_NUMBER">com.pspdfkit</module>
</modules>
This will allow Titanium to find the module at compilation time.

Note: PSPDFKit v3 needs at least Xcode 5.0 or higher and supports iOS 6.0+.
Type "xcode-select --print-path" in the console and check that it lists the correct Xcode version.

To synchronize popovers, you can listen for the "didPresentPopover" event that PSPDFKit fires after opening a popover.
*/

// open a single window
var window = Ti.UI.createWindow({
    backgroundColor : 'white'
});
window.orientationModes = [Titanium.UI.PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT];

// Include the PSPDFKit module.
var pspdfkit = require('com.pspdfkit');
Ti.API.info("module is => " + pspdfkit);

// You need to activate your PSPDFKit before you can use it.
// Follow the instructions in the email you get after purchasing from http://pspdfkit.com.
pspdfkit.setLicenseKey("INSERT_LICENSE_HERE");

// increase log level (only needed for debugging)
// Log level 0 (nothing) to 4 (verbose) are available.
pspdfkit.setLogLevel(3);

// add custom language additions. Optional.
// English, German, and French are built-in but can be overridden here.
// This dictionary is just provided so you can easily look up the words.
// See all strings at /Users/USERNAME/Library/Application\ Support/Titanium/modules/iphone/com.pspdfkit.source/VERSIONNUMBER/example/PSPDFKit.bundle/en.lproj
pspdfkit.setLanguageDictionary({
    "en" : {
        // general
        "Table Of Contents" : "Outline",
        "Go to %@" : "%@",
    },
    "de" : {
        "Grid" : "Übersicht"
    }
});

// Use if you want to clear the cache. Usually not needed.
//pspdfkit.clearCache();

// allows you to pre-cache a document.
// This call is not needed and purely optional if you want to prepare rendering before showing.
// (e.g. call directly after downloading)
pspdfkit.cacheDocument('PSPDFKit.pdf');

// You can selectively delete the cache for a document using
//pspdfkit.removeCacheForDocument('PSPDFKit.pdf');

// and stops the background caching process.
//pspdfkit.stopCachingDocument('PSPDFKit.pdf');

// Get rendered image for the document and page. Parameter 3 is 0 for full-size and 1 for thumbnail.
var image = pspdfkit.imageForDocument('PSPDFKit.pdf', 0, 1);
Ti.API.info("image: " + image);

// Define Modal Test Button
var modalButton = Titanium.UI.createButton({
    title : 'Open modal view',
    top : 10,
    height : 35,
    left : 20,
    right : 20
});

var navButton = Ti.UI.createButton({
    title : 'Custom',
    backgroundColor : '#ae4041',
    color : '#ffffff',
    style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
    height : 24
});

 navButton.addEventListener('click', function(e) {
    alert("Custom Titanium UIBarButton pressed");
 });

modalButton.addEventListener('click', function(e) {
    // Replace PSPDFKit.pdf with your own pdf.
    // Copy the PDF to include to the Resources folder (where app.js is)
    // After copying a new PDF, Clean the project and then rebuild.
    var pdfController = pspdfkit.showPDFAnimated('PSPDFKit.pdf', 4, // animation option: 0 = no animation, 1 = default animation, 2 = UIModalTransitionStyleCoverVertical, 3 =  UIModalTransitionStyleFlipHorizontal, 4 =  UIModalTransitionStyleCrossDissolve
    // http://developer.apple.com/library/ios/#documentation/uikit/reference/UIViewController_Class/Reference/Reference.html
    {
        lockedInterfaceOrientation : 3, // lock to one interface orientation. optional.
        pageMode : 0, // PSPDFPageModeSingle
        pageTransition : 2, // PSPDFPageCurlTransition
        linkAction : 3, // PSPDFLinkActionInlineBrowser (new default)
        thumbnailSize: [200, 200], // Allows custom thumbnail size.

        // toolbar config: see http://pspdfkit.com/documentation/Classes/PSPDFViewController.html#//api/name/outlineButtonItem for built in options.
        // Built in options are send via string. Invalid strings will simply be ignored.
        leftBarButtonItems : ["closeButtonItem"],
        rightBarButtonItems : [navButton, "viewModeButtonItem"],

        // note that the "annotationButtonItem" is not available in PSPDFKit Basic (the marketplace.appcelerator.com version)
        // to get text selection and annotation feature, purchase a full license of PSPDFKit Annotate at http://PSPDFKit.com
        additionalBarButtonItems : ["openInButtonItem", "emailButtonItem", "printButtonItem", "searchButtonItem", "outlineButtonItem", "annotationButtonItem"] // text list, does *not* support custom buttons.

        //printOptions : 1, // See values from PSPDFPrintOptionsDocumentOnly
        //openInOptions : 0x1<0|0x1<1, // See values from PSPDFDocumentSharingOptions
        //sendOptions : 1 // See values from PSPDFDocumentSharingOptions

        //editableAnnotationTypes : ["Highlight", "Ink"] // Allows you to limit the editable annotation types
        // pageMode values 0=single page, 1=double page, 2=automatic
        // some supported properties
        // see http://pspdfkit.com/documentation/Classes/PSPDFViewController.html
        /* doublePageModeOnFirstPage: true,
         * page" : 3,
         * pageScrolling" : 1,
         * zoomingSmallDocumentsEnabled : false,
         * fitToWidthEnabled : false,
         * maximumZoomScale : 1.3,
         * pagePadding : 80,
         * shadowEnabled : false,
         * backgroundColor : "#FF0000", */
    }, {
        title : "My custom modal document title",
    });

    // get current document path
    //var documentPath = pdfController.documentPath;

    //UIDeviceOrientationPortrait = 1, UIDeviceOrientationPortraitUpsideDown = 2, UIDeviceOrientationLandscapeLeft = 3, UIDeviceOrientationLandscapeRight = 4, -1 to remove lock.
    // there's also currentInterfaceOrientation to query the current state.'
    //pdfController.lockedInterfaceOrientation = 3;

    //pdfController.showCloseButton = false;

    // Changes the link annotation colors to a light red (first hex pair is optional alpha) (or use "clear" to hide)
    pdfController.linkAnnotationBorderColor = "#33FF0000";    // Border Color
    pdfController.linkAnnotationHighlightColor = "99FF0000";  // Highlight Color
    pdfController.thumbnailFilterOptions = ["All", "Bookmarks"] // "Annotations" is the third possibility. If <= 1 option, the filter will not be displayed.
    pdfController.outlineControllerFilterOptions = ["Outline"] // "Outline", "Bookmarks" and "Annotations" are supported.

    // example how to hide the top left close button
    //pdfView.showCloseButton = false;

    // If this is PSPDFKit Annotate, you can save annotations using:
    pdfController.saveAnnotations();

    // PSPDFKit Annotate also allows you to define the annotation save destination:
    // PSPDFAnnotationSaveModeDisabled = 0
    // PSPDFAnnotationSaveModeExternalFile = 1, // will use save/loadAnnotationsWithError of PSPDFAnnotationParser (override to ship your own)
    // PSPDFAnnotationSaveModeEmbedded = 2,
    // PSPDFAnnotationSaveModeEmbeddedWithExternalFileAsFallback = 3 // Default.
    //pdfController.setAnnotationSaveMode(1);

    // most properties can also be changed at runtime
    // here we start scrolling to page 4 right upon starting
    //pdfController.scrollToPage(4, true);

    Ti.API.log('current page: ' + pdfController.page + ' total pages: ' + pdfController.totalPages);

    // you can also enable/disable the user's ability to scroll pages
    //pdfController.scrollingEnabled = false;

    // close controller after 2 seconds
    //var closeController = function() { pdfController.close(true) };
    //setTimeout(closeController, 5000);

    // example how to register for the didShowPage event
    pdfController.addEventListener("didShowPage", function(e) {
        Ti.API.log('(modal) didShowPage: ' + e.page);
    });

    // add event that listens when a viewController will be closed
    pdfController.addEventListener('willCloseController', function(e) {
        Ti.API.log('(modal) willCloseController... we\'re on the edge of being killed.');
    });
    // add event after view controller has been closed
    pdfController.addEventListener('didCloseController', function(e) {
        alert("PSPDFKit ViewController closed.");
    });
    // add event listener for annotations.
    pdfController.addEventListener('didTapOnAnnotation', function(dict) {
        Ti.API.log("didTapOnAnnotation " + dict.siteLinkTarget);
    });
    
    pdfController.addEventListener('willShowHUD', function(dict) {
        Ti.API.log("willShowHUD - show your custom HUD");
    });
    
    pdfController.addEventListener('willHideHUD', function(dict) {
        Ti.API.log("willHideHUD - hide your custom HUD");
    });
    // set a callback on annotation events.
    // return true if you have processed the annotation yourself
    // note: you can't create UI elements here, as this is a callback with a different context
    // use the didTapOnAnnotation-event that's called afterwards.
    pdfController.setDidTapOnAnnotationCallback(function(dict) {
        Ti.API.log('(modal) didTapOnAnnotationCallback page:' + dict.page + ', url: ' + dict.siteLinkTarget);
        return false;
        // let PSPDFKit handle it
    });

});

var appceleratorTestButton = Ti.UI.createButton({
    title : 'Appcelerator',
    backgroundColor : '#cccccc',
    color : '#ffffff',
    style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
    width : 100
});
appceleratorTestButton.addEventListener('click', function(e) {
    alert("Custom appceleratorTestButton pressed.");
});

// add inline view - works almost equal to showPDFAnimated.
var pdfView = pspdfkit.createView({
    top : 200,
    right : 0,
    bottom : 0,
    left : 0,
    filename : 'PSPDFKit.pdf',
    options : {
        pageMode : 0,
        toolbarEnabled : true,
        // close button is automatically hidden here
        leftBarButtonItems : [appceleratorTestButton]
    },
    documentOptions : {
        title : "Custom Title Here"
    }
});

pdfView.setAnnotationSaveMode(1);
pdfView.thumbnailFilterOptions = null; // Remove filters.

window.add(pdfView);

// example how to start a search.
// Window needs to be completely visible before calling this (thus the delay)
setTimeout(function() {
    pdfView.searchForString("aspect", true);
}, 1000);

// to coordinate the internal popovers with the view, you can use hidePopover(true) (true/false is the animation value)
//pdfView.hidePopover(true);

// example how to register for the didShowPage event
pdfView.addEventListener("didShowPage", function(e) {
    Ti.API.log('didShowPage: ' + e.page);
});

// example how to lock scrolling
//pdfView.scrollingEnabled = false;
//pdfView.scrollToPage(2, false);

Ti.API.log('pdfView: current page: ' + pdfView.page + ' total pages: ' + pdfView.totalPages);

// Define an action button
var button2 = Titanium.UI.createButton({
    title : 'Scroll to page 5',
    top : 55,
    height : 35,
    left : 20,
    right : 20
});

button2.addEventListener('click', function(e) {
    pdfView.scrollToPage(5, true);
    pdfView.setViewMode(1, true);
    // show thumbnails is 1, page is 0.
});

var button3 = Titanium.UI.createButton({
    title : 'Push controller',
    top : 100,
    height : 35,
    left : 20,
    right : 20
});

// create a NavigationWindow, push "first" window onto it
var navigationWindow = Titanium.UI.iOS.createNavigationWindow({
    window : window
});

// add a click event to the label which will create a new window with a PSPDFKit view and push it onto the nav group
button3.addEventListener("click", function(e) {

    // create "second" window
    var pushedWindow = Ti.UI.createWindow({
        backgroundColor : "#fff",
        title : "Pushed Controller",
    });

    // create PSPDFKit view
    var pdfView = pspdfkit.createView({
        filename : 'protected.pdf',
        options : {
            pageMode : 0,
            toolbarEnabled : true,
            useParentNavigationBar : true,
        },
        documentOptions : {
            password : "test123"
        }
    });

    // add PSPDFKit view to second window and push second window to nav group
    pushedWindow.add(pdfView);
    navigationWindow.open(pushedWindow);
});


var button4 = Titanium.UI.createButton({
    title : 'Push controller with custom toolbar',
    top : 145,
    height : 35,
    left : 20,
    right : 20
});


button4.addEventListener("click", function(e) {

    var pushedWindow = Ti.UI.createWindow({
        barColor:"#222"
    });
    
    ////////////////////////////////
    // custom toolbar
    var customToolbarView = Ti.UI.createView({
        top:20,
        left:5,
        right:5,
        height:30,
        backgroundColor:"transparent",
        opacity:0.8
    });
    
    var viewMode = Ti.UI.createButtonBar({
        labels:['Close', 'Search', 'Share', 'Bookmark', 'Outline'],
        backgroundColor:"#222",
        style:Ti.UI.iPhone.SystemButtonStyle.BAR
    });
    customToolbarView.add(viewMode);
    
    viewMode.addEventListener("click", function(e){
        switch(e.index){
            case 0:
                //close the window
                pushedWindow.close();
                break;
            case 1:
                //show the search 
                pdfView.showSearchView(viewMode);
                break;
            case 2:
                // show the activity view for sharing
                pdfView.showActivityView(viewMode);
                break;
            case 3:
                //bookmark the current page
                pdfView.bookmarkPage();
                alert("Page has been bookmarked!");
                break;      
            case 4:
                //show the outline
                pdfView.showOutlineView(viewMode);
                break;  
        }
    });

    // create PSPDFKit view
    var pdfView = pspdfkit.createView({
        filename : 'PSPDFKit.pdf',
        options : {
            pageMode : 0,
            toolbarEnabled : false,
            useParentNavigationBar : false,
        }
    });
    
    pdfView.addEventListener('willShowHUD', function(dict) {
        customToolbarView.animate({opacity:0.8, duration:350});
    });
    
    pdfView.addEventListener('willHideHUD', function(dict) {
        customToolbarView.animate({opacity:0, duration:350});
    });
    
    //add your custom toolbar to the pdfView
    pdfView.add(customToolbarView);
    pushedWindow.add(pdfView);
    pushedWindow.open();
});

// example interval to always show current page in log
setInterval(function() {
    Ti.API.log('current page: ' + pdfView.page + ' total pages: ' + pdfView.totalPages);
}, 5000);

window.add(modalButton);
window.add(button2);
window.add(button3);
window.add(button4);

// example how to download a PDF.
var webDownloadTestButton = Ti.UI.createButton({
    title : 'Download PDF',
    style : Titanium.UI.iPhone.SystemButtonStyle.BAR,
});
window.setRightNavButton(webDownloadTestButton);

var fileName = "testdownload.pdf";
webDownloadTestButton.addEventListener('click', function(e) {
    var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
    if (!f.exists()) {
        var xhr = Titanium.Network.createHTTPClient({
            onload : function() {
                Ti.API.info('PDF downloaded to appDataDirectory/' + fileName);
                Ti.App.fireEvent('test_pdf_downloaded', {
                    filePath : f.nativePath
                });
            },
            timeout : 15000
        });
        xhr.open('GET', 'http://www.enough.de/fileadmin/uploads/dev_guide_pdfs/Guide_11thEdition_WEB-1.pdf');
        xhr.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, fileName);
        xhr.send();
    } else {
        Ti.App.fireEvent('test_pdf_downloaded', {
            filePath : f.nativePath
        });
    }
});

Ti.App.addEventListener('test_pdf_downloaded', function(e) {
    pspdfkit.showPDFAnimated(e.filePath);
});

navigationWindow.open();
