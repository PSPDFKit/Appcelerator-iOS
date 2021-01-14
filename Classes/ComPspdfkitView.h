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

@class TIPSPDFViewControllerProxy;

@interface ComPspdfkitView : TiUIView
@property (nonatomic) TIPSPDFViewControllerProxy *controllerProxy;
@end

@interface ComPspdfkitSourceView : ComPspdfkitView
@end
