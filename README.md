# PSPDFKit for iOS Appcelerator Bindings

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android. PSPDFKit 9 for iOS needs at least Xcode 11 or higher and supports iOS 11 ([read more](https://pspdfkit.com/guides/ios/current/announcements/version-support/)). 

## Build instructions

> **Note:** Read the [Alloy](#alloy) section before building the module if you're using the Alloy framework.

We recommend using [Titanium](https://github.com/appcelerator/titanium) version 8.2.1.GA, or later. You'll also need to install [CocoaPods](http://cocoapods.org) if don't have it installed already:

```bash
$ [sudo] npm install -g titanium
$ [sudo] gem install cocoapods
```

Now, clone the Appcelerator-iOS project to your local machine:

```bash
$ git clone https://github.com/PSPDFKit/Appcelerator-iOS.git
```

Once cloned, open the `Podfile` file on the root of the repository, and on line 6, replace `YOUR_COCOAPODS_KEY` with the private CocoaPods key for your copy of PSPDFKit, which you can retrieve from the [Customer Portal](https://customers.pspdfkit.com/customers/sign_in).

Inside the Appcelerator-iOS project, run `pod install` :

```bash
$ cd Appcelerator-iOS/
$ pod install
```

And now, build it: 

```bash
$ ti build -p ios --build-only

    [DEBUG] Titanium SDK iOS directory: /Users/oscarcisneros/Library/Application Support/Titanium/mobilesdk/osx/8.2.1.GA/iphone
    [INFO]  Project directory: /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS
    [INFO]  Module ID: com.pspdfkit
    [INFO]  Module Type: Static Library (Objective-C)
    [DEBUG] Writing module assets file: /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/Classes/ComPspdfkitModuleAssets.m
    [DEBUG] Running: DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -configuration Release -sdk iphonesimulator -UseNewBuildSystem=NO ONLY_ACTIVE_ARCH=NO clean build
    [DEBUG] Running: DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -configuration Release -sdk iphoneos -UseNewBuildSystem=NO ONLY_ACTIVE_ARCH=NO clean build
    [INFO]  Creating universal library
    [DEBUG] Searching library: /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/build/Release-iphoneos/libComPspdfkit.a
    [DEBUG] Searching library: /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/build/Release-iphonesimulator/libComPspdfkit.a
    [DEBUG] Running: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/lipo /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/build/Release-iphoneos/libComPspdfkit.a /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/build/Release-iphonesimulator/libComPspdfkit.a -create -output /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/build/libcom.pspdfkit.a
    [INFO]  Verifying universal library
    [DEBUG] Running: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/lipo -info /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/build/libcom.pspdfkit.a
    [INFO]  Creating module zip
    [INFO]  Writing module zip: /Users/oscarcisneros/Documents/PSPDFKit/Appcelerator-iOS/dist/com.pspdfkit-iphone-9.0.2.zip
    [INFO]  Project built successfully in 9s 389ms
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

### Using the correct version of Titanium

If you have multiple versions of the Titanium SDK installed on your system, you'll need to also modify the `titanium.xcconfig` configuration file to set the correct version number:

```
TITANIUM_SDK_VERSION = 8.2.1.GA
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
