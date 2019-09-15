const express = require('express');
const router = express.Router();
const fs = require('fs');
const fsextra = require('fs-extra');
const { join } = require('path');
const appRoot = require('app-root-path');
const { User } = require('../model/user');
const multer = require('multer');
var extract = require('extract-zip');

//#region getDirectoryItems
router.get('/getimagedirectoryitems', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const directory = req.query.directory;
        const path = join(
            appRoot + process.env.ROOT_PATH,
            `./images${directory === undefined ? '' : directory}`
        );
        fs.writeFile('message.txt', path, err => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        fs.readdir(path, function(err, items) {
            res.status(200).send(items);
        });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion getDirectoryItems

//#region uploadFile
router.post('/upload', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const directory = req.query.directory;
        const path = join(
            appRoot + '/server',
            `./images${directory === undefined ? '' : directory}`
        );
        let storage = multer.diskStorage({
            destination: function(req, file, cb) {
                cb(null, path);
            },
            filename: function(req, file, cb) {
                cb(null, file.originalname);
            }
        });

        let upload = multer({ storage: storage }).array('file');
        upload(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(500).json(err);
            } else if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).send(req.file);
        });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion uploadFile

//#region CreateDirectory
router.post('/createdirectory', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const directory = req.query.directory;
        const foldername = req.query.foldername;
        const path = join(
            appRoot + '/server',
            `./images${directory === undefined ? '' : directory}`
        );

        if (fs.existsSync(path + '/' + foldername)) {
            return res.status(402).send('folder exist');
        }

        // Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
        fs.mkdir(path + '/' + foldername, { recursive: true }, err => {
            if (err) {
                return res.status(402).send('folder exist');
            }
        });

        res.status(200).send('new folder create success');
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion CreateDirectory

//#region RemoveDirectory
router.post('/removedirectory', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const directory = req.query.directory;
        const foldername = req.query.foldername;
        const path = join(
            appRoot + '/server',
            `./images${directory === undefined ? '' : directory}`
        );

        if (!fs.existsSync(path + '/' + foldername)) {
            return res.status(402).send('folder not exist');
        }

        fsextra
            .remove(path + '/' + foldername)
            .then(() => {
                return res.status(200).send('folder removed success');
            })
            .catch(() => {
                res.status(400).send('data not valid');
            });
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion RemoveDirectory

//#region RemoveFile
router.post('/removefile', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const directory = req.query.directory;
        const filename = req.query.filename;
        const path = join(
            appRoot + '/server',
            `./images${directory === undefined ? '' : directory}`
        );

        if (!fs.existsSync(path + '/' + filename)) {
            return res.status(402).send('file not exist');
        }

        // Creates /tmp/a/apple, regardless of whether `/tmp` and /tmp/a exist.
        fs.unlink(path + '/' + filename, err => {
            if (err) {
                return res.status(402).send('error white remove file');
            }
        });

        res.status(200).send('file removed success');
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion RemoveFile

//#region extractFile
router.post('/extractfile', async (req, res) => {
    let token = req.header('x-auth');
    if (!token) return res.status(400).send('token not exist');

    try {
        let user = await User.findByToken(token);
        if (!user) return res.status(400).send('token not exist');
        if (user.user_type !== 'admin') {
            return res.status(401).send('Unauthorized');
        }
        const directory = req.query.directory;
        const filename = req.query.filename;
        const path = join(
            appRoot + '/server',
            `./images${directory === undefined ? '' : directory}`
        );

        if (!fs.existsSync(path + '/' + filename)) {
            return res.status(402).send('file not exist');
        }

        extract(path + '/' + filename, { dir: path }, function(err) {
            if (err) {
                return res.status(402).send('error white remove file');
            }
        });

        res.status(200).send('file removed success');
    } catch (error) {
        return res.status(400).send('data not valid');
    }
});
//#endregion extractFile

module.exports = router;
