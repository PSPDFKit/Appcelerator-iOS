//
//  Copyright (c) 2011-2021 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import <PSPDFKitUI/PSPDFKitUI.h>
#import <TitaniumKit/TitaniumKit.h>

// uncomment to enable logging
//#define PSTiLog(fmt, ...) NSLog((@"%s [Line %d] " fmt), __PRETTY_FUNCTION__, __LINE__, ##__VA_ARGS__);
#define PSTiLog(fmt, ...)

@class TIPSPDFViewControllerProxy;

/// Subclass of `PSPDFViewController` that enables sending events to Appcelerator.
@interface TIPSPDFViewController : PSPDFViewController

/// Close controller, optionally animated.
- (void)closeControllerAnimated:(BOOL)animated;

@property (nonatomic) TIPSPDFViewControllerProxy *proxy;

@end
