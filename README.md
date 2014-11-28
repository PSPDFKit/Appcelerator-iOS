PSPDFKit-Titanium
=================

Appcelerator Titanium Bridge for PSPDFKit.

PSPDFKit is a framework for displaying and annotating PDFs in your iOS apps.

## How to build

1. Checkout the project and also include the PSPDFKit-Demo submodule: `git clone --recursive https://github.com/PSPDFKit/PSPDFKit-Titanium.git`
2. Make sure you have Titanium 3.4.1 GA installed: http://www.appcelerator.com/
3. Call `./build.py` in the PSPDFKit-Titanium folder.
4. Copy the zip into the Titanium folder: `cp com.pspdfkit.source-iphone-4.x.x.zip /Users/<user>/Library/Application\ Support/Titanium/`
5. Copy the "PSPDFKit.bundle" from PSPDFKit-Demo/PSPDFKit.embeddedframework/PSPDFKit.framework/Versions/A/Resurces/PSPDFKit.bundle. into your project: assets/iphone.

## Important

Currently there's an issue where Titanium uses the symbols `WTFReportBacktrace` and `WTFReportFatalError`, which are in Apple's private namespace. Since PSPDFKit uses Apple's JavaScriptCore, these functions will trigger a validation error when you submit to the App Store. We are currently working with Appcelerator on helping them to resolve this issue, and also have a custom build available that can be used for App Store submissions. We hope this will be resolved soon, in the mean time you can contact us for a special build that can be used for the App Store.


## License

This project can be used for evaluation or if you have a valid PSPDFKit license.
All items and source code Copyright © 2010-2014 PSPDFKit GmbH.

Please read the full license in the corresponding License.pdf file downloadable at
http://pspdfkit.com/license.html