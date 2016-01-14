PSPDFKit for iOS Appcelerator Bindings
======================================

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android.

Note: Currently Appcelerator does not work with dynamic frameworks. As of PSPDFKit v5, we only provide a dynamic framework. We still keep the wrapper open source, and can provide a static build on request until Appcelerator resolves this issue. We're already in contact with them and are helping them to find a solution.

## How to build

1. Checkout the project: `git clone https://github.com/PSPDFKit/PSPDFKit-Titanium.git`
2. Make sure you have Titanium 5.1.2 GA or later installed: http://www.appcelerator.com
3. Download the binary build of PSPDFKit from your customer portal: https://customers.pspdfkit.com
4. Open the downloaded .dmg and copy `PSPDFKit.embeddedframework` into the checked out folder.
5. Call `./build.py` in the `PSPDFKit-Titanium` folder.
6. Copy the created .zip into the Titanium folder: `cp com.pspdfkit.source-iphone-5.x.x.zip ~/Library/Application\ Support/Titanium`
7. Copy the `PSPDFKit.bundle` from `PSPDFKit.embeddedframework/PSPDFKit.framework/Versions/A/Resources/PSPDFKit.bundle` into your project's `Resources/iphone`.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2016 PSPDFKit GmbH.

See LICENSE for details.