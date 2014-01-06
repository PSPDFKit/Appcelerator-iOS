//
//  TIPSPDFAnnotationProxy.h
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2014 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "TiProxy.h"

@interface TIPSPDFAnnotationProxy : TiProxy 

// Initializes annotation proxy.
- (id)initWithAnnotation:(PSPDFAnnotation *)annotation;

// Link if target is a website.
@property(nonatomic, retain, readonly) NSString *siteLinkTarget;

@end
