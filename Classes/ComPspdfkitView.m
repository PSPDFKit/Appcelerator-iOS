//
//  ComPspdfkitView.m
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2018 PSPDFKit GmbH. All rights reserved.
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
        NSMutableArray<PSPDFCoordinatedFileDataProvider *> *dataProviders = [NSMutableArray array];
        for (NSString *pdfPath in pdfPaths) {
            NSURL *pdfURL = [NSURL fileURLWithPath:pdfPath isDirectory:NO];
            if ([pdfURL.pathExtension.lowercaseString isEqualToString:@"pdf"]) {
                PSPDFCoordinatedFileDataProvider *coordinatedFileDataProvider = [[PSPDFCoordinatedFileDataProvider alloc] initWithFileURL:pdfURL];
                if (coordinatedFileDataProvider) {
                    [dataProviders addObject:coordinatedFileDataProvider];
                }
            }
        }

        PSPDFDocument *pdfDocument = [[PSPDFDocument alloc] initWithDataProviders:dataProviders];
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
                UIColor *barColor = [[TiColor colorNamed:options[@"barColor"]] _color];
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

- (UIViewController *)closestViewControllerOfView:(UIView *)view {
    UIResponder *responder = view;
    while ((responder = [responder nextResponder])) {
        if ([responder isKindOfClass:UIViewController.class]) {
            break;
        }
    }
    return (UIViewController *)responder;
}

/// This is a band-aid for Titanium not setting up the view controller hierarchy
/// correctly. If a view controller is detached, we will run into various issues
/// with view controller management and presentation. This can be removed once
/// https://github.com/appcelerator/titanium_mobile/issues/11651 is fixed.
- (void)fixContainmentAmongAncestorsOfViewController:(UIViewController *)viewController {
    // Make sure that the root view controller is owned by Titanium.
    Class rootViewControllerClass = NSClassFromString(@"TiRootViewController");
    UIViewController *rootViewController = [[[UIApplication sharedApplication] keyWindow] rootViewController];
    if (rootViewControllerClass == Nil || rootViewController == nil || ![rootViewController isKindOfClass:rootViewControllerClass]) {
        return;
    }
    // Find the detached view controller.
    UIViewController *detachedViewController = viewController;
    while (detachedViewController.parentViewController != nil) {
        detachedViewController = detachedViewController.parentViewController;
    }
    // Root view controller is allowed to be detached. If we reach this, it means
    // that the view controller hierarchy is good or that we fixed it already.
    if (detachedViewController == rootViewController) {
        return;
    }
    // Find the closest parent view controller of the detached view controler.
    // This needs to be called on detached view controller's superview, as _it_
    // is the closest view controller of its own view.
    UIViewController *closestParentViewController = [self closestViewControllerOfView:detachedViewController.view.superview];
    if (closestParentViewController == nil) {
        return;
    }
    // Fix the containment by properly attaching the detached view controller.
    NSLog(@"Fixing view controller containment by adding %@ as a child of %@.", detachedViewController, rootViewController);
    [detachedViewController willMoveToParentViewController:closestParentViewController];
    [closestParentViewController addChildViewController:detachedViewController];
    // Run this again until we reach root view controller.
    [self fixContainmentAmongAncestorsOfViewController:closestParentViewController];
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
    UIViewController *controller = [self closestViewControllerOfView:self];
    if (controller) {
        if (self.window) {
            [controller addChildViewController:self.navController];
            [self.navController didMoveToParentViewController:controller];
            [self fixContainmentAmongAncestorsOfViewController:controller];
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
