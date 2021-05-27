const { join } = require('path');
const { format } = require('url');

const { BrowserWindow, app, Menu, dialog } = require('electron');
const isDev = require('electron-is-dev');
const prepareNext = require('electron-next');
const { isEmpty, head } = require('lodash');

const { initializeIpcEvents } = require('./ipc');

const createWindow = () =>
  new BrowserWindow({
    width: 1200,
    height: 760,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

const openWindow = (win, baseDir) => {
  const dir = encodeURIComponent(baseDir);
  const url = isDev
    ? `http://localhost:8000?baseDir=${dir}`
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });
  win.loadURL(url);
};

const createTemplate = (win) =>
  Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'Command+O',
          click: () => {
            dialog
              .showOpenDialog({ properties: ['openDirectory'] })
              .then((res) => {
                const { filePaths } = res;
                if (!isEmpty(filePaths)) {
                  win.webContents.send('navigate', head(filePaths));
                }
              });
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', accelerator: 'Command+R' },
        { role: 'toggleDevTools', accelerator: 'F12' },
        { role: 'togglefullscreen' },
      ],
    },
  ]);

app.on('ready', async () => {
  await prepareNext('./renderer');

  const win = createWindow();

  Menu.setApplicationMenu(createTemplate(win));

  initializeIpcEvents(win);

  openWindow(win, '');
});

// app.whenReady().then(() => {});

app.on('window-all-closed', app.quit);
