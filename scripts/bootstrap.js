//
//  Copyright (c) 2011-2021 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY AUSTRIAN COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

const _ = require("lodash")
const chalk = require("chalk")
const cp = require("child-process-async")
const fs = require("fs-extra")
const path = require("path")
const shellescape = require("shell-escape")
const yargs = require("yargs")

/**
 * Prepare and build the PSPDFKit Titanium module.
 * @param {BuildCommandArgv} argv Arguments to the build command.
 * @returns {Promise<Boolean>} Value indicating whether the command succeeded.
 */
async function buildCommand(argv) {

    // These are the shared options we will use in all command spawns.

    const srcroot = path.resolve(__dirname, "../")
    const spawnOptions = { cwd: srcroot, verbose: argv.verbose }

    // STEP 1: Determine the required version of PSPDFKit and Titanium SDK based
    // on the values in `manifest` file. These versions will be used to compile
    // the module later.

    console.log(chalk.blue.bold(`Determining PSPDFKit and Titanium SDK versions...`))

    // Load the manifest file and look for `version` and `minsdk` keys in it. If
    // they're in there, the match variables should contain them at index 1.

    let manifestPath = path.resolve(srcroot, "manifest")
    let manifestContents = fs.readFileSync(manifestPath, "utf-8")

    let pspdfkitVersionMatch = manifestContents.match(/version: (.+)\n/)
    let titaniumVersionMatch = manifestContents.match(/minsdk: (.+)\n/)

    if (pspdfkitVersionMatch.length != 2 ) {
        console.error(chalk.red(`Could not determine required PSPDFKit version.`))
        console.error(chalk.red(`Make sure 'manifest' file contains a valid value for 'version'.`))
        return false
    }

    if (titaniumVersionMatch.length != 2 ) {
        console.error(chalk.red(`Could not determine required Titanium SDK version.`))
        console.error(chalk.red(`Make sure 'manifest' file contains a valid value for 'minsdk'.`))
        return false
    }

    let pspdfkitVersion = pspdfkitVersionMatch[1]
    let titaniumVersion = titaniumVersionMatch[1]

    // Overwrite Titanium SDK version from argv if needed.

    if (argv.sdk) {
        titaniumVersion = argv.sdk
    }

    console.log(chalk.green(`Using PSPDFKit ${pspdfkitVersion} for iOS.`))
    console.log(chalk.green(`Using Titanium SDK ${titaniumVersion}.`))

    // STEP 2: Make sure `xcodebuild`, `pod` and `titanium` are installed. Also
    // make sure that the required Titanium SDK version is installed.

    console.log(chalk.blue.bold(`Making sure all required tools are installed...`))

    // Check that Xcode CLT are installed. Xcode alone is not enough.

    let xcodeInstalled = await which("xcodebuild", spawnOptions)

    if (!xcodeInstalled) {
        console.error(chalk.red(`Xcode Command-Line Tools are not installed.`))
        console.error(chalk.red(`Please run \`sudo xcode-select --install\` first and try again.`))
        return false
    }

    // If Xcode license has not been accepted, `xcrun` will fail with a message
    // that includes the wotd `license` in it. Homebrew checks for this in the
    // same way.

    let xcodeLicenseResult = await spawn("xcrun", ["clang"], _.extend({}, spawnOptions, { validate: false }))
    let xcodeLicenseAccepted = xcodeLicenseResult.stderr.toString().match(/license/g) == null

    if (!xcodeLicenseAccepted) {
        console.error(chalk.red(`Xcode license has not been accepted.`))
        console.error(chalk.red(`Please run \`sudo xcodebuild -license accept\` first and try again.`))
        return false
    }

    let xcodeVersionResult = await spawn("xcodebuild", ["-version"], spawnOptions)
    let xcodeVersion = _.trim(xcodeVersionResult.stdout.toString()).match(/Xcode (.+)\n/)[1]

    console.log(chalk.green(`Xcode Command-Line Tools ${xcodeVersion} are installed.`))

    // Check that CocoaPods is installed globally.

    let cocoapodsInstalled = await which("pod", spawnOptions)

    if (!cocoapodsInstalled) {
        console.error(chalk.red(`CocoaPods is not installed.`))
        console.error(chalk.red(`Please run \`gem install cocoapods\` first and try again.`))
        return false
    }

    let cocoapodsVersionResult = await spawn("pod", ["--version"], spawnOptions)
    let cocoapodsVersion = _.trim(cocoapodsVersionResult.stdout)

    console.log(chalk.green(`CocoaPods ${cocoapodsVersion} is installed.`))

    // Check that the required Titanium SDK is installed and grab its root. We'll
    // use it later to generate xcconfig files.

    let titaniumBin = path.resolve(srcroot, "node_modules", ".bin", "titanium")

    let titaniumSdksResult = await spawn(titaniumBin, ["sdk", "list", "-o", "json"], spawnOptions)
    let titaniumSdkroot = JSON.parse(titaniumSdksResult.stdout)["installed"][titaniumVersion]

    if (!_.isString(titaniumSdkroot) || !fs.existsSync(titaniumSdkroot)) {
        console.error(chalk.red(`Titanium SDK ${titaniumVersion} is not installed.`))
        console.error(chalk.red(`Please run \`npx titanium sdk install ${titaniumVersion}\` first and try again.`))
        return false
    }

    console.log(chalk.green(`Titanium SDK ${titaniumVersion} is installed.`))

    // STEP 3: Download PSPDFKit and PSPDFKitUI binaries using CocoaPods. To do
    // that, we generate a Podfile with the provided customer key and the version
    // we determined in step 1.

    console.log(chalk.blue.bold(`Downloading PSPDFKit binaries...`))

    // Generate a Podfile from the template.

    let podfileTemplatePath = path.resolve(__dirname, "templates", "podfile")
    let podfileGeneratedPath = path.resolve(srcroot, "Podfile")
    let podfileData = { version: pspdfkitVersion }

    try {
        await copyTemplateFile(podfileTemplatePath, podfileGeneratedPath, podfileData)
    } catch (error) {
        console.error(chalk.red(`Failed to generate a Podfile at '${podfileGeneratedPath}'.`))
        console.error(chalk.red(`Please make sure this script has read-write access to the above location.`))
        return false
    }

    console.log(chalk.green(`Generated a Podfile at '${podfileGeneratedPath}'.`))

    // Let CocoaPods resolve and download PSPDFKit. Podfile is configured to not
    // integrate targets so it won't mess up the Xcode project.

    try {
        await spawn("pod", ["install", `--project-directory=${srcroot}`, "--no-ansi", "--verbose"], spawnOptions)
    } catch (error) {
        console.error(chalk.red(`Failed to download PSPDFKit binaries.`))
        console.error(chalk.red(`Please make sure that you have Internet connection.`))
        return false
    }

    // Copy PSPDFKit binaries to their expected location.

    let podsPath = path.resolve(srcroot, "Pods", "PSPDFKit")
    let pspdfkitSourcePath = path.resolve(podsPath, "PSPDFKit.xcframework")
    let pspdfkituiSourcePath = path.resolve(podsPath, "PSPDFKitUI.xcframework")

    let platformPath = path.resolve(srcroot, "platform")
    let pspdfkitDestinationPath = path.resolve(platformPath, "PSPDFKit.xcframework")
    let pspdfkituiDestinationPath = path.resolve(platformPath, "PSPDFKitUI.xcframework")

    try {
        if (fs.pathExistsSync(pspdfkitDestinationPath)) {
            fs.rmdirSync(pspdfkitDestinationPath, { recursive: true })
        }
        fs.ensureDirSync(pspdfkitDestinationPath)
        fs.copySync(pspdfkitSourcePath, pspdfkitDestinationPath)
    } catch (error) {
        console.error(chalk.red(`Failed to copy PSPDFKit binary from '${pspdfkitSourcePath}' to '${platformPath}'.`))
        console.error(chalk.red(`Please make sure this script has read-write access to the above locations.`))
        return false
    }

    try {
        if (fs.pathExistsSync(pspdfkituiDestinationPath)) {
            fs.rmdirSync(pspdfkituiDestinationPath, { recursive: true })
        }
        fs.ensureDirSync(pspdfkituiDestinationPath)
        fs.copySync(pspdfkituiSourcePath, pspdfkituiDestinationPath)
    } catch (error) {
        console.error(chalk.red(`Failed to copy PSPDFKitUI binary from '${pspdfkituiSourcePath}' to '${platformPath}'.`))
        console.error(chalk.red(`Please make sure this script has read-write access to the above locations.`))
        return false
    }

    console.log(chalk.green(`Successfully downloaded PSPDFKit binaries to '${platformPath}'.`))

    // STEP 4: Generate xcconfig files.

    console.log(chalk.blue.bold(`Generating build configuration files...`))

    // Save the Titanium SDK root to titanium.xcconfig. We use this value in
    // search paths.

    let titaniumXcconfigSrcPath = path.resolve(__dirname, "templates", "titanium.xcconfig")
    let titaniumXcconfigDstPath = path.resolve(srcroot, "titanium.xcconfig")
    let titaniumXcconfigData = { titanium_sdkroot: titaniumSdkroot }

    try {
        await copyTemplateFile(titaniumXcconfigSrcPath, titaniumXcconfigDstPath, titaniumXcconfigData)
    } catch (error) {
        console.error(chalk.red(`Failed to generate a Titanium SDK xcconfig file at '${titaniumXcconfigDstPath}'.`))
        console.error(chalk.red(`Please make sure this script has read-write access to the above location.`))
        return false
    }

    console.log(chalk.green(`Generated a Titanium SDK xcconfig file at '${titaniumXcconfigDstPath}'.`))

    // Steal CocoaPods's OTHER_LDFLAGS into module.xcconfig file since it for
    // sure is up-to-date. Titanium will use this file to link the module static
    // library later on.

    let cocoapodsXcconfigPath = path.resolve(srcroot, "Pods", "Target Support Files", "PSPDFKit", "PSPDFKit.release.xcconfig")
    let cocoapodsXcconfigContents = await fs.readFile(cocoapodsXcconfigPath, "utf-8")
    let cocoapodsLdflagsMatch = cocoapodsXcconfigContents.match(/OTHER_LDFLAGS ?= ?(.+)\n/)

    if (cocoapodsLdflagsMatch.length != 2 ) {
        console.error(chalk.red(`Could not extract 'OTHER_LDFLAGS' from CocoaPods supporting files.`))
        return false
    }

    let ldflagsValue = cocoapodsLdflagsMatch[1]

    let moduleXcconfigSrcPath = path.resolve(__dirname, "templates", "module.xcconfig")
    let moduleXcconfigDstPath = path.resolve(srcroot, "module.xcconfig")
    let moduleXcconfigData = { other_ldflags: ldflagsValue }

    try {
        await copyTemplateFile(moduleXcconfigSrcPath, moduleXcconfigDstPath, moduleXcconfigData)
    } catch (error) {
        console.error(chalk.red(`Failed to generate a module xcconfig file at '${moduleXcconfigGeneratedPath}'.`))
        console.error(chalk.red(`Please make sure this script has read-write access to the above location.`))
        return false
    }

    console.log(chalk.green(`Generated a module xcconfig file at '${moduleXcconfigDstPath}'.`))

    // STEP 5: Build the Titanium module.

    console.log(chalk.blue.bold("Building PSPDFKit module..."))

    // Delegate compiling to Titanium CLI. Sometimes Titanium CLI will mess up
    // the prompt, so we also reset the ANSI escape codes just in case.

    try {
        await spawn(titaniumBin, ["build", "--project-dir", srcroot, "--build-only", "--platform", "ios", "--sdk", titaniumVersion, "--log-level", "trace", "--no-banner", "--no-progress-bars", "--no-prompts"], spawnOptions)
        process.stdout.write(chalk.reset())
    } catch (error) {
        console.error(chalk.red("Failed to build PSPDFKit Titanium module."))
        return false;
    }

    console.log(chalk.green(`Successfully compiled the module.`))

    // Unzip the compiled module into the Titanium shared search path.

    let mozuleZipPath = path.resolve(srcroot, "dist", `com.pspdfkit-iphone-${pspdfkitVersion}.zip`)
    let moduleDestinationPath = path.resolve(process.env.HOME, "Library", "Application Support", "Titanium")

    try {
        await spawn("unzip", ["-o", mozuleZipPath, "-d", moduleDestinationPath], spawnOptions)
    } catch (error) {
        console.error(chalk.red(`Failed to unzip the built PSPDFKit Titanium module from '${mozuleZipPath}' to '${moduleDestinationPath}'.`))
        console.error(chalk.red("Please make sure this script has read-write access to the above locations."))
        return false
    }

    console.log(chalk.green(`Extracted the module to '${moduleDestinationPath}'.`))

    // TADA!

    return true

}

