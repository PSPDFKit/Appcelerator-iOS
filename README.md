PSPDFKit-Titanium
=================

Appcelerator Titanium Bridge for PSPDFKit.

PSPDFKit is a framework for displaying and annotating PDFs in your iOS apps.

## How to build

1. Checkout the project: `git clone https://github.com/PSPDFKit/PSPDFKit-Titanium.git`
2. Make sure you have Titanium 5.0.2 GA or later installed: http://www.appcelerator.com
3. Download the binary build of PSPDFKit from your customer portal: https://customers.pspdfkit.com
4. Open the downloaded .dmg and copy `PSPDFKit.embeddedframework` into the `PSPDFKit-Titanium` folder.
5. Call `./build.py` in the `PSPDFKit-Titanium` folder.
6. Copy the created .zip into the Titanium folder: `cp com.pspdfkit.source-iphone-4.x.x.zip ~/Library/Application\ Support/Titanium`
7. Copy the `PSPDFKit.bundle` from `PSPDFKit.embeddedframework/PSPDFKit.framework/Versions/A/Resources/PSPDFKit.bundle` into your project's `Resources/iphone`.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2015 PSPDFKit GmbH.

Please read the full license in the corresponding License.pdf file downloadable at  
http://pspdfkit.com/license.html
