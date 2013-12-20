//
//  PSPDFUtils.h
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2014 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

@class PSPDFDocument;

// Helper class for argument parsing.
@interface PSPDFUtils : NSObject

// Returns a integer from an argument array
+ (NSInteger)intValue:(id)args;

// Returns a integer from an argument array, on a specific position. Position starts at 0. Returns NSNotFound if invalid.
+ (NSInteger)intValue:(id)args onPosition:(NSUInteger)position;

// Uses KVO to set an option on an object.
+ (void)applyOptions:(NSDictionary *)options onObject:(id)object;

// Accept both NSString and NSArray
+ (NSArray *)resolvePaths:(id)filePaths;

// Returns PSPDFDocument's if the file could be resolved and exists.
+ (NSArray *)documentsFromArgs:(id)args;

// Returns color from the first argument.
+ (UIColor *)colorFromArg:(id)arg;

@end
