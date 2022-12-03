import express from "express";
import multer from 'multer';
import fs from "fs";
import NodeRSA from "node-rsa";

const app = express();

const upload = multer({
    dest: 'uploads/'
});

const type = upload.fields([
    {name: 'key', maxCount: 1},
    {name: 'secret', maxCount: 1}
]);

const port = 8080;

app.get("/login", (_, res) => {
   res.end("alex_wells");
});

app.post("/decypher", type, (req, res) => {
    const keyPath = req.files['key'][0].path;
    const secretPath = req.files['secret'][0].path;

    fs.readFile(keyPath, (err, privateKeyBuffer) => {
        if (err) throw err;

        const privateKey = new NodeRSA(privateKeyBuffer, "private");

        fs.readFile(secretPath, (err, encryptedDataBuffer) => {
            if (err) throw err;

            res.end(privateKey.decrypt(encryptedDataBuffer, 'utf8'));
        });
    });
});

app.listen(port, () => console.log(`Server running: ${port}`));