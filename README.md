# PSPDFKit for iOS Appcelerator Bindings

PSPDFKit - The Leading Mobile PDF Framework for iOS and Android. PSPDFKit 9.2.1 for iOS needs at least Xcode 11.3.1 or higher and supports iOS 11 ([read more](https://pspdfkit.com/guides/ios/current/announcements/version-support/)). 

## Getting Started Step by Step Guide

> **Note:** Read the [Alloy](#alloy) section before building the module if you're using the Alloy framework.

This uses the Appcelerator CLI, not Appcelerator Studio, and assumes Xcode 11.3.1 is installed as default.

#### Configuring the Environment

First, let’s make sure our dependencies are installed.

```bash
# First, make sure we’re using Node 8.
$ nvm use 8 -g			

# Install Appcelerator CLI and Titanium 
$ npm install appcelerator titanium -g

# Install CocoaPods.
$ gem install cocoapods

# Run through the basic Appcelerator setup. Requires you to log in.
$ appc setup

# IMPORTANT: Make sure Xcode’s Command Line Tools are installed
$ sudo xcode-select --install

# IMPORTANT: Also make sure we’ve accepted the Xcode EULA
$ sudo xcodebuild -license

# Install the latest appcelerator
$ appc use 7.1.2
```

You can also run `appc use` to list all available versions for Appcelerator. If some of the following steps fail, please try with an older version of appcelerator, such as 7.0.12: `appc use 7.0.12`.

#### Building the PSPDFKit Module

We can now procceed to build the plugin.

```bash
# Move to the workspace
$ cd ~/path/to/workspace/

# Clone the PSPDFKit Appcelerator Plugin
$ git clone https://github.com/PSPDFKit/Appcelerator-iOS.git
```

Modify `Appcelerator-iOS/Podfile` to include your CocoaPods key for PSPDFKit, which you can retrieve from the [Customer Portal](https://customers.pspdfkit.com/customers/sign_in):

```diff
platform :ios, '11.0'

use_frameworks!

target :pspdfkit do
-  pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/YOUR_COCOAPODS_KEY_GOES_HERE/pspdfkit/latest.podspec'
+  pod 'PSPDFKit', podspec: 'https://customers.pspdfkit.com/cocoapods/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/pspdfkit/latest.podspec'
end
```

Once you’ve done that, you can now install the dependencies and builld the plugin:

```bash
# Move to the plugin’s directory
$ cd Appcelerator-iOS/

# Download the PSPDFKit dependency
$ pod install

# Build the Plugin
$ ti build -p ios --build-only
```

Unzip the result into the Titanium folder:
 
```bash
$ unzip ./dist/com.pspdfkit-iphone-9.2.1.zip -d ~/Library/Application\ Support/Titanium
```

#### Using the PSPDFKit Plugin

Once we’ve installed the dependencies, and built the PSPDFKit plugin, we can now create a new app using the CLI:

```bash
# Go to the root of the workspace
$ cd ..

# And create the new app
$ appc new --type app --name MyApp --id com.example.MyApp
```

Modify `MyApp/tiapp.xml` to include PSPDFKit as a module, and to define iOS 11 as the minimum iOS version:

```diff
<ti:app xmlns:ti="http://ti.appcelerator.org">
  <ios>
+   <min-ios-ver>11.0</min-ios-ver>
  </ios>
  <modules>
+   <module version="9.2.1" platform="iphone">com.pspdfkit</module>
  </modules>
</ti:app>
```

And integrate the PSPDFKit example into the new application:

```bash
# Rename the app folder to avoid using the Alloy framework for now
$ mv MyApp/app MyApp/__app

# Copy the PSPDFKit example into place
$ cp -R Appcelerator-iOS/example/ MyApp/Resources/
```

Then, open `MyApp/Resources/app.js`, and insert your license key, which you can retrieve from the [Customer Portal](https://customers.pspdfkit.com/customers/sign_in):

```diff
// You need to activate your PSPDFKit before you can use it.
// Follow the instructions in the email you get after licensing the framework.
- pspdfkit.setLicenseKey("LICENSE_KEY_GOES_HERE");
+ pspdfkit.setLicenseKey("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
```

To run the application from the CLI, manually launch a Simulator.app instance, and from the Hardware menu, select a device to launch (`Hardware Menu/Device/iOS 13.3/iPhone 8`, for instance). Then get the UUID for the simulator you’ve launched:

```bash
# List the booted simulators
$ xcrun simctl list devices | grep Booted
    iPhone 8 (60FDA403-8D0B-40A4-BBE5-662C045A6A97) (Booted)
```

Copy the UUID for the device (bold in the sample above), then run the app on it:

```bash
# Move to the app directory
$ cd MyApp

# And run the app on the device
$ appc run --platform ios -l trace --device-id 60FDA403-8D0B-40A4-BBE5-662C045A6A97
```

> The `-l trace` option is not required, but its useful to get more information should something go wrong with the installation.

## Using the PSPDFKit Module

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
