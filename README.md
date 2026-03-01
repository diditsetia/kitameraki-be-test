iiBackend Improvment with Azure Function App and uses
Azure Cosmos DB as its database

How To Runing Backend

1. npm install
2. rm -rf dist
3. npm run build
4. make sure local settings
   {
   "IsEncrypted": false,
   "Values": {
   "AzureWebJobsStorage": "UseDevelopmentStorage=true",
   "FUNCTIONS_WORKER_RUNTIME": "node",
   "COSMOS_ENDPOINT": "https://your-cosmos-account.documents.azure.com:443/",
   "COSMOS_KEY": "YOUR_COSMOS_KEY_HERE",
   "COSMOS_DATABASE": "TaskManagementDB",
   "COSMOS_TASKS_CONTAINER": "tasks",
   "COSMOS_SETTINGS_CONTAINER": "formSettings"
   }
   }

5. func start --cors http://localhost:5173 --port 7071

Refactor the project to improve its security, readability, and maintainability.
