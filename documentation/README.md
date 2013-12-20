PSPDFKit Appcelerator Titanium Module
=====================================

** PSPDFKit needs Xcode 4.6 to compile and works with iOS 5.0 upwards. ***


REGISTER YOUR MODULE
---------------------

Register your module with your application by editing `tiapp.xml` and adding your module.
Example:

	<modules>
		<module>com.pspdfkit.source</module>
	</modules>

To set the minimum iOS version, edit tiapp.xml and add:

    <ios>
        <min-ios-ver>5.0</min-ios-ver>
    </ios>

When you run your project, the compiler will know automatically compile in your module
dependencies and copy appropriate image assets into the application.


USING YOUR MODULE IN CODE
-------------------------

To use your module in code, you will need to require it.
If you have purchased the source-version, use com.pspdfkit.source, else just com.pspdfkit

For example,

	var pspdfkit = require('com.pspdfkit');


# API REFERENCE
-------------------

The following is an list of available methods exposed to the Titanium javascript interface. You need to create an instance of the PSPDFKit, by either using the showPDFAnimated or createView.  


### showPDFAnimated

Opens an instance of the PSPDFKit in a modal window. See see http://pspdfkit.com/documentation/Classes/PSPDFViewController.html for more information on which arguments are available.  

	var pdfController = pspdfkit.showPDFAnimated('PSPDFKit.pdf');

### createView

creates a TiUIView that contains the PSPDFKit instance. See see http://pspdfkit.com/documentation/Classes/PSPDFViewController.html for more information on which arguments are available.  

	var pdfController = pspdfkit.createView({
		filename : 'PSPDFKit.pdf',
    	options : {
        	pageMode : 0,
        	toolbarEnabled : true,
    	}
	});


## Properties
-------------------

### documentPath

Returns the documentPath.  

	pdfController.documentPath;


### page

Current page.  

	pdfController.page;

### totalPages

Returns total pages count.  

	pdfController.totalPages;

### currentInterfaceOrientation

Returns the current interface orientation.  

	pdfController.currentInterfaceOrientation;

### lockedInterfaceOrientation

Returns the locked interface orientation.  

	pdfController.lockedInterfaceOrientation;


## Property setters

### setViewMode

Change view mode argument 1 = integer, argument 2 = animated. (optional, defaults to true)    

	pdfController.setViewMode(1, false);
	
### setLinkAnnotationBorderColor

Exposes a helper to change link annotation color. Set to change.  

	pdfController.setLinkAnnotationBorderColor("#33FF0000");

### setLinkAnnotationHighlightColor

Exposes a helper to change link annotation highlight color. Set to change.  

	pdfController.setLinkAnnotationHighlightColor("#99FF0000");

### setEditableAnnotationTypes

Set list of editable annotation types.  

	pdfController.setEditableAnnotationTypes(args);

### setThumbnailFilterOptions

Exposes helper to set thumbnailController.filterOptions.  

	pdfController.setThumbnailFilterOptions(["All", "Bookmarks"]);

### setOutlineControllerFilterOptions

Exposes helper to set outlineBarButtonItem.availableControllerOptions  

	pdfController.setOutlineControllerFilterOptions(["Outline"]);

### setAllowedMenuActions

Document's menu actions.  

	pdfController.setAllowedMenuActions(args);

### setScrollingEnabled

Expose the scrollingEnabled property  

	pdfController.setScrollingEnabled(true);

### setLockedInterfaceOrientation

UIDeviceOrientationPortrait = 1  
UIDeviceOrientationPortraitUpsideDown = 2  
UIDeviceOrientationLandscapeLeft = 3  
UIDeviceOrientationLandscapeRight = 4  
-1 will reset the lock.    

	pdfController.setLockedInterfaceOrientation(2);

### setAnnotationSaveMode

PSPDFDocument's annotationSaveMode property.  
PSPDFAnnotationSaveModeDisabled = 0  
PSPDFAnnotationSaveModeExternalFile = 1,   
PSPDFAnnotationSaveModeEmbedded = 2,  
PSPDFAnnotationSaveModeEmbeddedWithExternalFileAsFallback = 3 // Default.  

	pdfController.setAnnotationSaveMode(2);
	

## Methods
-------------------

### close

Close the pdf controller. (argument 1 = animated)  

	pdfController.close(true);

### hidePopover

Hide any visible popover. arg: animated true/false.

	pdfController.hidePopover(true);

### scrollToPage

Scroll to a specific page. Argument 1 = page number, argument 2 = animated. (optional, defaults to true)  

	pdfController.scrollToPage(2, true);


### searchForString

Opens the PSPDFSearchViewController with the searchString. Argument 1 = integer, argument 2 = animated. (optional, defaults to YES)  

	pdfController.searchForString("hello", true);

### bookmarkPage

Bookmark the current page.   

	pdfController.bookmarkPage(); 


### saveAnnotations

Save changed annotations.

	pdfController.saveAnnotations();

### showOutlineView

Opens the PSPDFOutlineViewController. Argument 1 = view/button action sender    

	pdfController.showOutlineView(myBtn);

### showSearchView

Opens the PSPDFSearchViewController. Argument 1 = view/button action sender    

	pdfController.showSearchView(myBtn);

### showBrightnessView

Opens the PSPDFBrightnessViewController. Argument 1 = view/button action sender    

	pdfController.showBrightnessView(myBtn);

### showPrintView

Opens the UIPrintInteractionController. Argument 1 = view/button action sender     

	pdfController.showPrintView(myBtn);

### showEmailView

Opens the MFMailComposeViewController. Argument 1 = view/button action sender    

	pdfController.showEmailView(myBtn);

### showAnnotationView

Opens the PSPDFAnnotationToolbar. Argument 1 = view/button action sender    

	pdfController.showAnnotationView(myBtn);

### showOpenInView

Opens the UIDocumentInteractionController. Argument 1 = view/button action sender    

	pdfController.showOpenInView(myBtn);

### showActivityView

Opens the UIActivityViewController. Argument 1 = view/button action sender    

	pdfController.showActivityView(myBtn);



##  Events
-------------------


### didShowPage

Example how to register for the didShowPage event

	pdfController.addEventListener("didShowPage", function(e) {
    	Ti.API.log('didShowPage: ' + e.page);
	});

### willCloseController

Event that listens when a viewController will be closed
    
    pdfController.addEventListener('willCloseController', function(e) {
        Ti.API.log('(modal) willCloseController... we\'re on the edge of being killed.');
    });

### didCloseController 
    
Add event after view controller has been closed

    pdfController.addEventListener('didCloseController', function(e) {
        alert("PSPDFKit ViewController closed.");
    });

### didTapOnAnnotation

Add event listener for annotations.

    pdfController.addEventListener('didTapOnAnnotation', function(dict) {
        Ti.API.log("didTapOnAnnotation " + dict.siteLinkTarget);
    });

### willShowHUD

HUD will be displayed.

    pdfController.addEventListener('willShowHUD', function(dict) {
        // show your custom HUD
    });

### willHideHUD

HUD will be hidden.

    pdfController.addEventListener('willHideHUD', function(dict) {
        // hide your custom HUD
    });


## Events callbacks
-------------------

### setDidTapOnAnnotationCallback

Register a callback for the didTapOnAnnotation event. Return true if you manually use the annotation, else false.  

	pdfController.setDidTapOnAnnotationCallback(function(dict) {
        Ti.API.log(dict);
        return false; // let PSPDFKit handle it
    });
