import path from 'node:path';
import { promisify } from 'node:util';
import childProcess from 'node:child_process';
import { fileURLToPath } from 'node:url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const execFile = promisify(childProcess.execFile);
// const binary = path.join(__dirname, '../main');
let binary = null;

const parseMac = stdout => {
	try {
		return JSON.parse(stdout);
	} catch (error) {
		console.error(error);
		throw new Error('Error parsing window data');
	}
};

const getArguments = options => {
	if (!options) {
		return [];
	}

	const arguments_ = [];
	if (options.accessibilityPermission === false) {
		arguments_.push('--no-accessibility-permission');
	}

	if (options.screenRecordingPermission === false) {
		arguments_.push('--no-screen-recording-permission');
	}

	return arguments_;
};

export async function activeWindow(options, isPackaged=null) {
	console.log("isPackaged",isPackaged)
	if (isPackaged)
		binary = path.join(process.resourcesPath, './main')
	else
		binary = path.join(__dirname, '../main');

	const { stdout } = await execFile(binary, getArguments(options));
	return parseMac(stdout);
}

export function activeWindowSync(options, isPackaged=null) {
	if (isPackaged)
		binary = path.join(process.resourcesPath, './main')
	else
		binary = path.join(__dirname, '../main');

	const stdout = childProcess.execFileSync(binary, getArguments(options), { encoding: 'utf8' });
	return parseMac(stdout);
}

export async function openWindows(options ,isPackaged=null) {	
	if (isPackaged)
		binary = path.join(process.resourcesPath, './main')
	else
		binary = path.join(__dirname, '../main');

	const { stdout } = await execFile(binary, [...getArguments(options), '--open-windows-list']);
	return parseMac(stdout);
}

export function openWindowsSync(options,isPackaged=null) {	
	if (isPackaged)
		binary = path.join(process.resourcesPath, './main')
	else
		binary = path.join(__dirname, '../main');

	const stdout = childProcess.execFileSync(binary, [...getArguments(options), '--open-windows-list'], { encoding: 'utf8' });
	return parseMac(stdout);
}
