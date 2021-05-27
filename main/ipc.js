const util = require('util');
const { ipcMain } = require('electron');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);
const { map } = require('lodash/fp');
const { last, head, size } = require('lodash');

const findPaths = async (baseDir) => {
  const { stdout } = await exec(
    `find ${baseDir} -type d -name fe-* -maxdepth 1 | sort`
  );
  return stdout.trim().split(String.fromCharCode(10));
};

const setName = map((path) => ({ name: last(path.split('/')), path }));

const startFetchAysnc = (dir) => {
  Promise.all(
    dir.map(async (d) => {
      try {
        await exec(`git -C ${d.path} fetch`);
        return d;
      } catch (error) {
        return d;
      }
    })
  );
};

const setTagAsync = (branch, dir) =>
  Promise.all(
    dir.map(async (d) => {
      try {
        const { stdout } = await exec(
          `git -C ${d.path} describe remotes/origin/${branch}`
        );
        const tag = stdout.toString().trim().split('-');
        return { ...d, tag: head(tag), isWarning: size(tag) > 1 };
      } catch (error) {
        return { ...d, tag: null };
      }
    })
  );

const setLogAsync = (branch, dir) =>
  Promise.all(
    dir.map(async (d) => {
      try {
        if (d.isWarning) {
          const { stdout } = await exec(
            `git -C ${d.path} log --first-parent --oneline -n 10 remotes/origin/${branch}`
          );
          const log = stdout.trim().split(String.fromCharCode(10));
          return { ...d, log };
        } else {
          return { ...d, log: null };
        }
      } catch (error) {
        return { ...d, log: null };
      }
    })
  );

const startReadRepos = async (dir, branch, isWithFetch) => {
  if (isWithFetch) {
    await startFetchAysnc(dir);
  }
  const v1 = await setTagAsync(branch, dir);
  const v2 = await setLogAsync(branch, v1);
  return v2;
};

let initialized = false;

const initializeIpcEvents = (win) => {
  if (initialized) return;
  initialized = true;

  ipcMain.handle('async-get-tag', (e, options = {}) => {
    const { dir, branch, isWithFetch } = options;
    startReadRepos(dir, branch, isWithFetch).then((repos) => {
      win.webContents.send('async-tag', repos);
    });
  });

  ipcMain.handle('async-get-dir', (e, options = {}) => {
    const { baseDir } = options;
    findPaths(baseDir).then((paths) => {
      const dir = setName(paths);
      win.webContents.send('async-dir', dir);
    });
  });
};

module.exports = {
  initializeIpcEvents,
};
