//
//  TIPSPDFViewControllerProxy.h
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2015 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "TiProxy.h"
#import "TiModule.h"

@class TIPSPDFViewController, ComPspdfkitModule, ComPspdfkitViewProxy;

/// Appcelerator Proxy for PSPDFViewController. Exposes a subset.
@interface TIPSPDFViewControllerProxy : TiProxy <TiProxyDelegate, PSPDFViewControllerDelegate>

@property (atomic, weak) TIPSPDFViewController *controller; // we're keeping a reverse relation with associated object

@property (atomic, weak) ComPspdfkitViewProxy *viewProxy;

// proxy is initialized and keeps the view controller around
- (id)initWithPDFController:(TIPSPDFViewController *)pdfController context:(id<TiEvaluator>)context parentProxy:(TiProxy *)parentProxy;

/// Returns the documentPath.
- (id)documentPath;

/// scroll to a specific page. Argument 1 = integer, argument 2 = animated. (optional, defaults to YES)
- (void)scrollToPage:(id)args;

/// change view mode argument 1 = integer, argument 2 = animated. (optional, defaults to YES)
- (void)setViewMode:(id)args;

/// change view mode argument 1 = integer, argument 2 = animated. (optional, defaults to YES)
- (void)setViewMode:(id)args;

/// Opens the PSPDFSearchViewController with the searchString.
- (void)searchForString:(id)args;

/// Current page.
- (id)page;

/// Returns total pages count.
- (id)totalPages;

/// close controller. (argument 1 = animated)
- (void)close:(id)args;

/// Register a callback for the didTapOnAnnotation event. Return true if you manually use the annotation, else false.
- (void)setDidTapOnAnnotationCallback:(KrollCallback *)callback;

/// Opens the PSPDFOutlineViewController
- (void)showOutlineView:(id)arg;

/// Opens the PSPDFSearchViewController
- (void)showSearchView:(id)arg;

/// Opens the PSPDFBrightnessViewController
- (void)showBrightnessView:(id)arg;

/// Opens the UIPrintInteractionController 
- (void)showPrintView:(id)arg;

/// Opens the MFMailComposeViewController
- (void)showEmailView:(id)arg;

/// Opens the PSPDFAnnotationToolbar
- (void)showAnnotationView:(id)arg;

/// Opens the UIDocumentInteractionController
- (void)showOpenInView:(id)arg;

/// Opens the UIActivityViewController
- (void)showActivityView:(id)arg;

/// Bookmark the current page
- (void)bookmarkPage:(id)arg;

/// Exposes a helper to change link annotation color. Set to change.
- (void)setLinkAnnotationBorderColor:(id)arg;

/// Exposes a helper to change link annotation highlight color. Set to change.
- (void)setLinkAnnotationHighlightColor:(id)arg;

/// Set list of editable annotation types.
- (void)setEditableAnnotationTypes:(id)arg;

/// Exposes helper to set `thumbnailController.filterOptions`.
- (void)setThumbnailFilterOptions:(id)arg;

/// Exposes helper to set `outlineBarButtonItem.availableControllerOptions`
- (void)setOutlineControllerFilterOptions:(id)arg;

/// Exposes `printOptions` in `PSPDFPrintBarButtonItem`.
- (void)setPrintOptions:(id)arg;

/// Exposes `sendOptions` in `PSPDFEmailBarButtonItem`.
- (void)setSendOptions:(id)arg;

/// Exposes `openOptions` in `PSPDFOpenInBarButtonItem`.
- (void)setOpenInOptions:(id)arg;

/// Document's menu actions.
- (void)setAllowedMenuActions:(id)arg;

/// Expose the scrollingEnabled property
- (void)setScrollingEnabled:(id)args;

// Save changed annotations.
- (void)saveAnnotations:(id)args;

// PSPDFDocument's annotationSaveMode property.
- (void)setAnnotationSaveMode:(id)arg;

// Hide any visible popover. arg: animated YES/NO
- (void)hidePopover:(id)args;

@end
