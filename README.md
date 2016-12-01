PSPDFKit for iOS Appcelerator Bindings
======================================

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android.

## How to build

1. Checkout the project: `git clone https://github.com/PSPDFKit/Appcelerator-iOS.git`
2. Make sure you have Titanium 6.0.0 GA or later installed: http://www.appcelerator.com
3. Download the binary build of PSPDFKit from your customer portal: https://customers.pspdfkit.com
4. Open the downloaded .dmg and copy `PSPDFKit.framework` into the checked out folder.
5. Call `./build.py` in the `Appcelerator-iOS` folder.
6. Copy the created .zip into the Titanium folder: `cp com.pspdfkit-iphone-6.x.x.zip ~/Library/Application\ Support/Titanium`
7. Unzip it (and optionally remove the .zip afterwards): `unzip ~/Library/Application\ Support/Titanium/com.pspdfkit-iphone-6.x.x.zip`
8. Copy `PSPDFKit.framework` into your project's `Resources/iphone`.
9. Copy `ti.dynamiclib` from `Appcelerator-iOS` into the `plugins` directory of your project's root folder. If the `plugins` directory doesn't exist you have to create it first.
10. Modify your project's `tiapp.xml` to contain the following entries:

```xml
<ti:app xmlns:ti="http://ti.appcelerator.org">
  <ios>
    <min-ios-ver>9.0</min-ios-ver>
  </ios>
  <plugins>
    <plugin version="1.0">ti.dynamiclib</plugin>
  </plugins>
</ti:app>
```

Note: PSPDFKit v6 needs at least Xcode 8.0 or higher and supports iOS 9.0+.
The `ti.dynamiclib` plugin embeds `PSPDFKit.framework` into your app. You can find more info about it [here](https://jira.appcelerator.org/browse/TIMOB-20557).

## Using the PSPDFKit module

To use the module in code, you will need to require it, before using it.

```
var pspdfkit = require('com.pspdfkit');
var pdfView = pspdfkit.createView({
    filename : 'PSPDFKit.pdf',
    options : {
        pageMode : 0, // PSPDFPageModeSingle
        pageTransition : 2 // PSPDFPageCurlTransition
    },
    documentOptions : {
        title : "Custom Title Here"
    }
});
```

## Troubleshooting

#### 'PSPDFKit.h' file not found

If `PSPDFKit.h` can't be found you need to add the directory that contains `PSPDFKit.h` to the "Header Search Paths" build setting in the Xcode project (`pspdfkit-titanium.xcodeproj`). The correct directory is `$(SRCROOT)/PSPDFKit.framework/Headers` (recursive).

#### App Store Upload

`PSPDFKit.framework` needs to be stripped of unwanted architectures, in order for the App Store upload to succeed.  
To do this you need to open the Xcode project in `build/iphone/{project-name}.xcodeproj` and follow step 2 of our [integration guide](https://pspdfkit.com/guides/ios/current/getting-started/integrating-pspdfkit/#toc_integrating-the-dynamic-framework).  
`strip-framework.sh` removes the unwanted architectures. After that the App Store upload succeeds.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2016 PSPDFKit GmbH.

See LICENSE for details.
