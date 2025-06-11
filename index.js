// I'll comment this code a bit cos going through it originally was a pita
// notice the setTimeout function thing - this is weird and i will rename it. it confused me
// it is necessary though, it kinda kickstarts everything

// screenshots are using a forked version of screenshot-desktop as i needed to make a small tweak

const { app, BrowserWindow, ipcMain, screen } = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const screenshot = require("screenshot-desktop");

function createWindow() {
// fairly obvious just gets all displays - returns an array
const displays = screen.getAllDisplays();
// getting bounds of each display
const x = Math.min(...displays.map((d) => d.bounds.x));
const y = Math.min(...displays.map((d) => d.bounds.y));

const maxRight = Math.max(...displays.map((d) => d.bounds.x + d.bounds.width));
const maxBottom = Math.max(...displays.map((d) => d.bounds.y + d.bounds.height));

const width = maxRight - x;
const height = maxBottom - y;

// After computing global bounds, log for debugging
console.log('Computed board bounds:', { x, y, width, height });
//now we create the main board window over all displays
const board = new BrowserWindow({
	x,
	y,
	width,
	height,
	enableLargerThanScreen: true,
	webPreferences: {
		nodeIntegration: true,
		devTools: true,
		contextIsolation: false,
	},
	transparent: true,
	frame: false,
	icon: path.join(__dirname, "/assets/Icon-512x512.png"),
});
console.log('Board window created');
board.loadFile("board.html");
	board.setResizable(false);

	setTimeout(() => {
	// Use setBounds again
	console.log('Applying bounds via setBounds:', { x, y, width, height });
	board.setBounds({ x, y, width, height }, true);
}, 10);

	const controller = new BrowserWindow({
		width: Math.floor(
			screen.getPrimaryDisplay().size.width * (1350 / 1920)
		),
		height: Math.floor(
			(((screen.getPrimaryDisplay().size.width * 1350) / 1920) * 1) / 11
		),
		webPreferences: {
			nodeIntegration: true,
			devTools: true,
			contextIsolation: false,
		},
		transparent: true,
		frame: false,
		skipTaskbar: true,
		parent: board,
		icon: "./assets/logo.png",
	});
	controller.setPosition(205, 40);
	controller.setAlwaysOnTop(true, "screen");
	controller.loadFile("controller.html");
	controller.setResizable(false);

	function openPicker(x, y) {
		const picker = new BrowserWindow({
			width: Math.floor(screen.getPrimaryDisplay().size.width / 6),
			height: Math.floor(
				((screen.getPrimaryDisplay().size.width / 6) * 19) / 16
			),
			webPreferences: {
				nodeIntegration: true,
				devTools: true,
				contextIsolation: false,
			},
			transparent: true,
			frame: false,
			skipTaskbar: true,
			parent: board,
			icon: "./assets/logo.png",
		});
		picker.setPosition(x, y);
		picker.setAlwaysOnTop(true, "screen");
		picker.loadFile("picker.html");
		picker.setResizable(false);
	}

	function openBackgroundDialog(x, y) {
		const dialog = new BrowserWindow({
			width: Math.floor(screen.getPrimaryDisplay().size.width / 6),
			height: Math.floor(
				((screen.getPrimaryDisplay().size.width / 6) * 11) / 8
			),
			webPreferences: {
				nodeIntegration: true,
				devTools: true,
				contextIsolation: false,
			},
			transparent: true,
			frame: false,
			skipTaskbar: true,
			parent: board,
			icon: "./assets/logo.png",
		});
		dialog.setPosition(x, y);
		dialog.setAlwaysOnTop(true, "screen");
		dialog.loadFile("background.html");
		dialog.setResizable(false);
	}

	controller.on("closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});

	board.on("closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});

	ipcMain.on("resetBoard", () => {
		board.webContents.send("resetBoard");
	});
	ipcMain.on("eraserMode", () => {
		board.webContents.send("eraserMode");
	});
	ipcMain.on("setMode", (e, arg) => {
		board.webContents.send("setMode", arg);
	});

	ipcMain.on("textMode", () => {
		board.webContents.send("textMode");
	});

	ipcMain.on("colSelect", (e, arg) => {
		board.webContents.send("colSelectFill", arg);
		board.webContents.send("colSelectStroke", arg);
	});
	ipcMain.on("colSelectFill", (e, arg) => {
		board.webContents.send("colSelectFill", arg);
	});
	ipcMain.on("customColor", (e, arg) =>
		openPicker(
			controller.getPosition()[0] +
				arg -
				Math.floor(screen.getPrimaryDisplay().size.width / 12),
			controller.getPosition()[1] + controller.getSize()[1] + 10
		)
	);
	ipcMain.on("colSubmit", (e, arg) => {
		controller.webContents.send("colSubmit", arg);
	});

	ipcMain.on("drawPolygon", () => {
		board.webContents.send("drawPolygon");
	});
	ipcMain.on("drawLine", () => {
		board.webContents.send("drawLine");
	});
	ipcMain.on("drawSquare", () => {
		board.webContents.send("drawSquare");
	});
	ipcMain.on("drawCircle", () => {
		board.webContents.send("drawCircle");
	});
	ipcMain.on("drawTriangle", () => {
		board.webContents.send("drawTriangle");
	});

	ipcMain.on("drawTick", () => {
		board.webContents.send("drawTick");
	});
	ipcMain.on("drawCross", () => {
		board.webContents.send("drawCross");
	});
	ipcMain.on("drawStar", () => {
		board.webContents.send("drawStar");
	});
	ipcMain.on("drawFreehand", () => {
		board.webContents.send("drawFreehand");
	});

	ipcMain.on("dragMode", () => {
		board.webContents.send("setMode", "drag");
		board.webContents.send("dragMode");
	});

	ipcMain.on("hideBoard", () => {
		board.hide();
		controller.setAlwaysOnTop(true, "screen");
	});
	ipcMain.on("showBoard", () => {
		board.show();
		controller.hide();
		controller.show();
	});

	ipcMain.on("minimizeWin", () => {
		board.show();
		controller.hide();
		controller.show();
		board.minimize();
	});
	ipcMain.on("closeWin", () => {
		board.close();
	});

	ipcMain.on("bgSelect", (e, arg) =>
		openBackgroundDialog(
			controller.getPosition()[0] +
				arg -
				Math.floor(screen.getPrimaryDisplay().size.width / 12),
			controller.getPosition()[1] + controller.getSize()[1] + 10
		)
	);
	ipcMain.on("bgUpdate", (e, arg) =>
		controller.webContents.send("bgUpdate", arg)
	);
	ipcMain.on("bgSubmit", (e, arg) => {
		board.webContents.send("bgSelect", arg);
		board.focus();
	});

	ipcMain.on("clearBoard", () => board.webContents.send("clearBoard"));

	ipcMain.on("laserCursor", () => {
		board.webContents.send("setMode", "laser");
		board.webContents.send("laserCursor");
	});

	ipcMain.on("undo", () => board.webContents.send("undo"));
	ipcMain.on("redo", () => board.webContents.send("redo"));

	ipcMain.on("screenshot", () => {
		let d = new Date();
		let screenshotPath = path.join(app.getPath("pictures"), "Pensela");
		if (!fs.existsSync(screenshotPath)) {
			fs.mkdirSync(screenshotPath, { recursive: true });
		}
		screenshot.listDisplays().then((displays) => {
			for (i in displays) {
				screenshot({
					screen: displays[i].id,
					filename:
						path.join(screenshotPath, "Screenshot ") +
						("0" + d.getDate()).slice(-2) +
						"-" +
						("0" + (d.getMonth() + 1)).slice(-2) +
						"-" +
						d.getFullYear() +
						" " +
						d.getHours() +
						"-" +
						d.getMinutes() +
						"-" +
						d.getSeconds() +
						"-" +
						"Display" +
						i +
						".png",
				});
			}
		});
		board.webContents.send("screenshot");
	});

	ipcMain.on("strokeIncrease", () =>
		board.webContents.send("strokeIncrease")
	);
	ipcMain.on("strokeDecrease", () =>
		board.webContents.send("strokeDecrease")
	);

	ipcMain.on("arrowSingle", () => board.webContents.send("arrowSingle"));
	ipcMain.on("arrowDouble", () => board.webContents.send("arrowDouble"));

	ipcMain.on("highlighter", () => board.webContents.send("highlighter"));

	if (os.platform() == "win32") {
		setTimeout(() => {
			board.minimize();
			board.restore();
			board.hide();
			board.show();
			controller.hide();
			controller.show();
		}, 1000);
	}
}

app.commandLine.appendSwitch("enable-transparent-visuals");
app.disableHardwareAcceleration();

app.whenReady().then(() => {
	os.platform() == "linux" ? setTimeout(createWindow, 1000) : createWindow();
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
