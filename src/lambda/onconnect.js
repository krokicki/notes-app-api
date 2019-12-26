import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  var params = {
    TableName: process.env.connectionsTableName,
    Item: {
      connectionId: event.requestContext.connectionId
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success({ status: true });
  }
  catch (e) {
    console.log(e, e.stack);
    return failure({ status: false });
  }
}