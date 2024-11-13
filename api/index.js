// api/index.js
const express = require("express");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.post("/api/decrypt", (req, res) => {
    const { body } = req;
    console.log(body, "Request body");

    const encryptedMessage = body.message;
    const key = CryptoJS.enc.Utf8.parse(process.env.key);
    const iv = CryptoJS.enc.Utf8.parse(process.env.iv);
    
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (decryptedText) {
            console.log("Decrypted successfully:", decryptedText);
            
            try {
                const jsonData = JSON.parse(decryptedText);
                console.log("Parsed JSON:", jsonData);
                res.json(jsonData);
            } catch (e) {
                console.log("Note: Result is not JSON format");
                res.send(decryptedText);
            }
        } else {
            console.log("Decryption resulted in an empty string");
            res.status(400).send("Decryption failed, empty result.");
        }
    } catch (error) {
        console.error("Decryption error:", error.message);
        res.status(500).send("Decryption error occurred.");
    }
});

// Export the Express API
module.exports = app;