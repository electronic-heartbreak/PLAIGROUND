import { readFileSync } from "node:fs";

const types = [
  "feature", "fix", "chore", "docs", "style",
  "refactor", "perf", "test", "build", "ci",
];
const topics = [
  "ui", "api", "auth", "database", "documentation",
  "dependencies", "config", "testing", "build-tools", "infrastructure",
];

const messagePath = process.argv[2];

if (!messagePath) {
  console.error("commit message file is required");
  process.exit(1);
}

const message = readFileSync(messagePath, "utf8").trimEnd();
const subject = message.split(/\r?\n/, 1)[0];
const errors = [];

const match = /^([a-z]+)\(([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\): \S.*$/.exec(subject);

if (!match) {
  errors.push("use type(topic): message with a required type, topic, and description");
}

if (!match || !types.includes(match[1])) {
  errors.push(`allowed types: ${types.join(", ")}`);
}

if (!match || !topics.includes(match[2])) {
  errors.push(`allowed topics: ${topics.join(", ")}`);
}

if (message !== message.toLowerCase()) {
  errors.push("the entire commit message must be lowercase");
}

if (subject.trimEnd().endsWith(".") || message.endsWith(".")) {
  errors.push("the commit subject and message must not end with a dot");
}

if (errors.length > 0) {
  console.error(`invalid commit message:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  console.error("example: feature(ui): add navigation menu");
  process.exit(1);
}
