# PSPDFKit for iOS Appcelerator Bindings

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android. PSPDFKit 9.2 for iOS needs at least Xcode 11.3.1 or higher and supports iOS 11 ([read more](https://pspdfkit.com/guides/ios/current/announcements/version-support/)). 

## Build Instructions

> **Note:** Read the [Alloy](#alloy) section before building the module if you're using the Alloy framework.

We recommend using [Titanium](https://github.com/appcelerator/titanium) version 8.3.0.GA, or later. You'll also need to install [CocoaPods](http://cocoapods.org) if don't have it installed already:

```bash
$ [sudo] npm install -g titanium
$ [sudo] gem install cocoapods
```

Now, clone the Appcelerator-iOS project to your local machine:

```bash
$ git clone https://github.com/PSPDFKit/Appcelerator-iOS.git
```

Once cloned, open the `Podfile` file on the root of the repository, and on line 6, replace `YOUR_COCOAPODS_KEY` with the private CocoaPods key for your copy of PSPDFKit, which you can retrieve from the [Customer Portal](https://customers.pspdfkit.com/customers/sign_in).

```diff
platform :ios, '11.0'

use_frameworks!

target :pspdfkit do
-  pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'
+  pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/pspdfkit/latest.podspec'
end
```

Inside the Appcelerator-iOS project, run `pod install` :

```bash
$ cd Appcelerator-iOS/
$ pod install
```

And now, build it: 

```bash
$ ti build -p ios --build-only
```

If the command above throws an error citing `node-pre-gyp`, [make sure you're using Node 8](https://github.com/nodejs/node-gyp/issues/277): 

```bash
$ nvm install 8
$ nvm use 8
```

Unzip the result into the Titanium folder (and optionally remove the .zip afterwards):
 
```bash
unzip ./dist/com.pspdfkit-iphone-9.0.2.zip -d ~/Library/Application\ Support/Titanium
```

Finally, modify your project's `tiapp.xml` to contain the following entries:

```xml
<ti:app xmlns:ti="http://ti.appcelerator.org">
  <ios>
    <min-ios-ver>11.0</min-ios-ver>
  </ios>
  <modules>
    <module platform="iphone">com.pspdfkit</module>
  </modules>
</ti:app>
```

If you do not do this, have multiple versions of the Titanium SDK installed, and none of them is the one that's set on the `xcconfig` file, the build will fail with cryptic error messages.

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

#### Using the correct version of Titanium

If you have multiple versions of the Titanium SDK installed on your system, you'll need to also modify the `titanium.xcconfig` configuration file to set the correct version number:

```diff
- TITANIUM_SDK_VERSION = 8.0.1.GA
+ TITANIUM_SDK_VERSION = 8.3.0.GA
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
