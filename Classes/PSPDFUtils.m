//
//  PSPDFUtils.m
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2014 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

#import "PSPDFKit.h"
#import "PSPDFUtils.h"
#import "TiUtils.h"
#import "PSPDFKitGlobal+Private.h"
#import "NSObject+PSPDFKitAdditions.h"

@implementation PSPDFUtils

+ (NSInteger)intValue:(id)args {
    return [self intValue:args onPosition:0];
}

+ (NSInteger)intValue:(id)args onPosition:(NSUInteger)position {
    NSInteger intValue = NSNotFound;

    if (position == 0 && [args isKindOfClass:NSNumber.class]) {
        intValue = [args intValue];
    }else if([args isKindOfClass:NSArray.class] && [args count] > position) {
        intValue = [args[position] intValue];
    }

    return intValue;
}

+ (UIColor *)colorFromArg:(id)arg {
    if ([arg isKindOfClass:NSArray.class] && [[arg firstObject] isEqual:@"clear"]) {
        return [UIColor clearColor];
    }else {
        return [[TiUtils colorValue:arg] color];
    }
}

// use KVO to apply options
+ (void)applyOptions:(NSDictionary *)options onObject:(id)object {
    if (!options || !object) return;

    // set options
    [options enumerateKeysAndObjectsUsingBlock:^(NSString *key, id obj, BOOL *stop) {
        @try {
            PSPDFLog(@"setting %@ to %@.", key, obj);

            // convert boolean to YES/NO
            if ([obj isEqual:@"YES"])    obj = @YES;
            else if([obj isEqual:@"NO"]) obj = @NO;

            // convert color
            if ([key rangeOfString:@"color" options:NSCaseInsensitiveSearch].length > 0) {
                obj = [[TiColor colorNamed:obj] color];
            }

            // special handling for toolbar
            if ([key hasSuffix:@"BarButtonItems"] && [obj isKindOfClass:NSArray.class]) {
                NSMutableArray *newArray = [NSMutableArray array];
                for (id arrayItem in obj) {
                    if ([arrayItem isKindOfClass:NSString.class]) {
                        if ([object respondsToSelector:NSSelectorFromString(arrayItem)]) {
                            [newArray addObject:[object valueForKey:arrayItem]];
                        }
                    }else {
                        id newArrayItem = arrayItem;
                        if (![arrayItem isKindOfClass:UIBarButtonItem.class] && [arrayItem respondsToSelector:@selector(barButtonItem)]) {
                            newArrayItem = [arrayItem performSelector:@selector(barButtonItem)];
                            // Try to retain the TIButton proxy.
                            if ([arrayItem respondsToSelector:@selector(rememberSelf)]) {
                                [arrayItem performSelector:@selector(rememberSelf)];
                                // Release proxy once `object` is deallocated.
                                // (Object will be the PSPDFViewController)
                                [object pspdf_addDeallocBlock:^{
                                    [arrayItem performSelector:@selector(forgetSelf)];
                                } owner:arrayItem];
                            }
                        }
                        [newArray addObject:newArrayItem];
                    }
                }
                obj = newArray;
            }

            // special case handling for annotation name list
            if ([key isEqual:@"editableAnnotationTypes"] && [obj isKindOfClass:NSArray.class]) {
                obj = [NSMutableOrderedSet orderedSetWithArray:obj];
            }

            // Custom keys for bar button items
            else if ([key isEqual:PROPERTY(sendOptions)]) {
                key = @"emailButtonItem.sendOptions";
            }
            else if ([key isEqual:PROPERTY(openInOptions)]) {
                key = @"openInButtonItem.openOptions";
            }
            else if ([key isEqual:PROPERTY(printOptions)]) {
                key = @"printButtonItem.printOptions";
            }

            // processed later
            else if ([key isEqual:@"lockedInterfaceOrientation"]) {
                return; // continue in a block
            }

            else if ([key.lowercaseString hasSuffix:@"size"] && [obj isKindOfClass:NSArray.class] && [obj count] == 2) {
                obj = [NSValue valueWithCGSize:CGSizeMake([[obj objectAtIndex:0] floatValue], [[obj objectAtIndex:1] floatValue])];
            }

            NSLog(@"Set %@ to %@", key, obj);
            [object setValue:obj forKeyPath:key];
        }
        @catch (NSException *exception) {
            NSLog(@"Recovered from error while parsing options: %@", exception);
        }
    }];
}

// be smart about path search
+ (NSArray *)resolvePaths:(id)filePaths {
    NSMutableArray *resolvedPaths = [NSMutableArray array];

    if ([filePaths isKindOfClass:[NSString class]]) {
        NSString *resolvedPath = [self resolvePath:(NSString *)filePaths];
        if(resolvedPath) [resolvedPaths addObject:resolvedPath];
    }else if([filePaths isKindOfClass:NSArray.class]) {
        for (NSString *filePath in filePaths) {
            NSString *resolvedPath = [self resolvePath:filePath];
            if(resolvedPath) [resolvedPaths addObject:resolvedPath];
        }
    }

    return resolvedPaths;
}

+ (NSString *)resolvePath:(NSString *)filePath {
    if (![filePath isKindOfClass:NSString.class]) return nil;
    
    // If this is a full path; don't try to replace any parts.
    if (filePath.isAbsolutePath) {
        return PSPDFFixIncorrectPath(filePath);
    }

    NSString *pdfPath = filePath;
    NSFileManager *fileManager = [NSFileManager new];

    if (![fileManager fileExistsAtPath:filePath]) {
        // Convert to URL and back to cope with file://localhost paths
        NSURL *urlPath = [NSURL URLWithString:filePath];
        pdfPath = [urlPath path];
        //PSTiLog(@"converted: %@", urlPath.path);
        if (![fileManager fileExistsAtPath:pdfPath]) {
            // try application bundle
            pdfPath = [NSBundle.mainBundle.bundlePath stringByAppendingPathComponent:filePath];

            // try documents directory
            if (![fileManager fileExistsAtPath:pdfPath]) {
                NSString *cacheFolder = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES)[0];
                pdfPath = [cacheFolder stringByAppendingPathComponent:filePath];
                if (![fileManager fileExistsAtPath:pdfPath]) {
                    PSPDFLogError(@"PSPDFKit Error: pdf '%@' could not be found. Searched native path, application bundle and documents directory.", filePath);
                }
            }
        }
    }
    return pdfPath;
}

+ (NSArray *)documentsFromArgs:(id)args {
    NSMutableArray *documents = [NSMutableArray array];

    // be somewhat intelligent about path search
    for (NSString *filePath in args) {
        if ([filePath isKindOfClass:NSString.class]) {
            NSString *pdfPath = [PSPDFUtils resolvePath:filePath];

            if (pdfPath.length && [[NSFileManager defaultManager] fileExistsAtPath:pdfPath]) {
                PSPDFDocument *document = [[PSPDFDocument alloc] initWithURL:[NSURL fileURLWithPath:pdfPath]];
                if (document) {
                    [documents addObject:document];
                }
            }
        }
    }
    return documents;
}

@end
