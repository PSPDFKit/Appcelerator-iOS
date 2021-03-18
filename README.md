# Axway Appcelerator End-of-Support Notice

Axway announced [End-of-Support for the Titanium SDK](https://devblog.axway.com/featured/product-update-changes-to-application-development-services-appcelerator/) effective 1 March 2022. PSPDFKit stopped updating and supporting the PSPDFKit for iOS Titanium Module as of 1 March 2021. The module is open source, so if you require more time to transition to a different platform, it can still be updated and customized to your needs.

# PSPDFKit for iOS Titanium Module

**[PSPDFKit for iOS](https://pspdfkit.com/pdf-sdk/ios) — the best way to handle PDF documents on iOS.** A high-performance viewer, extensive annotation and document editing tools, digital signatures, and more. All engineered for the best possible user and developer experience.

PSPDFKit for iOS Titanium module requires a valid license of PSPDFKit for iOS. You can [request a trial license here](https://pspdfkit.com/try). PSPDFKit 10.2 for iOS requires Xcode 12.4 or later and supports iOS 12 or later. Read more about version support [in our guides](https://pspdfkit.com/guides/ios/current/announcements/version-support). Check out [our changelog](https://pspdfkit.com/changelog/ios) to learn more about the releases.

## Support, Issues and License Questions

PSPDFKit offers support for customers with an active SDK license via [our support platform](https://pspdfkit.com/support/request).

Are you evaluating our SDK? That's great, we're happy to help out! To make sure this is fast, please use a work email and have someone from your company fill out [our sales form](https://pspdfkit.com/sales).

## Getting Started

In the following steps, you will build PSPDFKit for iOS Titanium module using Titanium CLI.

### Configuring the Environment

First, make sure the Xcode Command-Line Tools are installed and their license is accepted:

```bash
# Install Xcode Command-Line Tools.
$ sudo xcode-select --install

# Accept EULA once installed.
$ sudo xcodebuild -license accept
```

Then, let's clone the module source:

```bash
# Go to your workspace directory.
$ cd ~/path/to/workspace

# Clone the PSPDFKit Titanium Module.
$ git clone https://github.com/PSPDFKit/Appcelerator-iOS.git
```

From inside the cloned directory, install the remaining required tools:

```bash
# Go to the cloned directory.
$ cd Appcelerator-iOS

# Make sure you're using Node 12.
# You can use nvm to manage multiple Node versions.
$ nvm use 12

# Install CocoaPods globally.
$ gem install cocoapods

# Install local build script dependencies.
$ npm install
```

### Building the Module

From inside the cloned directory, run the build script which will first make sure that all required tools are installed and then build the PSPDFKit for iOS Titanium module. By default, it will use the Titanium SDK version declared in the [manifest](manifest) file but you can force it to use a different one using `--sdk` option.

```bash
# Build the PSPDFKit Titanium module.
$ node scripts/bootstrap.js build
```

Should something go wrong along the way, run the build script again with `--verbose` option to enable additional logging. You can also use `--help` to learn all available commands and options in the build script.

### Importing the Module

In the following steps, you will create an example Appcelerator app and import PSPDFKit for iOS Titanium module you built above. If you have an existing Appcelerator project already, you can skip this section.

First, you need to set up the Appcelerator environment:

```bash
# Go back to your workspace directory.
$ cd ..

# Make sure you're using Node 12.
# You can use nvm to manage multiple Node versions.
$ nvm use 12

# Install Appcelerator and Titanium CLIs globally.
$ npm install -g appcelerator titanium

# Run through the basic Appcelerator setup. Requires you to log in.
$ appc setup

# Install and select the latest Appcelerator SDK.
$ appc use latest
```

Then, create a new Appcelerator app:

```bash
# Create a new app from template.
$ appc new --type app --name MyApp --id com.example.MyApp
```

Open `MyApp/tiapp.xml` and include PSPDFKit for iOS Titanium module. You can ask the build script for the values of PSPDFKit version, Titanium SDK version and iOS deployment target by running `node scripts/bootstrap.js versions` from inside the cloned directory.

```diff
<ti:app xmlns:ti="http://ti.appcelerator.org">
  ...
  <ios>
+   <min-ios-ver>IOS_DEPLOYMENT_TARGET</min-ios-ver>
  </ios>
  ...
  <modules>
+   <module version="PSPDFKIT_VERSION" platform="iphone">com.pspdfkit</module>
  </modules>
  ...
+ <sdk-version>TITANIUM_SDK_VERSION</sdk-version>
  ...
</ti:app>
```

Copy our example into your app:

```bash
# Avoid using the Alloy framework for now.
$ mv MyApp/app MyApp/alloy

# Copy our example code into place.
$ cp -R Appcelerator-iOS/example MyApp/Resources
```

Open `MyApp/Resources/app.js` and update your license key, which you can retrieve from the [customer portal](https://customers.pspdfkit.com/customers/sign_in).

```diff
// You need to activate your PSPDFKit before you can use it.
// Follow the instructions in the email you get after licensing the framework.
- pspdfkit.setLicenseKey("LICENSE_KEY_GOES_HERE");
+ pspdfkit.setLicenseKey("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
```

Finally, it's time to run the app. Running the build command with an empty `--device-id` will cause Titanium CLI to list all available simulator devices and ask you to choose one.

```bash
# Go to the app directory.
$ cd MyApp

# Build and run the app.
$ titanium build --platform ios --device-id
```

Should something go wrong with the build, add `--log-level trace` to the above command to enable additional logging. Alternatively, you can also prefix it with `DEBUG=*` (like `DEBUG=* titanium build...`).

## Using the Module

To use PSPDFKit for iOS Titanium module in your code, require it first and then create a view using `createView` function:

```js
const PSPDFKit = require("com.pspdfkit")

const view = PSPDFKit.createView({
    filename: "PSPDFKit.pdf",
    options: {
        pageMode: 0, // PSPDFPageModeSingle
        pageTransition: 2, // PSPDFPageCurlTransition
    },
    documentOptions: {
        title: "Custom Title",
    },
})
```

Please refer to the documentation comments in [ComPspdfkitModule.h](Classes/ComPspdfkitModule.h) and [ComPspdfkitViewProxy.h](Classes/ComPspdfkitViewProxy.h) to learn more about the available API.

## Troubleshooting

### Errors While Running the Build Script

```none
internal/modules/cjs/loader.js:983
  throw err;
  ^

Error: Cannot find module 'chalk'
```

The build script requires a couple of handy Node.js modules to work. If you see a similar error when running the build script, make sure to run `npm install` first in the cloned directory. See [configuring the environment](#configuring-the-environment) section to learn more.

### Using Different Versions of Titanium SDK

The Titanium SDK version you use to build the module must be the same version that you use to build your app (specified by `<sdk-version>` in `tiapp.xml`). You can explicitly set the Titanium SDK version the module is built against by passing `--sdk` option to the build script:

```bash
# Use Titanium SDK 9.0.0.GA to build the module.
$ node script/bootstrap.js build --sdk 9.0.0.GA
```

If you want to install the minimal version that PSPDFKit for iOS Titanium module requires, you can ask the build script for it:

```bash
# Install the minimal required version of Titanium SDK.
$ titanium sdk install $(node scripts/bootstrap.js versions --just titanium)
```

### Using Local Titanium Binaries

If you're unable to install Titanium or Appcelerator CLI globally using `npm install -g`, you can instead rely on the local binaries by taking advantage of [npx](https://www.npmjs.com/package/npx). Just prefix all your `titanium` and `appc` commands with `npx`:

```bash
# Use the locally installed Titanium CLI binary.
$ npx titanium --help

# Use the locally installed Appcelerator CLI binary.
$ npx appc --help
```

### Build Errors

```none
[ERROR] ** BUILD FAILED **
[ERROR] The following build commands failed:
[ERROR]  Ld build/Products/Debug-iphonesimulator/MyApp.app/MyApp normal x86_64
[ERROR]  (1 failure)
```

If you see a similar error when running the project, it's likely because the PSPDFKit for iOS Titanium module was not included in your project's `tiapp.xml`. Please refer to [importing the module](#importing-the-module) section to learn more.

## License

This project can be used for evaluation or if you have a valid PSPDFKit for iOS license. All items and source code Copyright © 2010-2021 PSPDFKit GmbH. See [LICENSE](LICENSE) for details.

## Contributing

Please make sure [you signed our Contributor License Agreement](https://pspdfkit.com/guides/web/current/miscellaneous/contributing/) so we can accept your contributions.
