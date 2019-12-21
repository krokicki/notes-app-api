import { success, failure } from "../libs/response-lib";

test("Success", () => {
  const obj = { test: 1 }
  const response = success(obj)
  expect(response).toHaveProperty('statusCode', 200);
  expect(response).toHaveProperty('body');
});

test("Failure", () => {
  const obj = { test: 1 }
  const response = failure(obj)
  expect(response).toHaveProperty('statusCode', 500);
});


