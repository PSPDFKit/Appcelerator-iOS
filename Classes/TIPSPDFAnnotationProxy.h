//
//  TIPSPDFAnnotationProxy.h
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

@interface TIPSPDFAnnotationProxy : TiProxy 

/// Initializes annotation proxy.
- (instancetype)initWithAnnotation:(PSPDFAnnotation *)annotation;

/// Link if target is a website.
@property (nonatomic, readonly) NSString *siteLinkTarget;

@end
