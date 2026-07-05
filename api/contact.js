const https = require("https");
const querystring = require("querystring");

const GITHUB_OWNER = "AmpRobo";
const GITHUB_REPO = "AmpRobo.github.io";
const DEFAULT_ALLOWED_ORIGINS = ["https://amprobo.github.io"];
const FIELD_LIMITS = {
    name: 100,
    phone: 50,
    email: 254,
    message: 5000
};

function sendJson(response, statusCode, payload) {
    response.statusCode = statusCode;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify(payload));
}

function getAllowedOrigins() {
    const configuredOrigins = (process.env.CONTACT_ALLOWED_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    return configuredOrigins.length ? configuredOrigins : DEFAULT_ALLOWED_ORIGINS;
}

function cleanField(value, maxLength, preserveLines) {
    if (typeof value !== "string") {
        return "";
    }

    // Remove control characters while retaining message line breaks.
    const controlCharacters = preserveLines
        ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g
        : /[\u0000-\u001f\u007f]/g;

    return value.replace(controlCharacters, "").trim().slice(0, maxLength);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readRequestBody(request) {
    if (typeof request.body === "string") {
        return Promise.resolve(request.body);
    }

    if (request.body && typeof request.body === "object") {
        return Promise.resolve(querystring.stringify(request.body));
    }

    return new Promise((resolve, reject) => {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;
            if (body.length > 12000) {
                reject(new Error("Payload too large"));
                request.destroy();
            }
        });
        request.on("end", () => resolve(body));
        request.on("error", reject);
    });
}

function createGitHubIssue(token, issue) {
    const requestBody = JSON.stringify(issue);

    return new Promise((resolve, reject) => {
        const githubRequest = https.request(
            {
                hostname: "api.github.com",
                path: `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
                method: "POST",
                headers: {
                    Accept: "application/vnd.github+json",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(requestBody),
                    "User-Agent": "AmpRobo-Website-Contact",
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            },
            (githubResponse) => {
                githubResponse.resume();
                githubResponse.on("end", () => {
                    if (githubResponse.statusCode === 201) {
                        resolve();
                    } else {
                        reject(new Error(`GitHub returned ${githubResponse.statusCode}`));
                    }
                });
            }
        );

        githubRequest.on("error", reject);
        githubRequest.setTimeout(10000, () => {
            githubRequest.destroy(new Error("GitHub request timed out"));
        });
        githubRequest.end(requestBody);
    });
}

module.exports = async function contactHandler(request, response) {
    const origin = request.headers.origin;
    const allowedOrigins = getAllowedOrigins();

    if (origin && !allowedOrigins.includes(origin)) {
        return sendJson(response, 403, { error: "Request not allowed." });
    }

    if (origin) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
    }

    if (request.method !== "POST") {
        response.setHeader("Allow", "POST");
        return sendJson(response, 405, { error: "Method not allowed." });
    }

    if (!process.env.GITHUB_TOKEN) {
        console.error("Contact API configuration error: GITHUB_TOKEN is missing.");
        return sendJson(response, 500, { error: "Unable to send message." });
    }

    try {
        const rawBody = await readRequestBody(request);
        const submitted = querystring.parse(rawBody);
        const name = cleanField(submitted.name, FIELD_LIMITS.name, false);
        const phone = cleanField(submitted.phone, FIELD_LIMITS.phone, false);
        const email = cleanField(submitted.email, FIELD_LIMITS.email, false);
        const message = cleanField(submitted.message, FIELD_LIMITS.message, true);

        if (!name || !email || !message || !isValidEmail(email)) {
            return sendJson(response, 400, { error: "Please check the submitted fields." });
        }

        const issueBody = [
            `Name: ${name}`,
            "",
            `Phone: ${phone}`,
            "",
            `Email: ${email}`,
            "",
            "Message:",
            message,
            "",
            "Source:",
            "AmpRobo Website Contact Form"
        ].join("\n");

        await createGitHubIssue(process.env.GITHUB_TOKEN, {
            title: `Website Contact: ${name}`,
            body: issueBody,
            labels: ["contact", "website"]
        });

        return sendJson(response, 201, { success: true });
    } catch (error) {
        // Return a generic error so GitHub response details never reach the browser.
        console.error("Contact API request failed:", error.message);
        return sendJson(response, 502, { error: "Unable to send message." });
    }
};
