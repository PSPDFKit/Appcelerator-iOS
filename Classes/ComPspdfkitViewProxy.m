//
//  ComPspdfkitViewProxy.m
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2015 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "ComPspdfkitViewProxy.h"
#import "ComPspdfkitView.h"
#import "TIPSPDFViewController.h"
#import "TIPSPDFViewControllerProxy.h"

// ARCified helper
#define PSPDF_ENSURE_UI_THREAD_0_ARGS \
do { \
_Pragma("clang diagnostic push") \
_Pragma("clang diagnostic ignored \"-Warc-performSelector-leaks\"") \
ENSURE_UI_THREAD_0_ARGS \
_Pragma("clang diagnostic pop") \
} while (0);

@interface ComPspdfkitViewProxy ()
@property (nonatomic) TIPSPDFViewControllerProxy *controllerProxy;
@end

@implementation ComPspdfkitViewProxy

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Lifecycle

- (void)dealloc {
    PSTiLog(@"dealloc: %@", self)
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private

- (ComPspdfkitView *)pdfView {
    return (ComPspdfkitView *)self.view;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - TiViewProxy

- (void)viewDidAttach {
    PSPDF_ENSURE_UI_THREAD_0_ARGS
    PSTiLog(@"viewDidAttach: %@ %@", [self pdfView], [[self pdfView] controllerProxy]);
    
    self.controllerProxy = [[self pdfView] controllerProxy];
    self.controllerProxy.viewProxy = self; // register viewProxy
}

- (void)viewDidDetach {
    PSPDF_ENSURE_UI_THREAD_0_ARGS
    PSTiLog(@"viewDidDetach");

    // don't access pdfView - is already nil here!
    self.controllerProxy.viewProxy = nil; // deregister viewProxy
    self.controllerProxy = nil;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Proxy Relay

- (id)page {
    PSTiLog(@"page, thread: %@ (isMain:%d)", [NSThread currentThread], [NSThread isMainThread]);

    __block NSUInteger page = 0;
    if (![NSThread isMainThread]) {
        dispatch_sync(dispatch_get_main_queue(), ^{
            page = [[self page] unsignedIntegerValue];
        });
    }else {
        page = [[[[self pdfView] controllerProxy] page] unsignedIntegerValue];
    }

    return @(page);
}

- (id)totalPages {
    PSTiLog(@"totalPages, thread: %@ (isMain:%d)", [NSThread currentThread], [NSThread isMainThread]);

    __block NSUInteger totalPages = 0;
    if (![NSThread isMainThread]) {
        dispatch_sync(dispatch_get_main_queue(), ^{
            totalPages = [[self totalPages] unsignedIntegerValue];
        });
    }else {
        totalPages = [[[[self pdfView] controllerProxy] totalPages] unsignedIntegerValue];
    }

    return @(totalPages);
}

- (void)scrollToPage:(id)args {
    ENSURE_UI_THREAD(scrollToPage, args);
    [[[self pdfView] controllerProxy] scrollToPage:args];
}

- (void)setViewMode:(id)args {
    ENSURE_UI_THREAD(setViewMode, args);
    [[[self pdfView] controllerProxy] setViewMode:args];
}

- (void)searchForString:(id)args {
    ENSURE_UI_THREAD(searchForString, args);
    [[[self pdfView] controllerProxy] searchForString:args];
}

- (void)close:(id)args {
    ENSURE_UI_THREAD(close, args);
    [[[self pdfView] controllerProxy] close:args];
}

- (void)setDidTapOnAnnotationCallback:(id)args {
    ENSURE_UI_THREAD(setDidTapOnAnnotationCallback, args);
    [[[self pdfView] controllerProxy] setDidTapOnAnnotationCallback:args];
}

- (void)setLinkAnnotationBorderColor:(id)arg {
    ENSURE_UI_THREAD(setLinkAnnotationBorderColor, arg);
    [[[self pdfView] controllerProxy] setLinkAnnotationBorderColor:arg];
}

- (void)setLinkAnnotationHighlightColor:(id)arg {
    ENSURE_UI_THREAD(setLinkAnnotationHighlightColor, arg);
    [[[self pdfView] controllerProxy] setLinkAnnotationHighlightColor:arg];
}

- (void)setThumbnailFilterOptions:(id)arg {
    ENSURE_UI_THREAD(setThumbnailFilterOptions, arg);
    [[[self pdfView] controllerProxy] setThumbnailFilterOptions:arg];
}

- (void)setOutlineControllerFilterOptions:(id)arg {
    ENSURE_UI_THREAD(setOutlineControllerFilterOptions, arg);
    [[[self pdfView] controllerProxy] setOutlineControllerFilterOptions:arg];
}

- (void)setAllowedMenuActions:(id)arg {
    ENSURE_UI_THREAD(setAllowedMenuActions, arg);
    [[[self pdfView] controllerProxy] setAllowedMenuActions:arg];
}

- (void)setEditableAnnotationTypes:(id)arg {
    ENSURE_UI_THREAD(setEditableAnnotationTypes, arg);
    [[[self pdfView] controllerProxy] setEditableAnnotationTypes:arg];
}

- (void)setScrollingEnabled:(id)arg {
    ENSURE_UI_THREAD(setScrollingEnabled, arg);
    [[[self pdfView] controllerProxy] setScrollingEnabled:arg];
}

- (void)setPrintOptions:(id)arg {
    ENSURE_UI_THREAD(setPrintOptions, arg);
    [[[self pdfView] controllerProxy] setPrintOptions:arg];
}

- (void)setSendOptions:(id)arg {
    ENSURE_UI_THREAD(setSendOptions, arg);
    [[[self pdfView] controllerProxy] setSendOptions:arg];
}

- (void)setOpenInOptions:(id)arg {
    ENSURE_UI_THREAD(setOpenInOptions, arg);
    [[[self pdfView] controllerProxy] setOpenInOptions:arg];
}

- (id)documentPath {
    __block NSString *documentPath;
    if (![NSThread isMainThread]) {
        dispatch_sync(dispatch_get_main_queue(), ^{
            documentPath = [[self documentPath] copy];
        });
    }else {
        documentPath = [[[self pdfView] controllerProxy] documentPath];
    }
    return documentPath;
}

- (void)saveAnnotations:(id)args {
    ENSURE_UI_THREAD(saveAnnotations, args);
    [[[self pdfView] controllerProxy] saveAnnotations:args];
}

- (void)setAnnotationSaveMode:(id)args {
    ENSURE_UI_THREAD(setAnnotationSaveMode, args);
    [[[self pdfView] controllerProxy] setAnnotationSaveMode:args];
}

- (void)hidePopover:(id)args {
    ENSURE_UI_THREAD(hidePopover, args);
    [[[self pdfView] controllerProxy] hidePopover:args];
}

- (void)showOutlineView:(id)arg {
    ENSURE_UI_THREAD(showOutlineView, arg);
    [[[self pdfView] controllerProxy] showOutlineView:arg];
}

- (void)showSearchView:(id)arg {
    ENSURE_UI_THREAD(showSearchView, arg);
    [[[self pdfView] controllerProxy] showSearchView:arg];
}

- (void)showBrightnessView:(id)arg {
    ENSURE_UI_THREAD(showBrightnessView, arg);
    [[[self pdfView] controllerProxy] showBrightnessView:arg];
}

- (void)showPrintView:(id)arg {
    ENSURE_UI_THREAD(showPrintView, arg);
    [[[self pdfView] controllerProxy] showPrintView:arg];
}

- (void)showEmailView:(id)arg {
    ENSURE_UI_THREAD(showEmailView, arg);
    [[[self pdfView] controllerProxy] showEmailView:arg];
}

- (void)showAnnotationView:(id)arg {
    ENSURE_UI_THREAD(showAnnotationView, arg);
    [[[self pdfView] controllerProxy] showAnnotationView:arg];
}

- (void)showOpenInView:(id)arg {
    ENSURE_UI_THREAD(showOpenInView, arg);
    [[[self pdfView] controllerProxy] showOpenInView:arg];
}

- (void)showActivityView:(id)arg {
    ENSURE_UI_THREAD(showActivityView, arg);
    [[[self pdfView] controllerProxy] showActivityView:arg];
}

- (void)bookmarkPage:(id)arg {
    ENSURE_UI_THREAD(bookmarkPage, arg);
    [[[self pdfView] controllerProxy] bookmarkPage:arg];
}

@end

@implementation ComPspdfkitSourceViewProxy
@end
