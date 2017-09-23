/**
 * Ti.DynamicLib
 * @abstract Support embedded binaries (aka dynamic libraries) in Titanium modules and Hyperloop.
 * @version 1.1.0
 * 
 * Install: 
 * 1) Search and replace '../../src/<YourFramework>.framework' with your framework location.
      The path is relative to the `build/iphone` directory.
 * 2a) For classic modules: 
 *       - Add 'LD_RUNPATH_SEARCH_PATHS=$(inherited) "@executable_path/Frameworks" $(FRAMEWORK_SEARCH_PATHS)'
 *         to your module.xcconfig
 *       - Place this file (ti.dynamiclib.js) in `<your-module-ios-root>/hooks`
 *    
 * 2b) For Hyperloop (will be automated in future Hyperloop versions - Follow TIMOB-23853): 
 *       - Add the above to the `hyperloop.ios.xcodebuild.flags` object of your appc.js
 *       - Place this file (ti.dynamiclib.js) in `<your-projecz-root>/plugins/ti.dynamiclib/hooks`
 *
 * 3) Some frameworks include Simulator architectures ("fat libraries"). Those frameworks usually provide a 
 *    script to strip the unused frameworks for distribution, e.g. `strip-framework.sh`. If you use such a 
 *    framework, adjust the path of the variable `scriptPath`, otherwise `null` it to skip the build script phase.
 *
 * 4) That's it! You can check an example integration in the Ti.Flic module (https://github.com/hansemannn/ti.flic)
 *
 * @copyright 2016-2017 Appcelerator
 */

Array.prototype.last = Array.prototype.last || function () {
	return this[this.length - 1];
};

exports.id = 'ti.dynamiclib';
exports.cliVersion = '>=3.2';
exports.init = function (logger, config, cli, appc) {
	cli.on('build.ios.xcodeproject', {
		pre: function (data) {
			
			// Replace the following variables with your framework / script:
			// ---
			var scriptPath = '$BUILT_PRODUCTS_DIR/$FRAMEWORKS_FOLDER_PATH/PSPDFKit.framework/strip-framework.sh'; // Or set to null if not required
			var frameworkPaths = [
        			// Replace with the path of your embedded framework. Make sure the path is relative to `build/iphone`
				'../../Resources/iphone/PSPDFKit.framework',
				'../../Resources/iphone/PSPDFKitUI.framework'
			];
			// ---
			
			var builder = this;
			var xcodeProject = data.args[0];
			var xobjs = xcodeProject.hash.project.objects;

			if (typeof builder.generateXcodeUuid !== 'function') {
				var uuidIndex = 1;
				var uuidRegExp = /^(0{18}\d{6})$/;
				var lpad = appc.string.lpad;

				Object.keys(xobjs).forEach(function (section) {
					Object.keys(xobjs[section]).forEach(function (uuid) {
						var m = uuid.match(uuidRegExp);
						var n = m && parseInt(m[1]);
						if (n && n > uuidIndex) {
							uuidIndex = n + 1;
						}
					});
				});

				builder.generateXcodeUuid = function generateXcodeUuid() {
					return lpad(uuidIndex++, 24, '0');
				};
			}
			addLibrary(builder, cli, xobjs, frameworkPaths);
			addScriptBuildPhase(builder, scriptPath, xobjs);
		}
	});
};

function addLibrary(builder, cli, xobjs, frameworkPaths) {
	if (!frameworkPaths || frameworkPaths.length == 0) {
	    return; // Skip if no frameworks are specified
	}
	
	frameworkPaths.forEach(function (framework_path) {
		var framework_name = framework_path.split('/').last();

		// B6CE2C7E1C90C08400B37C55
		var frameword_uuid = builder.generateXcodeUuid();

		// B6CE2C7F1C90C08400B37C55
		var embeddedFrameword_uuid = builder.generateXcodeUuid();

		// B6CE2C7D1C90C08400B37C55
		var fileRef_uuid = builder.generateXcodeUuid();

		// B6CE2C801C90C08400B37C55
		var embeddedFrameword_copy_uuid = builder.generateXcodeUuid();

		createPBXBuildFile(xobjs, frameword_uuid, fileRef_uuid, embeddedFrameword_uuid, framework_name);
		createPBXCopyFilesBuildPhase(xobjs, embeddedFrameword_copy_uuid, embeddedFrameword_uuid, framework_name);
		createPBXFileReference(xobjs, fileRef_uuid, framework_path, framework_name);
		createPBXFrameworksBuildPhase(xobjs, frameword_uuid, framework_name);
		createPBXGroup(xobjs, fileRef_uuid, framework_name);
		createPBXNativeTarget(xobjs, embeddedFrameword_copy_uuid);
	});
}

function addScriptBuildPhase(builder, scriptPath, xobjs) {
	if (!scriptPath) return;
	
	var script_uuid = builder.generateXcodeUuid();
	var shell_path = '/bin/sh';
	var shell_script = 'bash \"' + scriptPath + '\"';

	createPBXRunShellScriptBuildPhase(xobjs, script_uuid, shell_path, shell_script);
	createPBXRunScriptNativeTarget(xobjs, script_uuid);
}

