import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
import AWS from "aws-sdk";

export async function main(event, context) {
  let connectionData;
  let wssUrl = process.env.WSS_URL;
  console.log("Using ", wssUrl);

  console.log("Scanning ", process.env.connectionsTableName);

  try {
    connectionData = await dynamoDbLib.call('scan', {
            TableName: process.env.connectionsTableName,
            ProjectionExpression: 'connectionId'
        });
  }
  catch (e) {
    console.log(e, e.stack);
    return failure(e.stack);
  }

  console.log("Broadcasting payload: ", event.payload);

  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: wssUrl
  });

  const postData = JSON.stringify(event.payload);

  const postCalls = connectionData.Items.map(async ({ connectionId }) => {
    try {
      await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: postData }).promise();
      console.log("Posted to connectionId: ", connectionId);
    }
    catch (e) {
      if (e.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await dynamoDbLib.call('delete', {
                TableName: process.env.connectionTableName,
                Key: { connectionId }
            });
      }
      else {
        console.log(e, e.stack);
        return failure(e.stack);
      }
    }
  });

  try {
    await Promise.all(postCalls);
  }
  catch (e) {
    console.log(e, e.stack);
    return failure(e.stack);
  }

  return success('Data sent.');
}