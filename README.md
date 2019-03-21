# PSPDFKit for iOS Appcelerator Bindings

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android.

## How to build

**Note:** Read the [Alloy](#alloy) section before building the module if you're using the Alloy framework.

1. Checkout the project: `git clone https://github.com/PSPDFKit/Appcelerator-iOS.git`
2. Make sure you have Titanium 7.5.0.GA or later installed: https://www.appcelerator.com or `ti sdk install 7.5.0.GA`
3. Download the binary build of PSPDFKit from [your customer portal](https://customers.pspdfkit.com)
4. Open the downloaded .dmg and copy `PSPDFKit.framework` and `PSPDFKitUI.framework` into the `platform/` folder inside the project.
4a. Optionally, copy the `PSPDFKit.bundle` from `PSPDFKit.framework` to `Resources/`
5. Call `ti build -p ios --build-only` in the `Appcelerator-iOS` folder.
6. Unzip the created .zip into the Titanium folder (and optionally remove the .zip afterwards): 
`unzip ./com.pspdfkit-iphone-8.x.x.zip -d ~/Library/Application\ Support/Titanium`
8. Modify your project's `tiapp.xml` to contain the following entries:

```xml
<ti:app xmlns:ti="http://ti.appcelerator.org">
  <ios>
    <min-ios-ver>10.0</min-ios-ver>
  </ios>
  <modules>
    <module platform="iphone">com.pspdfkit</module>
  </modules>
</ti:app>
```

Note: PSPDFKit 8 for iOS needs at least Xcode 10 or higher and supports iOS 10+.

## Using the PSPDFKit module

To use the module in code, you will need to require it, before using it. The following example uses the ES7 `import` syntax:

```js
import PSPDFKit from 'com.pspdfkit';

const pdfView = PSPDFKit.createView({
    filename: 'PSPDFKit.pdf',
    options: {
        pageMode: 0, // PSPDFPageModeSingle
        pageTransition: 2 // PSPDFPageCurlTransition
    },
    documentOptions: {
        title: 'Custom Title Here'
    }
});
```

## Troubleshooting

#### 'PSPDFKit.h' file not found

If `PSPDFKit.h` can't be found you need to add the directory that contains `PSPDFKit.h` to the "Header Search Paths" build setting in the Xcode project (`PSPDFKit-Titanium.xcodeproj`). The correct directories are `$(SRCROOT)/PSPDFKit.framework/Headers` and `$(SRCROOT)/PSPDFKitUI.framework/Headers` (recursive).

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

Alloy overwrites all files in the `Resources` folder everytime the application is built. This means you need to copy `PSPDFKit.framework` and `PSPDFKitUI.framework` into a different folder than the default `Resources/iphone`, for example `Frameworks`. You also need to do the following before building the module:

* Modify `FRAMEWORK_SEARCH_PATHS` in [`module.xcconfig`](module.xcconfig) to point to the new folder, for example replace `"$(SRCROOT)/../../Resources/iphone"` with `"$(SRCROOT)/../../Frameworks"`.
* Modify [`hooks/ti.dynamiclib.js`](hooks/ti.dynamiclib.js) to use the new framework path, for example replace `../../Resources/iphone/PSPDFKit.framework` with `../../Frameworks/PSPDFKit.framework` and `../../Resources/iphone/PSPDFKitUI.framework` with `../../Frameworks/PSPDFKitUI.framework`.

## License

This project can be used for evaluation or if you have a valid PSPDFKit license.  
All items and source code Copyright © 2010-2019 PSPDFKit GmbH.

See LICENSE for details.

## Contributing
  
Please ensure [you signed our CLA](https://pspdfkit.com/guides/web/current/miscellaneous/contributing/) so we can accept your contributions.
