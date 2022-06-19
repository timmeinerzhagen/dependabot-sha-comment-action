import { getInput } from '@actions/core'
import * as github from '@actions/github'
//import * as exec from '@actions/exec'

import context from "./mock/context.json"

const mockGetInput = jest.fn()
const mockCore = jest.mock('@actions/core', () => ({
    ...jest.requireActual('@actions/core'),
    getInput: mockGetInput
}));
const mockGitHub = jest.mock('@actions/github', () => ({
    context: context
}));

//const mockExec = jest.mock('@actions/core');

import { run } from "../src/main"

describe("index", () => {
    test("default", async () => {        
        mockGetInput.mockReturnValue("token")

        await run();
    })
})