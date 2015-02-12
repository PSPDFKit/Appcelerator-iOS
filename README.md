PSPDFKit-Titanium
=================

Appcelerator Titanium Bridge for PSPDFKit.

PSPDFKit is a framework for displaying and annotating PDFs in your iOS apps.

## How to build

1. Checkout the project and also include the PSPDFKit-Demo submodule: `git clone --recursive https://github.com/PSPDFKit/PSPDFKit-Titanium.git`
2. Make sure you have Titanium 3.5.0 RC or later installed: http://www.appcelerator.com/
3. Call `./build.py` in the PSPDFKit-Titanium folder.
4. Copy the zip into the Titanium folder: `cp com.pspdfkit.source-iphone-4.x.x.zip /Users/<user>/Library/Application\ Support/Titanium/`
5. Copy the `PSPDFKit.bundle` from `PSPDFKit-Demo/PSPDFKit.embeddedframework/PSPDFKit.framework/Versions/A/Resources/PSPDFKit.bundle` into your project's `Resources/iphone`.

## Important

Currently there's an issue where Titanium uses the symbols `WTFReportBacktrace` and `WTFReportFatalError`, which are in Apple's private namespace. Please contact us if you need a custom binary that can be used for App Store submissions. We're working with Appcelerator to help them resolve this naming clash. See https://jira.appcelerator.org/browse/TC-5113 for details.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.
All items and source code Copyright © 2010-2015 PSPDFKit GmbH.

Please read the full license in the corresponding License.pdf file downloadable at
http://pspdfkit.com/license.html
