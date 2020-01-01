# Notes Example

Serverless API for a collaborative note-taking app.

Based on the tutorial at https://serverless-stack.com

Build:
```
npm install
```

Run unit tests:
```
npm test
```

Run integration tests locally against the deployed database:
```
serverless invoke local --function create --path mocks/create-event.json
serverless invoke local --function get --path mocks/get-event.json
serverless invoke local --function list --path mocks/list-event.json
serverless invoke local --function update --path mocks/update-event.json
serverless invoke local --function delete --path mocks/delete-event.json
```

Deploy API:
```
serverless deploy -v
```

