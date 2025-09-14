// (Optional) Auth middlleware 


// middleware/auth.js
require("dotenv").config();

function basicAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        // return res.status(401).json({ error: "Missing or invalid auth header" });
        return res
            .status(401)
            .set("WWW-Authenticate", 'Basic realm="CoChat Debug Zone"')
            .send("Authentication required.");
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");

    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;

    if (username !== envUser || password !== envPass) {
        return res.status(403).json({ error: "Forbidden: Invalid credentials" });
    }

    next();
}

module.exports = basicAuth;