Here’s a clear, step-by-step guide to **deploy an Azure Function via the Azure Portal** and securely **add your PAT as an environment variable**.

---

## ✅ Step 1: Create an Azure Function App (Portal UI)

1. Go to [https://portal.azure.com](https://portal.azure.com)

2. Search for **“Function App”** in the top search bar

3. Click **Create** and fill in the following:

   | Setting               | Value                          |
   | --------------------- | ------------------------------ |
   | **Subscription**      | Select yours                   |
   | **Resource Group**    | Create or choose one           |
   | **Function App name** | `pipeline-trigger-fn` (unique) |
   | **Runtime stack**     | `Node.js`                      |
   | **Version**           | `20 LTS` or latest             |
   | **Region**            | Nearest region to you          |
   | **Hosting**           | Create new storage account     |

4. Click **Next** until **Review + Create**, then click **Create**

---

## ✅ Step 2: Add Function Code in the Portal

1. After deployment completes, click **Go to resource**

2. Under **Functions**, click **+ Add**

3. Choose:

   * **Development environment**: *“Develop in Portal”*
   * **Template**: *HTTP trigger*
   * Name: `TriggerPipeline`
   * Authorization level: *Function*

4. Once created, go to **Code + Test**

5. Replace the default `index.js` or `index.ts` with your Azure Function logic (I can give you this if needed)

---

## ✅ Step 3: Add PAT Securely via Application Settings

1. In the left menu, go to **Configuration**

2. Under **Application settings**, click **+ New application setting**

   | Name         | Value                                         |
   | ------------ | --------------------------------------------- |
   | `DEVOPS_PAT` | `your-personal-access-token` (paste PAT here) |

3. Click **OK**, then **Save**

🔒 Azure will automatically encrypt this and make it available via `process.env.DEVOPS_PAT`

---

## ✅ Step 4: Get the Function URL

1. Go back to the function (`TriggerPipeline`)
2. Click **Get Function URL**
3. Choose **Default (Function key)** and copy the URL

---

## ✅ Step 5: Update Your Extension Frontend

In your extension’s frontend (already updated in your `workItemControl.ts`), set the function URL like:

```ts
const azureFunctionUrl = "https://<your-func-name>.azurewebsites.net/api/TriggerPipeline?code=<function-key>";
```

---

## 🧪 Optional: Test it in Postman

Send a POST request to that function with body:

```json
{
  "orgUrl": "https://dev.azure.com/ankitaghogare",
  "project": "project2",
  "pipelineId": "1234"
}
```

---

## ✅ Summary

* ☁️ Azure Function created securely
* 🔐 PAT stored in environment variable
* 🔄 Frontend delegates pipeline triggering to backend

Would you like the `index.ts` code for the Azure Function as well now?
