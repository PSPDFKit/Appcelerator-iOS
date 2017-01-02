/**
 * Copyright Appcelerator 2016
 */

Array.prototype.last = Array.prototype.last || function () {
	return this[this.length - 1];
};

exports.id = 'ti.dynamiclib';
exports.cliVersion = '>=3.2';
exports.init = function (logger, config, cli, appc) {
	cli.on('build.ios.xcodeproject', {
		pre: function (data) {

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
			addLibrary(builder, cli, xobjs);
		}
	});
};

function addLibrary(builder, cli, xobjs) {

	var frameworkPaths = [
		'../../Resources/iphone/PSPDFKit.framework'
	];

	frameworkPaths.forEach(function (framework_path) {
		var framework_name = framework_path.split('/').last();

		// B6CE2C7E1C90C08400B37C55
		var frameword_uuid = builder.generateXcodeUuid();

		// B6CE2C7F1C90C08400B37C55
		var embededFrameword_uuid = builder.generateXcodeUuid();

		// B6CE2C7D1C90C08400B37C55
		var fileRef_uuid = builder.generateXcodeUuid();

		// B6CE2C801C90C08400B37C55
		var embededFrameword_copy_uuid = builder.generateXcodeUuid();

		createPBXBuildFile(xobjs, frameword_uuid, fileRef_uuid, embededFrameword_uuid, framework_name);
		createPBXCopyFilesBuildPhase(xobjs, embededFrameword_copy_uuid, embededFrameword_uuid, framework_name);
		createPBXFileReference(xobjs, fileRef_uuid, framework_path, framework_name);
		createPBXFrameworksBuildPhase(xobjs, frameword_uuid, framework_name);
		createPBXGroup(xobjs, fileRef_uuid, framework_name);
		createPBXNativeTarget(xobjs, embededFrameword_copy_uuid);
	});
}

function createPBXBuildFile(xobjs, frameword_uuid, fileRef_uuid, embededFrameword_uuid, framework_name) {

	/**
	 *	// WowzaGoCoderSDK.framework in Frameworks
	 *	B6CE2C7E1C90C08400B37C55 = {
	 *		isa = PBXBuildFile;
	 *		// WowzaGoCoderSDK.framework
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
	 *	// WowzaGoCoderSDK.framework in Embed Frameworks
	 *	B6CE2C7F1C90C08400B37C55 = {
	 *		isa = PBXBuildFile;
	 *		// WowzaGoCoderSDK.framework
	 *		fileRef = B6CE2C7D1C90C08400B37C55
	 *		settings = {
	 *			ATTRIBUTES = [CodeSignOnCopy, RemoveHeadersOnCopy]
	 *		}
	 *	}
	 */
	xobjs.PBXBuildFile[embededFrameword_uuid] = {
		isa: 'PBXBuildFile',
		fileRef: fileRef_uuid,
		fileRef_comment: framework_name + ' in Embed Frameworks',
		settings: {
			ATTRIBUTES: ['CodeSignOnCopy', 'RemoveHeadersOnCopy']
		}
	};
	xobjs.PBXBuildFile[embededFrameword_uuid][embededFrameword_uuid + '_comment'] = 'MyFramework in Embed Frameworks';

}

function createPBXCopyFilesBuildPhase(xobjs, embededFrameword_copy_uuid, embededFrameword_uuid, framework_name) {

	/**
	 *	B6CE2C801C90C08400B37C55 = {
	 *		isa = PBXCopyFilesBuildPhase;
	 *		buildActionMask = 2147483647;
	 *		dstPath = "";
	 *		dstSubfolderSpec = 10;
	 *		files = (
	 *			// WowzaGoCoderSDK.framework in Embed Frameworks
	 *			B6CE2C7F1C90C08400B37C55,
	 *		);
	 *		name = "Embed Frameworks";
	 *		runOnlyForDeploymentPostprocessing = 0;
	 *	};
	 */
	xobjs.PBXCopyFilesBuildPhase = xobjs.PBXCopyFilesBuildPhase || {};
	xobjs.PBXCopyFilesBuildPhase[embededFrameword_copy_uuid] = {
		isa: 'PBXCopyFilesBuildPhase',
		buildActionMask: '2147483647',
		dstPath: '""',
		dstSubfolderSpec: '10',
		files: [{
			value: embededFrameword_uuid + '',
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
	 *		name = WowzaGoCoderSDK.framework;
	 *		path = ../../modules/iphone/com.janx.wowza/1/platform/WowzaGoCoderSDK.framework;
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

function createPBXNativeTarget(xobjs, embededFrameword_copy_uuid) {
	for (var key in xobjs.PBXNativeTarget) {
		xobjs.PBXNativeTarget[key].buildPhases.push({
			value: embededFrameword_copy_uuid + '',
			comment: 'Embed Frameworks'
		});
		return;
	}
}
