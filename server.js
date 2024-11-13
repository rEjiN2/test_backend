// server.js (create this in root directory)
const app = require('./api/index.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test the decrypt endpoint at http://localhost:${PORT}/api/decrypt`);
});