/**
 * Display information about required versions.
 * @param {VersionsCommandArgv} argv Arguments to the build command.
 * @returns {Promise<Boolean>} Value indicating whether the command succeeded.
 */
async function versionsCommand(argv) {

    // These are the shared options we will use in all command spawns.

    const srcroot = path.resolve(__dirname, "../")
    const spawnOptions = { cwd: srcroot, verbose: false }

    // Load the manifest file and look for `version` and `minsdk` keys in it. If
    // they're in there, the match variables should contain them at index 1.

    let manifestPath = path.resolve(srcroot, "manifest")
    let manifestContents = fs.readFileSync(manifestPath, "utf-8")

    let pspdfkitVersionMatch = manifestContents.match(/version: (.+)\n/)
    let titaniumVersionMatch = manifestContents.match(/minsdk: (.+)\n/)

    if (pspdfkitVersionMatch.length != 2 ) {
        console.error(chalk.red(`Could not determine required PSPDFKit version.`))
        console.error(chalk.red(`Make sure 'manifest' file contains a valid value for 'version'.`))
        return false
    }

    if (titaniumVersionMatch.length != 2 ) {
        console.error(chalk.red(`Could not determine required Titanium SDK version.`))
        console.error(chalk.red(`Make sure 'manifest' file contains a valid value for 'minsdk'.`))
        return false
    }

    let pspdfkitVersion = pspdfkitVersionMatch[1]
    let titaniumVersion = titaniumVersionMatch[1]

    // Parse the Podfile template since it contains the minimum iOS deployment
    // target. If the command fails, it means CocoaPods is not installed.

    let podfileTemplatePath = path.resolve(__dirname, "templates", "podfile")
    let podfileJsonResult;

    try {
        podfileJsonResult = await spawn("pod", ["ipc", "podfile-json", podfileTemplatePath], spawnOptions)
    } catch (error) {
        console.error(chalk.red(`CocoaPods is not installed.`))
        console.error(chalk.red(`Please run \`gem install cocoapods\` first and try again.`))
        return false
    }

    let iosVersion = JSON.parse(podfileJsonResult.stdout)["target_definitions"][0]["platform"]["ios"]

    // Respect the just option.

    if (_.isString(argv.just)) {
        if (argv.just == "pspdfkit") {
            console.log(pspdfkitVersion)
        } else if (argv.just == "titanium") {
            console.log(titaniumVersion)
        } else if (argv.just == "ios") {
            console.log(iosVersion)
        }
    } else {
        console.log(`PSPDFKit: ${pspdfkitVersion}`)
        console.log(`Titanium SDK: ${titaniumVersion}`)
        console.log(`iOS Deployment Target: ${iosVersion}`)
    }

    // TADA!

    return true

}

