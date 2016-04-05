//
//  ComPspdfkitView.m
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2015 PSPDFKit GmbH. All rights reserved.
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

@interface ComPspdfkitView ()
@property (nonatomic) UIViewController *navController; // UINavigationController or PSPDFViewController
@end

@implementation ComPspdfkitView

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private

- (void)createControllerProxy {
    PSTiLog(@"createControllerProxy");
    
    if (!_controllerProxy) { // self triggers creation
        NSArray *pdfPaths = [PSPDFUtils resolvePaths:[self.proxy valueForKey:@"filename"]];
        PSPDFDocument *pdfDocument = [[PSPDFDocument alloc] initWithBaseURL:nil files:pdfPaths];
        TIPSPDFViewController *pdfController = [[TIPSPDFViewController alloc] initWithDocument:pdfDocument];

        NSDictionary *options = [self.proxy valueForKey:@"options"];
        [PSPDFUtils applyOptions:options onObject:pdfController];
        [PSPDFUtils applyOptions:[self.proxy valueForKey:@"documentOptions"] onObject:pdfDocument];

        // default-hide close button
        if (![self.proxy valueForKey:@"options"][PROPERTY(leftBarButtonItems)]) {
            pdfController.navigationItem.leftBarButtonItems = @[];
        }
        
        const BOOL navBarHidden = [[self.proxy valueForKey:@"options"][PROPERTY(navBarHidden)] boolValue];

        // Encapsulate controller into proxy.
        self.controllerProxy = [[TIPSPDFViewControllerProxy alloc] initWithPDFController:pdfController context:self.proxy.pageContext parentProxy:self.proxy];

        if (!pdfController.configuration.useParentNavigationBar && !navBarHidden) {
            UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];

            // Support for tinting the navigation controller/bar
            if (options[@"barColor"]) {
                UIColor *barColor = [[TiColor colorNamed:options[@"barColor"]] color];
                if (barColor) {
                    navController.navigationBar.tintColor = barColor;
                }
            }

            self.navController = navController;
        }else {
            self.navController = pdfController;
        }
    }
}

- (UIViewController *)pspdf_closestViewController {
    UIResponder *responder = self;
    while ((responder = [responder nextResponder])) {
        if ([responder isKindOfClass:UIViewController.class]) break;
    }
    return (UIViewController *)responder;
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
    [self destroyViewControllerRelationship];
}

- (void)didMoveToWindow {
    [super didMoveToWindow];
    
    UIViewController *controller = [self pspdf_closestViewController];
    if (controller) {
        if (self.window) {
            [controller addChildViewController:self.navController];
            [self.navController didMoveToParentViewController:controller];
        } else {
            [self destroyViewControllerRelationship];
        }
    }
}

- (void)destroyViewControllerRelationship {
    if (self.navController.parentViewController) {
        [self.navController willMoveToParentViewController:nil];
        [self.navController removeFromParentViewController];
    }
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
    }else {
        // force controller reloading to adapt to new position
        [TiUtils setView:_navController.view positionRect:bounds];
        [self.controllerProxy.controller reloadData];
    }    
}

@end

@implementation ComPspdfkitSourceView
@end