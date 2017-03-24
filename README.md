PSPDFKit for iOS Appcelerator Bindings
======================================

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android.

## How to build

**Note:** Read the [Alloy](#alloy) section before building the module if you're using the Alloy framework.

1. Checkout the project: `git clone https://github.com/PSPDFKit/Appcelerator-iOS.git`
2. Make sure you have Titanium 6.0.2 GA or later installed: http://www.appcelerator.com
3. Download the binary build of PSPDFKit from your customer portal: https://customers.pspdfkit.com
4. Open the downloaded .dmg and copy `PSPDFKit.framework` into the checked out folder.
5. Call `appc ti build -p ios --build-only` in the `Appcelerator-iOS` folder.
6. Unzip the created .zip into the Titanium folder (and optionally remove the .zip afterwards): 
`unzip ./com.pspdfkit-iphone-6.x.x.zip -d ~/Library/Application\ Support/Titanium`
7. Copy `PSPDFKit.framework` into your project's `Resources/iphone`.
8. Modify your project's `tiapp.xml` to contain the following entries:

```xml
<ti:app xmlns:ti="http://ti.appcelerator.org">
  <ios>
    <min-ios-ver>9.0</min-ios-ver>
  </ios>
  <modules>
    <module platform="iphone">com.pspdfkit</module>
  </modules>
</ti:app>
```

Note: PSPDFKit 6 for iOS needs at least Xcode 8.2 or higher and supports iOS 9.0+.

The `ti.dynamiclib` module hook in [`hooks/ti.dynamiclib.js`](hooks/ti.dynamiclib.js) embeds `PSPDFKit.framework` into your app. 
You can find more info about it [here](https://jira.appcelerator.org/browse/TIMOB-20557).

## Using the PSPDFKit module

To use the module in code, you will need to require it, before using it.

```js
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

If `PSPDFKit.h` can't be found you need to add the directory that contains `PSPDFKit.h` to the "Header Search Paths" build setting in the Xcode project (`PSPDFKit-Titanium.xcodeproj`). The correct directory is `$(SRCROOT)/PSPDFKit.framework/Headers` (recursive).

#### Build error

```bash
[ERROR] :  ** BUILD FAILED **
[ERROR] :  The following build commands failed:
[ERROR] :   Ld build/Products/Debug-iphonesimulator/PSPDFKit-Appcelerator.app/PSPDFKit-Appcelerator normal x86_64
[ERROR] :  (1 failure)
```

If you get the above build error when running the project, you likely forgot to include the PSPDFKit module in the `tiapp.xml`:

```xml
  <modules>
    <module platform="iphone">com.pspdfkit</module>
  </modules>
```

#### Alloy

Alloy overwrites all files in the `Resources` folder everytime the application is built. This means you need to copy `PSPDFKit.framework` into a different folder than the default `Resources/iphone`, for example `Frameworks`. You also need to do the following before building the module:

* Modify `FRAMEWORK_SEARCH_PATHS` in [`module.xcconfig`](module.xcconfig) to point to the new folder, for example replace `"$(SRCROOT)/../../Resources/iphone"` with `"$(SRCROOT)/../../Frameworks"`.
* Modify [`hooks/ti.dynamiclib.js`](hooks/ti.dynamiclib.js) to use the new framework path, for example replace `../../Resources/iphone/PSPDFKit.framework` with `../../Frameworks/PSPDFKit.framework`.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2017 PSPDFKit GmbH.

See LICENSE for details.
