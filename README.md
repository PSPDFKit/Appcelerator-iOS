PSPDFKit-Titanium
=================

Appcelerator Titanium Bridge for PSPDFKit.

PSPDFKit is a framework for displaying and annotating PDFs in your iOS apps.

## How to build

1. Checkout the project: `git clone https://github.com/PSPDFKit/PSPDFKit-Titanium.git`
2. Make sure you have Titanium 3.5.0 RC or later installed: http://www.appcelerator.com
3. Download the binary build of PSPDFKit from your customer portal: https://customers.pspdfkit.com
4. Open the downloaded .dmg and copy `PSPDFKit.embeddedframework` into the `PSPDFKit-Titanium` folder.
5. Call `./build.py` in the `PSPDFKit-Titanium` folder.
6. Copy the created .zip into the Titanium folder: `cp com.pspdfkit.source-iphone-4.x.x.zip ~/Library/Application\ Support/Titanium`
7. Copy the `PSPDFKit.bundle` from `PSPDFKit.embeddedframework/PSPDFKit.framework/Versions/A/Resources/PSPDFKit.bundle` into your project's `Resources/iphone`.

## Important

Currently there's an issue where Titanium uses the symbols `WTFCrash`, `WTFLogAlways`, `WTFReportBacktrace`, `WTFReportFatalError` and `WebCoreWebThreadIsLockedOrDisabled`, which are in Apple's private namespace.

This issue creates errors when trying to validate your archive in Xcode similar to this one:

**iTunes Store operation failed**  
Your App contains non-public API usage. Please review the errors, correct them, and resubmit your application.

We have worked with Appcelerator to help them resolve this naming clash.  
If you are using Titanium SDK version 3.5.0.GA and want to fix this issue you need to replace the `libTiCore.a` and `libti_ios_debugger.a` libraries in your Titanium SDK with updated versions:

1. Download the updated [`libTiCore.a`](https://dl.dropboxusercontent.com/u/7540194/TitaniumLibs/libTiCore.a) and [`libti_ios_debugger.a`](https://dl.dropboxusercontent.com/u/7540194/TitaniumLibs/libti_ios_debugger.a)
2. Move these new libraries into Titanium SDK's `iphone` folder, replacing your old libraries. If you are using OSX the `iphone` folder has the following path: `~/Library/Application Support/Titanium/mobilesdk/osx/3.5.0.GA/iphone`.
3. That's it. Your archives will validate from now on.

See https://jira.appcelerator.org/browse/TC-5113 for more details.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2015 PSPDFKit GmbH.

Please read the full license in the corresponding License.pdf file downloadable at  
http://pspdfkit.com/license.html
