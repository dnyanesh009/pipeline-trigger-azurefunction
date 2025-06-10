const fetch = require("node-fetch");

module.exports = async function (context, req) {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
        return;
    }

    const { orgUrl, project, pipelineId } = req.body;

    if (!orgUrl || !project || !pipelineId) {
        context.res = {
            status: 400,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: "Missing one of: orgUrl, project, pipelineId"
        };
        return;
    }

    const pat = process.env.AZURE_DEVOPS_PAT;
    const url = `${orgUrl.replace(/\/$/, '')}/${project}/_apis/pipelines/${pipelineId}/runs?api-version=7.1-preview.1`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(':' + pat).toString('base64'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const result = await response.text();

        context.res = {
            status: response.ok ? 200 : response.status,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: response.ok
                ? `Pipeline triggered successfully! Response: ${result}`
                : `Failed to trigger pipeline: ${result}`
        };

    } catch (err) {
        context.res = {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: `Exception: ${err.message}`
        };
    }
};