function createPBXBuildFile(xobjs, frameword_uuid, fileRef_uuid, embeddedFrameword_uuid, framework_name) {

	/**
	 *	// <YourFramework>.framework in Frameworks
	 *	B6CE2C7E1C90C08400B37C55 = {
	 *		isa = PBXBuildFile;
	 *		// <YourFramework>.framework
	 *		fileRef = B6CE2C7D1C90C08400B37C55
	 *	};
	 */
	xobjs.PBXBuildFile[frameword_uuid] = {
		isa: 'PBXBuildFile',
		fileRef: fileRef_uuid,
		fileRef_comment: framework_name + ' in Frameworks'
	};
	xobjs.PBXBuildFile[frameword_uuid][frameword_uuid + '_comment'] = framework_name + ' in Frameworks';

	/**
	 *	// <YourFramework>.framework in Embed Frameworks
	 *	B6CE2C7F1C90C08400B37C55 = {
	 *		isa = PBXBuildFile;
	 *		// <YourFramework>.framework
	 *		fileRef = B6CE2C7D1C90C08400B37C55
	 *		settings = {
	 *			ATTRIBUTES = [CodeSignOnCopy, RemoveHeadersOnCopy]
	 *		}
	 *	}
	 */
	xobjs.PBXBuildFile[embeddedFrameword_uuid] = {
		isa: 'PBXBuildFile',
		fileRef: fileRef_uuid,
		fileRef_comment: framework_name + ' in Embed Frameworks',
		settings: {
			ATTRIBUTES: ['CodeSignOnCopy', 'RemoveHeadersOnCopy']
		}
	};
	xobjs.PBXBuildFile[embeddedFrameword_uuid][embeddedFrameword_uuid + '_comment'] = 'MyFramework in Embed Frameworks';

}

function createPBXCopyFilesBuildPhase(xobjs, embeddedFrameword_copy_uuid, embeddedFrameword_uuid, framework_name) {

	/**
	 *	B6CE2C801C90C08400B37C55 = {
	 *		isa = PBXCopyFilesBuildPhase;
	 *		buildActionMask = 2147483647;
	 *		dstPath = "";
	 *		dstSubfolderSpec = 10;
	 *		files = (
	 *			// <YourFramework>.framework in Embed Frameworks
	 *			B6CE2C7F1C90C08400B37C55,
	 *		);
	 *		name = "Embed Frameworks";
	 *		runOnlyForDeploymentPostprocessing = 0;
	 *	};
	 */
	xobjs.PBXCopyFilesBuildPhase = xobjs.PBXCopyFilesBuildPhase || {};
	xobjs.PBXCopyFilesBuildPhase[embeddedFrameword_copy_uuid] = {
		isa: 'PBXCopyFilesBuildPhase',
		buildActionMask: '2147483647',
		dstPath: '""',
		dstSubfolderSpec: '10',
		files: [{
			value: embeddedFrameword_uuid + '',
			comment: framework_name + ' in Embed Frameworks'
		}],
		name: '"Embed Frameworks"',
		runOnlyForDeploymentPostprocessing: 0
	};
}

function createPBXFileReference(xobjs, fileRef_uuid, framework_path, framework_name) {
	/**
	 *	B6CE2C7D1C90C08400B37C55 = {
	 *		isa = PBXFileReference;
	 *		lastKnownFileType = wrapper.framework;
	 *		name = <YourFramework>.framework;
	 *		path = ../../modules/iphone/com.janx.wowza/1/platform/<YourFramework>.framework;
	 *		sourceTree = "<group>";
	 *	};
	 */
	xobjs.PBXFileReference[fileRef_uuid] = {
		isa: 'PBXFileReference',
		lastKnownFileType: 'wrapper.framework',
		name: framework_name,
		path: framework_path,
		sourceTree: '"<group>"'
	};
}

function createPBXFrameworksBuildPhase(xobjs, frameword_uuid, framework_name) {
	/**
	 *	1D60588F0D05DD3D006BFB54 = {
	 *		isa = PBXFrameworksBuildPhase;
	 *		buildActionMask = 2147483647;
	 *		files = (
	 *			// MyFramework in Frameworks
	 *			B6CE2C7E1C90C08400B37C55,
	 *			more stuff
	 *		);
	 *	};
	 */
	for (var key in xobjs.PBXFrameworksBuildPhase) {
		xobjs.PBXFrameworksBuildPhase[key].files.push({
			value: frameword_uuid + '',
			comment: framework_name + ' in Frameworks'
		});
		return;
	}
}

function createPBXGroup(xobjs, fileRef_uuid, framework_name) {
	for (var key in xobjs.PBXGroup) {
		if (xobjs.PBXGroup[key].name == 'Frameworks') {
			xobjs.PBXGroup[key].children.push({
				value: fileRef_uuid,
				comment: framework_name
			});
			return;
		}
	}
}

function createPBXNativeTarget(xobjs, embeddedFrameword_copy_uuid) {
	for (var key in xobjs.PBXNativeTarget) {
		xobjs.PBXNativeTarget[key].buildPhases.push({
			value: embeddedFrameword_copy_uuid + '',
			comment: 'Embed Frameworks'
		});
		return;
	}
}

function createPBXRunShellScriptBuildPhase(xobjs, script_uuid, shell_path, shell_script){
	xobjs.PBXShellScriptBuildPhase = xobjs.PBXShellScriptBuildPhase || {};
	xobjs.PBXShellScriptBuildPhase[script_uuid] = { 
 		isa: 'PBXShellScriptBuildPhase', 
 		buildActionMask: '2147483647', 
 		files: '(\n)', 
 		inputPaths: '(\n)', 
 		outputPaths: '(\n)', 
 		runOnlyForDeploymentPostprocessing: 0, 
 		shellPath: shell_path, 
 		shellScript: JSON.stringify(shell_script) 
 	};
}

function createPBXRunScriptNativeTarget(xobjs, script_uuid) {
	for (var key in xobjs.PBXNativeTarget) {
		xobjs.PBXNativeTarget[key].buildPhases.push({ 
        		value: script_uuid + '', 
        		comment: 'Run Script Phase'
      		});
		return;
	}
}
