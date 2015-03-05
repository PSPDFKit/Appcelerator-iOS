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

#import "TiModule.h"

/// PSPDFKit Titanium Bridge.
@interface ComPspdfkitModule : TiModule

/// Get the version of PSPDFKit. (This is not the version of the module bridge)
- (id)PSPDFKitVersion;

/// Enable the license key.
- (void)setLicenseKey:(id)license;

/// Shows a modal page with the pdf. At least one argument (the pdf name) is needed.
/// Argument 2 sets animated to true or false.
/// Argument 3 can be an array with options for `PSPDFViewController`.
/// See http://pspdfkit.com/documentation.html for details. You need to write the numeric equivalent for enumeration values (e.g. `PSPDFPageModeDouble` has the numeric value of 1)
/// Argument 4 can be an array with options for PSPDFDocument.
/// Returns a PSPDFViewController object.
- (id)showPDFAnimated:(id)pathArray;

/// Clears the whole application cache. No arguments needed.
- (void)clearCache:(id)args;

/// Starts caching the document in advance. Argument is filePath.
- (void)cacheDocument:(id)args;

/// Return a rendered image.
/// Document | Page | Size (Full=0/Thumb=1)
- (id)imageForDocument:(id)args;

/// Stops caching the document in advance. Argument is filePath.
- (void)stopCachingDocument:(id)args;

/// Removes the cache for a specific document. Argument is filePath.
- (void)removeCacheForDocument:(id)args;

/// Allows setting custom language additions.
/// Accepts a dictionary with language dictionaries mapped to the language string.
- (void)setLanguageDictionary:(id)dictionary;

/// Set internal log level. Defaults to PSPDFKit default.
- (void)setLogLevel:(id)logLevel;

@end

@interface ComPspdfkitSourceModule : ComPspdfkitModule
@end