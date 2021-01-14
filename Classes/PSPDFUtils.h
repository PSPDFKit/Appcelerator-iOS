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

@class PSPDFDocument;

FOUNDATION_EXTERN void (^pst_targetActionBlock(id target, SEL action))(id);

// Helper class for argument parsing.
@interface PSPDFUtils : NSObject

// Returns an integer from an argument array.
+ (NSInteger)intValue:(id)args;

// Returns an integer from an argument array, on a specific position. Position starts at 0. Returns `NSNotFound` if invalid.
+ (NSInteger)intValue:(id)args onPosition:(NSUInteger)position;

// Returns a float from an argument array.
+ (CGFloat)floatValue:(id)args;

// Returns a float from an argument array, on a specific position. Position starts at 0. Returns `NSNotFound` if invalid.
+ (CGFloat)floatValue:(id)args onPosition:(NSUInteger)position;

// Uses KVO to set an option on an object.
+ (void)applyOptions:(NSDictionary *)options onObject:(id)object;

// Accept both NSString and NSArray.
+ (NSArray *)resolvePaths:(id)filePaths;

// Returns `PSPDFDocument's` if the file could be resolved and exists.
+ (NSArray *)documentsFromArgs:(id)args;

// Returns color from the first argument.
+ (UIColor *)colorFromArg:(id)arg;

@end

// Helper
FOUNDATION_EXTERN id PSSafeCast(id object, Class targetClass);
FOUNDATION_EXTERN void ps_dispatch_main_sync(dispatch_block_t block);
FOUNDATION_EXTERN void ps_dispatch_main_async(dispatch_block_t block);
FOUNDATION_EXTERN NSString *PSFixIncorrectPath(NSString *path);
FOUNDATION_EXTERN UIView *PSViewInsideViewWithPrefix(UIView *view, NSString *classNamePrefix);


// Private extensions inside PSPDFKit.
@interface NSObject (PSPDFKitAdditions)

// Register block to be called when `self` is deallocated.
// If `owner` is not nil, block will be removed.
- (NSString *)pspdf_addDeallocBlock:(dispatch_block_t)block owner:(id)owner;

@end
