import { failure } from "../libs/response-lib";

export async function main(event, context) {
    failure({ status: false });
}