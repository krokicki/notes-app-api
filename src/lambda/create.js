import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";
import { invokeLambdaAsync } from "../libs/lambda-lib";
import uuid from "uuid";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const noteId = uuid.v1();
  const params = {
    TableName: process.env.notesTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: noteId,
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);

    await invokeLambdaAsync(process.env.BROADCAST_FN, { payload: {
      "eventType": "create",
      "noteId": noteId
    }});

    return success(params.Item);
  }
  catch (e) {
    return failure({ status: false });
  }
}

