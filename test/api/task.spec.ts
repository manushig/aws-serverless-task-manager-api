import { v4 } from "uuid";
import { request } from "../helpers/app";

describe("Tasks", () => {
      describe("POST /task", () => {
        it("responds with 201 status code and newly created task data if article has been created successfully", async () => {

            const requestBody = {
                id,
    title,
    description,
    status: 'PENDING',
    createdAt
            }
            const response = await request
            .post("/task")
            .set("Authorization", getAuthToken(expectedArticle.id))
            .send(requestBody);
        });

    })
})