const fs = require("fs")
const path = require('path')

const mkDir = (dir) => {
    console.log("dir %s", dir)
    try {
        if (fs.mkdirSync(dir)) {
            console.log("Directory %s exists.", dir)
        }
    } catch (e) {
        if (e.code != 'EEXIST') {
            console.log("An error occurred.%s", e)
        }
    }
}

const writeFileSync = (file, str) => {


    const baseDir = path.dirname( file )  
    const fileName = path.basename( file)  
    const ext = path.extname( file ) // .txt
    mkDirByPathSync( baseDir )
    fs.writeFileSync( writePath, str);

    try {
        //   fs.mkdirSync(curDir);
        fs.writeFileSync( writePath, str);
        console.log(`File ${file} created!`);
    } catch (err) {
        if (err.code === 'EEXIST') { // curDir already exists!
            // console.log(`Directory ${curDir} already exists!`);
            return curDir;
        }

        // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows
        if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
            throw new Error(`EACCES: permission denied, '${file}'`);
        }

    }

}

const mkDirByPathSync = (targetDir, opts) => {
    const isRelativeToScript = opts && opts.isRelativeToScript;
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    const baseDir = isRelativeToScript ? __dirname : '.';

    return targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(baseDir, parentDir, childDir);
        try {
            fs.mkdirSync(curDir);
            console.log(`Directory ${curDir} created!`);
        } catch (err) {
            if (err.code === 'EEXIST') { // curDir already exists!
                // console.log(`Directory ${curDir} already exists!`);
                return curDir;
            }

            // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows
            if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
            }

            const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
            if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
                throw err; // Throw if it's just the last created dir.
            }
        }

        return curDir;
    }, initDir);
}


exports.mkDirByPathSync = mkDirByPathSync;
exports.writeFileSync =writeFileSync;