// Helpers.

/**
 * Copies a file from `source` to `destination`, compiling it as a template
 * along the way.
 * @param {PathLike} source Source file location.
 * @param {PathLike} destination Destination file location.
 * @param {Object} data Template data to use.
 */
async function copyTemplateFile(source, destination, data) {
    let template = await fs.readFile(source, "utf-8")
    let compiled = _.template(template)(data)
    await fs.writeFile(destination, compiled)
}

/**
 * Extracts metadata of a dSYM file based on its file name.
 * @param {PathLike} path Location of the dSYM file.
 * @returns {DsymMetadata} Metadata of a dSYM file.
 */
function interpretDsym(source) {
    let filename = path.basename(source)
    let components = _.split(filename, ".")
    if (components.length != 4) {
        throw new Error(`The dSYM file name '${filename}' is invalid.`)
    }
    return {
        name: `${components[0]}.${components[1]}`,
        arch: components[2],
    }
}

/**
 * Reads contents of `source` directory.
 * @param {PathLike} source Directory location.
 * @param {ReadDirOptions} options Reading options.
 * @returns {Array<PathLike>} Locations of files inside `source` directory.
 */
function readDir(source, options) {
    options = _.defaults({}, options, { subdirs: false })
    return fs.readdirSync(source).map(name => path.resolve(source, name)).filter(path => {
        if (options.subdirs) {
            return fs.statSync(path).isDirectory()
        } else {
            return true
        }
    })
}

