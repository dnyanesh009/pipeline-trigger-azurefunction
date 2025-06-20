import * as SDK from "azure-devops-extension-sdk";
import { getService } from "azure-devops-extension-sdk";
import { IWorkItemFormService } from "azure-devops-extension-api/WorkItemTracking";
import './styles.css';

SDK.init();

SDK.ready().then(async () => {
  SDK.notifyLoadSucceeded();

  const service = await getService<IWorkItemFormService>("ms.vss-work-web.work-item-form");
  const areaPath = await service.getFieldValue("System.AreaPath");

  if (!areaPath) {
    await service.setFieldValue("System.AreaPath", "DefaultProject\\DefaultArea");
  }

  const triggerButton = document.getElementById("triggerButton") as HTMLButtonElement;
  const statusDiv = document.getElementById("status") as HTMLDivElement;

  triggerButton.addEventListener("click", async () => {
    const pipelineId = (document.getElementById("pipelineId") as HTMLInputElement).value.trim();
    const orgUrl = (document.getElementById("orgUrl") as HTMLInputElement).value.trim();
    const project = (document.getElementById("project") as HTMLInputElement).value.trim();
    const func_key = (document.getElementById("func_key") as HTMLInputElement).value.trim();
    const your_func_name = (document.getElementById("your_func_name") as HTMLInputElement).value.trim();

    if (!pipelineId || !orgUrl || !project || !your_func_name || !func_key) {
      statusDiv.textContent = "Please fill in all fields.";
      statusDiv.style.color = "red";
      return;
    }

    const normalizedOrgUrl = orgUrl.endsWith("/") ? orgUrl.slice(0, -1) : orgUrl;
    const functionUrl = `https://${your_func_name}.azurewebsites.net/api/trigger-pipeline?code=${func_key}`;

    const host = SDK.getHost() as any;
    const hostUri = host?.uri ? (host.uri.endsWith("/") ? host.uri : host.uri + "/") : "https://dev.azure.com/";
    const proxyUrl = `${hostUri}_apis/public/extensionproxy?url=${encodeURIComponent(functionUrl)}`;

    try {
      statusDiv.textContent = "Triggering pipeline via Azure Function...";
      statusDiv.style.color = "black";

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orgUrl: normalizedOrgUrl,
          project,
          pipelineId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        statusDiv.textContent = `Error ${response.status}: ${errorText}`;
        statusDiv.style.color = "red";
        return;
      }

      statusDiv.textContent = "Pipeline triggered successfully!";
      statusDiv.style.color = "green";
    } catch (error: any) {
      statusDiv.textContent = `Exception: ${error.message}`;
      statusDiv.style.color = "red";
    }
  });
});

SDK.register("pipeline-trigger-button-control", () => {
  return {};
});
