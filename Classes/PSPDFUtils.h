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

// Compiler-checked selectors and performance optimized at runtime.
#if DEBUG
#define PROPERTY(property) NSStringFromSelector(@selector(property))
#else
#define PROPERTY(property) @#property
#endif

// Helper class for argument parsing.
@interface PSPDFUtils : NSObject

// Returns a integer from an argument array.
+ (NSInteger)intValue:(id)args;

// Returns a integer from an argument array, on a specific position. Position starts at 0. Returns `NSNotFound` if invalid.
+ (NSInteger)intValue:(id)args onPosition:(NSUInteger)position;

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
id PSSafeCast(id object, Class targetClass);
void ps_dispatch_main_sync(dispatch_block_t block);
void ps_dispatch_main_async(dispatch_block_t block);
extern NSString *PSFixIncorrectPath(NSString *path);
UIView *PSViewInsideViewWithPrefix(UIView *view, NSString *classNamePrefix);


// Private extensions inside PSPDFKit.
@interface NSObject (PSPDFKitAdditions)

// Register block to be called when `self` is deallocated.
// If `owner` is not nil, block will be removed.
- (NSString *)pspdf_addDeallocBlock:(dispatch_block_t)block owner:(id)owner;

@end