/**
 * Spawns a child process as a promise. Each value in `arguments` is shell-
 * escaped. If `verbose` is `true`, the full invocation and process's output is
 * printed, otherwise it's muted but still available in the returned value.
 * @param {String} command Command to spawn.
 * @param {Array<String>} arguments Arguments of `command`.
 * @param {SpawnOptions} options Spawn options of `command`.
 * @returns {Promise<ChildProcess>} The spawned child process.
 */
async function spawn(command, arguments, options) {
    options = _.defaults({}, options, { verbose: false, validate: true })
    if (options.verbose) {
        let envs = _.map(options.env, (value, key) => `${key}=${shellescape([value])}`)
        let invocation = _.concat(envs, [command], [shellescape(arguments)]).join(" ")
        console.log(`$ ${invocation}`)
    }
    let child = cp.spawn(command, arguments, {
        env: _.defaults({}, options.env, process.env),
        cwd: options.cwd || __dirname,
    })
    if (options.verbose) {
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stdout)
    }
    let result = await child
    if (result.exitCode != 0 && options.validate) {
        throw new Error(`The spawned command failed with status code ${result.exitCode}.`)
    } else {
        return result
    }
}

/**
 * Spawns a child `which` command and checks if the given `command` exists.
 * @param {String} command Command to check.
 * @param {SpawnOptions} options Spawn options of `which` command.
 * @returns {Promise<Boolean>} Value indicating whether `command` exists.
 */
