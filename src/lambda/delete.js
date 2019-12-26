import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
import { invokeLambdaAsync } from "../libs/lambda-lib";

export async function main(event, context) {

  const noteId = event.pathParameters.id;
  const params = {
    TableName: process.env.notesTableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: noteId
    }
  };

  try {
    await dynamoDbLib.call("delete", params);

    await invokeLambdaAsync(process.env.BROADCAST_FN, { payload: {
      "eventType": "delete",
      "noteId":  noteId
    }});

    return success({ status: true });
  }
  catch (e) {
    return failure({ status: false });
  }
}
