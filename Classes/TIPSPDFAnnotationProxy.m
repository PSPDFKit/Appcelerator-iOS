//
//  TIPSPDFAnnotationProxy.m
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2015 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "TIPSPDFAnnotationProxy.h"

@interface TIPSPDFAnnotationProxy()
@property (nonatomic) PSPDFAnnotation *annotation;
@end

@implementation TIPSPDFAnnotationProxy

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - NSObject

- (id)initWithAnnotation:(PSPDFAnnotation *)annotation {
    if ((self = [super init])) {
        _annotation = annotation;
    }
    return self;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Public

- (NSString *)siteLinkTarget {
    if ([self.annotation isKindOfClass:[PSPDFLinkAnnotation class]]) {
        return ((PSPDFLinkAnnotation *)self.annotation).URL.absoluteString;
    }else {
        return nil;
    }
}

@end
