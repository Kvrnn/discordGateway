import {assembler, disassembleAndFind, handler} from "../middleware/handler.mjs";

const req = {
    method: "GET",
    url: "/api/v1/notes/1",
    body: {
        title: "Title",
        content: {
            text: "Content",
            timestamp: "2021-01-01"
        }
    }
};

function disassembleAndFindTest() {
    const variable = "title";
    const result = disassembleAndFind(req.body, variable);
    console.log(result);
}

function assemblerTest() {
    const variable = "title";
    const value = "Title";
    const result = assembler(req.body, variable, value);
    console.log(result);
}

function handlerTest() {
    const variables = ["id", "title", "content.text", "content.timestamp", "content.nonexistent"];
    const result = handler(req.body, variables, missing => {
        console.log(`\nMissing variable: ${missing}`);
    });
    console.log(`Result: ${result}`);
}

console.log('\nTesting function disassembleAndFind');
disassembleAndFindTest();

console.log('\nTesting function assembler');
assemblerTest();

console.log('\nTesting function handler');
handlerTest();