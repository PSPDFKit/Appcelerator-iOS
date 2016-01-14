//
//  ComPspdfkitModule.h
//  PSPDFKit-Titanium
//
//  Copyright (c) 2011-2015 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//
//  Appcelerator Titanium is Copyright (c) 2009-2014 by Appcelerator, Inc.
//  and licensed under the Apache Public License (version 2)
//

#import "ComPspdfkitModule.h"
#import "ComPspdfkitView.h"
#import "TiBase.h"
#import "TiApp.h"
#import "TiHost.h"
#import "TiUtils.h"
#import "PSPDFUtils.h"
#import "TIPSPDFViewController.h"
#import "TIPSPDFViewControllerProxy.h"
#import "TIPSPDFAnnotationProxy.h"
#import <objc/runtime.h>
#import <objc/message.h>

static BOOL PSTReplaceMethodWithBlock(Class c, SEL origSEL, SEL newSEL, id block) {
    NSCParameterAssert(c);
    NSCParameterAssert(origSEL);
    NSCParameterAssert(newSEL);
    NSCParameterAssert(block);

    if ([c instancesRespondToSelector:newSEL]) return YES; // Selector already implemented, skip silently.

    Method origMethod = class_getInstanceMethod(c, origSEL);

    // Add the new method.
    IMP impl = imp_implementationWithBlock(block);
    if (!class_addMethod(c, newSEL, impl, method_getTypeEncoding(origMethod))) {
        NSLog(@"Failed to add method: %@ on %@", NSStringFromSelector(newSEL), c);
        return NO;
    } else {
        Method newMethod = class_getInstanceMethod(c, newSEL);

        // If original doesn't implement the method we want to swizzle, create it.
        if (class_addMethod(c, origSEL, method_getImplementation(newMethod), method_getTypeEncoding(origMethod))) {
            class_replaceMethod(c, newSEL, method_getImplementation(origMethod), method_getTypeEncoding(newMethod));
        } else {
            method_exchangeImplementations(origMethod, newMethod);
        }
    }
    return YES;
}

@interface TiRootViewController (PSPDFInternal)
- (void)refreshOrientationWithDuration:(NSTimeInterval)duration;
- (void)pspdf_refreshOrientationWithDuration:(NSTimeInterval)duration; // will be added dynamically
@end

@implementation ComPspdfkitModule

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Appcelerator Lifecycle

// this method is called when the module is first loaded
- (void)startup {
	[super startup];
    [self printVersionStringOnce];

    // Appcelerator doesn't cope well with high memory usage.
    PSPDFKit.sharedInstance[@"com.pspdfkit.low-memory-mode"] = @YES;
}

// this method is called when the module is being unloaded
// typically this is during shutdown. make sure you don't do too
// much processing here or the app will be quit forcibly
- (void)shutdown:(id)sender {
	[super shutdown:sender];
}

- (id)moduleGUID {
	return @"3056f4e3-4ee6-4cf3-8417-1d8b8f95853c";
}

- (NSString *)moduleId {
	return @"com.pspdfkit";
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Private

// Extract a dictionary from the input
- (NSDictionary *)dictionaryFromInput:(NSArray *)input position:(NSUInteger)position {
    NSDictionary *dict = input.count > position && [input[position] isKindOfClass:NSDictionary.class] ? input[position] : nil;
    return dict;
}

// Show version string once in the console.
- (void)printVersionStringOnce {
    static BOOL printVersionOnce = YES;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSLog(@"Initialized PSPDFKit %@", [self PSPDFKitVersion]);
        printVersionOnce = NO;
    });
}

