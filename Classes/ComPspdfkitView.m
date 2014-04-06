//
//  ComPspdfkitView.m
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2014 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "ComPspdfkitView.h"
#import "TIPSPDFViewController.h"
#import "PSPDFUtils.h"
#import <libkern/OSAtomic.h>

@interface ComPspdfkitView() {
    UIViewController *_navController; // UINavigationController or PSPDFViewController
}
@end

@implementation ComPspdfkitView

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private

- (void)createControllerProxy {
    PSTiLog(@"createControllerProxy");
    if (!_controllerProxy) {
        NSArray *pdfPaths = [PSPDFUtils resolvePaths:[self.proxy valueForKey:@"filename"]];
        PSPDFDocument *pdfDocument = [[PSPDFDocument alloc] initWithBaseURL:nil files:pdfPaths];
        TIPSPDFViewController *pdfController = [[TIPSPDFViewController alloc] initWithDocument:pdfDocument];
        
        // Don't change status bar by default.
        pdfController.statusBarStyleSetting = PSPDFStatusBarStyleInherit;
        
        [PSPDFUtils applyOptions:[self.proxy valueForKey:@"options"] onObject:pdfController];
        [PSPDFUtils applyOptions:[self.proxy valueForKey:@"documentOptions"] onObject:pdfDocument];

        // default-hide close button
        if (![self.proxy valueForKey:@"options"][PROPERTY(leftBarButtonItems)]) {
            pdfController.leftBarButtonItems = @[];
        }

        // Encapsulate controller into proxy.
        _controllerProxy = [[TIPSPDFViewControllerProxy alloc] initWithPDFController:pdfController context:self.proxy.pageContext parentProxy:self.proxy];

        if (!pdfController.useParentNavigationBar) {
            UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];
            navController.navigationBarHidden = !pdfController.toolbarEnabled;
            _navController = navController;
        }else {
            _navController = pdfController;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - NSObject

- (id)init {
    if ((self = [super init])) {
        PSTiLog(@"ComPspdfkitView init");
    }
    return self;
}

- (void)dealloc {
    PSTiLog(@"ComPspdfkitView dealloc");
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - TiView

- (TIPSPDFViewControllerProxy *)controllerProxy {
    PSTiLog(@"accessing controllerProxy");
    
    if (!_controllerProxy) {
        if (!NSThread.isMainThread) {
            dispatch_sync(dispatch_get_main_queue(), ^{
                [self createControllerProxy];
            });
        }else {
            [self createControllerProxy];
        }
    }
    
    return _controllerProxy;
}

- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds {
    PSTiLog(@"frameSizeChanged:%@ bounds:%@", NSStringFromCGRect(frame), NSStringFromCGRect(bounds));
    
    // be sure our view is attached
    if (!self.controllerProxy.controller.view.window) {
        // creates controller lazy

        [self addSubview:_navController.view];
        [TiUtils setView:_navController.view positionRect:bounds];

        // Wait a runloop until we're properly connected with the navigationController
        // This is mainly important to fix a bug where pushing the controller initially doesn't show the bar button items because we try to set them too early.
        dispatch_async(dispatch_get_main_queue(), ^{
            [_navController viewWillAppear:NO];
            [_navController viewDidAppear:NO];
        });
    }else {
        // force controller reloading to adapt to new position
        [TiUtils setView:_navController.view positionRect:bounds];
        [self.controllerProxy.controller reloadData];
    }    
}

@end

@implementation ComPspdfkitSourceView
@end