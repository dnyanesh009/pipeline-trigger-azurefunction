const fetch = require("node-fetch");

module.exports = async function (context, req) {
    const { orgUrl, project, pipelineId } = req.body;

    if (!orgUrl || !project || !pipelineId) {
        context.res = {
            status: 400,
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

        if (!response.ok) {
            context.res = {
                status: response.status,
                body: `Failed to trigger pipeline: ${result}`
            };
        } else {
            context.res = {
                status: 200,
                body: `Pipeline triggered successfully! Response: ${result}`
            };
        }
    } catch (err) {
        context.res = {
            status: 500,
            body: `Exception: ${err.message}`
        };
    }
};