// internal helper for pushing the PSPDFViewController on the view
- (TIPSPDFViewControllerProxy *)pspdf_displayPdfInternal:(NSArray *)pdfNames animation:(NSUInteger)animation options:(NSDictionary *)options documentOptions:(NSDictionary *)documentOptions {
    __block TIPSPDFViewControllerProxy *proxy = nil;
    ps_dispatch_main_sync(^{
        PSPDFDocument *document = nil;

        // Support encryption
        NSString *passphrase = documentOptions[@"passphrase"];
        NSString *salt = documentOptions[@"salt"];
        if (passphrase.length && salt.length) {
            NSURL *pdfURL = [NSURL fileURLWithPath:[pdfNames firstObject]];
            PSPDFAESCryptoDataProvider *cryptoWrapper = [[PSPDFAESCryptoDataProvider alloc] initWithURL:pdfURL passphraseProvider:^NSString *{
                return passphrase;
            } salt:salt rounds:PSPDFDefaultPBKDFNumberOfRounds];
            document = [PSPDFDocument documentWithDataProvider:cryptoWrapper];
        }

        if (!document) document = [[PSPDFDocument alloc] initWithBaseURL:nil files:pdfNames];

        TIPSPDFViewController *pdfController = [[TIPSPDFViewController alloc] initWithDocument:document];

        [PSPDFUtils applyOptions:options onObject:pdfController];
        [PSPDFUtils applyOptions:documentOptions onObject:document];

        UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:pdfController];
        UIViewController *rootViewController = (UIViewController *)[([UIApplication sharedApplication].windows)[0] rootViewController];

        // allow custom animation styles
        PSTiLog(@"animation: %d", animation);
        if (animation >= 2) {
            navController.modalTransitionStyle = animation - 2;
        }

        // encapsulate controller into proxy
        //PSTiLog(@"_pspdf_displayPdfInternal");
        proxy = [[TIPSPDFViewControllerProxy alloc] initWithPDFController:pdfController context:self.pageContext parentProxy:self];

        [rootViewController presentViewController:navController animated:animation > 0 completion:NULL];
    });
    return proxy;
}

///////////////////////////////////////////////////////////////////////////////////////////////////
#pragma mark - Public

- (id)PSPDFKitVersion {
    return PSPDFKit.sharedInstance.version;
}

- (void)setLicenseKey:(id)license {
    NSString *licenseString = [license isKindOfClass:NSArray.class] ? [license firstObject] : license;
    if ([licenseString isKindOfClass:NSString.class] && licenseString.length > 0) {
        if (![NSThread isMainThread]) {
            dispatch_sync(dispatch_get_main_queue(), ^{
                [PSPDFKit setLicenseKey:licenseString];
            });
        } else {
            [PSPDFKit setLicenseKey:licenseString];
        }
    }
}

/// show modal pdf animated
- (id)showPDFAnimated:(NSArray *)pathArray {
    [self printVersionStringOnce];

    if (pathArray.count < 1 || pathArray.count > 4 || ![pathArray[0] isKindOfClass:NSString.class] || [pathArray[0] length] == 0) {
        PSCLog(@"PSPDFKit Error. At least one argument is needed: pdf filename (either absolute or relative (application bundle and documents directory are searched for it)\n \
                      Argument 2 sets animated to true or false. (optional, defaults to true)\n \
                      Argument 3 can be an array with options for PSPDFViewController. See http://pspdfkit.com/documentation.html for details. You need to write the numeric equivalent for enumeration values (e.g. PSPDFPageModeDouble has the numeric value of 1)\
                      Argument 4 can be an array with options for PSPDFDocument.\
                      \n(arguments: %@)", pathArray);
        return nil;
    }

    NSUInteger animation = 1; // default modal
    if (pathArray.count >= 2 && [pathArray[1] isKindOfClass:NSNumber.class]) {
        animation = [pathArray[1] intValue];
    }

    // be somewhat intelligent about path search
    id filePath = pathArray[0];
    NSArray *pdfPaths = [PSPDFUtils resolvePaths:filePath];

    // extract options from input
    NSDictionary *options = [self dictionaryFromInput:pathArray position:2];
    NSDictionary *documentOptions = [self dictionaryFromInput:pathArray position:3];

    if (options) PSCLog(@"options: %@", options);
    if (documentOptions) PSCLog(@"documentOptions: %@", documentOptions);

    PSCLog(@"Opening PSPDFViewController for %@.", pdfPaths);
    return [self pspdf_displayPdfInternal:pdfPaths animation:animation options:options documentOptions:documentOptions];
}

