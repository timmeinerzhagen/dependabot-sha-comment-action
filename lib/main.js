"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (github.context.eventName === 'pull_request') {
                core.info(`This action is running on the 'pull_request' event!`);
                // const payload = github.context.payload as any ;
                // const diff = await github.rest.pulls.get({
                //     owner: github.context.repo.owner,
                //     repo: github.context.repo.repo,
                //     pull_number: payload.pull_request.number,
                //     mediaType: {
                //         format: "diff",
                //     },
                // });
                // } else {
                //     core.info(`The dependabot change was not for a GitHub Actions workflow.`)
                // }
            }
            else {
                core.info(`This action can only act on the 'pull_request' trigger.`);
            }
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
// const message = core.getInput('message');
// const github_token = core.getInput('GITHUB_TOKEN');
// const context = github.context;
// if (context.payload.issue == null) {
//     core.setFailed('No issue found.');
//     return;
// }
// const issue_number = context.payload.issue.number;
// const octokit = new github.GitHub(github_token);
// const new_comment = octokit.issues.createComment({
//     ...context.repo,
//     issue_number: issue_number,
//     body: message
//     });
