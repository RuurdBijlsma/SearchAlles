const fs = require('fs');

exports.listDir = name => {
    return new Promise(resolve => {
        fs.readdir(name, (err, files) => {
            resolve(files);
        });
    });
};

exports.fileSize = name => fs.statSync(name).size;

exports.createFile = (name, content) => {
    return new Promise((resolve, error) => {
        fs.writeFile(name, content, err => {
            if (err)
                error();
            else
                resolve();
        });
    });
};

exports.deleteFile = file => fs.unlinkSync(file);

exports.createDirectory = name => {
    if (!fs.existsSync(name))
        fs.mkdirSync(name);
};

exports.deleteDirectory = name => {
    if (fs.existsSync(name)) {
        fs.readdirSync(name).forEach(file => {
            const curPath = name + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(name);
    }
};

exports.clearDirectory = name => {
    this.deleteDirectory(name);
    this.createDirectory(name);
};