async function which(command, options) {
    options = _.extend({}, options, { validate: false })
    let which = await spawn("which", [command], options)
    return which.exitCode == 0
}

// Declare custom types for JSDoc comments.

/**
 * @typedef {{sdk?: String, verbose?: Boolean}} BuildCommandArgv
 * @typedef {import("child_process").ChildProcess} ChildProcess
 * @typedef {{name: String, arch: String}} DsymMetadata
 * @typedef {import("fs").PathLike} PathLike
 * @typedef {subdirs?: Boolean} ReadDirOptions
 * @typedef {{validate?: Boolean, cwd?: String, env?: NodeJS.ProcessEnv, verbose?: Boolean}} SpawnOptions
 * @typedef {{just?: String}} VersionsCommandArgv
 */

// Let Yargs handle the CLI frontend.

yargs
    .command({
        command: "build",
        describe: "Build the PSPDFKit Titanium module.",
        builder: {
            "sdk": {
                type: "string",
                describe: "Titanium SDK version to use.",
            },
            "verbose": {
                type: "boolean",
                describe: "Enable additional logging.",
                default: false,
            }
        },
        handler: buildCommand,
    })
    .command({
        command: "versions",
        describe: "Display information about required versions.",
        builder: {
            "just": {
                type: "string",
                describe: "Just one version.",
                choices: ["pspdfkit", "titanium", "ios"],
            },
        },
        handler: versionsCommand,
    })
    .onFinishCommand((result) => {
        if (_.isBoolean(result) && !result) {
            console.error(chalk.red(`Run this command again with '--verbose' to enable additional logging.`))
            process.exit(1)
        }
    })
    .demandCommand()
    .help("help", "Show help for the given command.")
    .showHelpOnFail(false, "Use --help to learn available options.")
    .version(false)
    .strict()
    .argv
