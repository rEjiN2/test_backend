const express = require("express");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

app.post("/decrypt", (req, res) => {
    const { body } = req;
    console.log(body, "Request body");

    const encryptedMessage = body.message;
    const key = CryptoJS.enc.Utf8.parse(process.env.key);
    const iv = CryptoJS.enc.Utf8.parse(process.env.iv);
    
    try {
        // Decrypt with proper configuration
        const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        
        // Convert to UTF8 string
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
        
        if (decryptedText) {
            console.log("Decrypted successfully:", decryptedText);
            
            // If the result is JSON, parse it
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

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
