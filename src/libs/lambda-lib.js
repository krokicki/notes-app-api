import { Lambda } from 'aws-sdk';
const lambda = new Lambda();

export function invokeLambdaAsync(functionName, payload) {
    const params = {
        FunctionName: functionName,
        InvocationType: 'Event',
        Payload: JSON.stringify(payload)
    };

    console.log(`Generating new promise for ${functionName}`);

    return new Promise((resolve, reject) => {
        lambda.invoke(params, (err,data) => {
            if (err) {
                console.log(err, err.stack);
                reject(err);
            }
            else {
                console.log(data);
                resolve(data);
            }
        });
    });
}