- (void)clearCache:(id)args {
    PSCLog(@"requesting clear cache... (spins of async)");

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [[PSPDFKit sharedInstance].cache clearCache];
    });
}

- (void)cacheDocument:(id)args {
    PSCLog(@"Request to cache document at path %@", args);

    // be somewhat intelligent about path search
    NSArray *documents = [PSPDFUtils documentsFromArgs:args];
    for (PSPDFDocument *document in documents) {
        [[PSPDFKit sharedInstance].cache cacheDocument:document
                                             pageSizes:@[[NSValue valueWithCGSize:CGSizeMake(170.f, 220.f)], [NSValue valueWithCGSize:UIScreen.mainScreen.bounds.size]]
                                 withDiskCacheStrategy:PSPDFDiskCacheStrategyEverything
                                            aroundPage:0];
    }
}

- (void)removeCacheForDocument:(id)args {
    PSCLog(@"Request to REMOVE cache for document at path %@", args);

    // be somewhat intelligent about path search
    NSArray *documents = [PSPDFUtils documentsFromArgs:args];
    for (PSPDFDocument *document in documents) {
        NSError *error = nil;
        if (![[PSPDFKit sharedInstance].cache removeCacheForDocument:document deleteDocument:NO error:&error]) {
            PSCLog(@"Failed to clear cache for %@: %@", document, error);
        }
    }
}

- (void)stopCachingDocument:(id)args {
    PSCLog(@"Request to STOP cache document at path %@", args);

    // be somewhat intelligent about path search
    NSArray *documents = [PSPDFUtils documentsFromArgs:args];
    for (PSPDFDocument *document in documents) {
        [[PSPDFKit sharedInstance].cache stopCachingDocument:document];
    }
}

- (id)imageForDocument:(id)args {
    PSCLog(@"Request image: %@", args);
    if ([args count] < 2) {
        PSCLog(@"Invalid number of arguments: %@", args);
        return nil;
    }
    UIImage *image = nil;

    PSPDFDocument *document = [PSPDFUtils documentsFromArgs:args].firstObject;
    NSUInteger page = [args[1] unsignedIntegerValue];
    BOOL full = [args count] < 3 || [args[2] unsignedIntegerValue] == 0;
    CGSize thumbnailSize = CGSizeMake(170.f, 220.f);

    // be somewhat intelligent about path search
    if (document && page < [document pageCount]) {
        image = [[PSPDFKit sharedInstance].cache imageFromDocument:document page:page size:full ? UIScreen.mainScreen.bounds.size : thumbnailSize options:PSPDFCacheOptionDiskLoadSync|PSPDFCacheOptionRenderSync];
        if (!image) {
            CGSize size = full ? [[UIScreen mainScreen] bounds].size : thumbnailSize;
            image = [document imageForPage:page size:size clippedToRect:CGRectZero annotations:nil options:nil receipt:NULL error:NULL];
        }
    }

    // if we use this directly, we get linker errors???
    id proxy = nil;
    if (NSClassFromString(@"TiUIImageViewProxy")) {
        proxy = [NSClassFromString(@"TiUIImageViewProxy") new];
        [proxy performSelector:@selector(setImage:) withObject:image];
    }
    return proxy;
}

- (void)setLanguageDictionary:(id)dictionary {
    ENSURE_UI_THREAD(setLanguageDictionary, dictionary);

    if (![dictionary isKindOfClass:NSDictionary.class]) {
        PSCLog(@"PSPDFKit Error. Argument error, need dictionary with languages.");
    }

    PSPDFSetLocalizationDictionary(dictionary);
}

- (void)setLogLevel:(id)logLevel {
    ENSURE_UI_THREAD(setLogLevel, logLevel);

    [[PSPDFKit sharedInstance] setLogLevel:[PSPDFUtils intValue:logLevel]];
    PSCLog(@"New Log level set to %d", PSPDFLogLevel);
}

@end

@implementation ComPspdfkitSourceModule @end
