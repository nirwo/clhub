import { execSync } from "child_process";
import inquirer from "inquirer";
import fs from "fs";

function execJson(cmd) {
  return JSON.parse(execSync(cmd, { encoding: "utf8" }));
}

// Ensure az CLI is logged in
try {
  execSync("az account show -o none");
} catch {
  console.error("You are not logged in. Run: az login");
  process.exit(1);
}

const subs = execJson("az account list -o json").map(
  ({ name, id, isDefault }) => ({
    name: `${name}${isDefault ? " (default)" : ""}`,
    value: id,
  })
);

if (!subs.length) {
  console.error("No Azure subscriptions found.");
  process.exit(1);
}

const { subscriptionId } = await inquirer.prompt([
  {
    type: "list",
    name: "subscriptionId",
    message: "Select a subscription",
    choices: subs,
  },
]);

fs.mkdirSync("config", { recursive: true });
fs.writeFileSync(
  "config/azure.json",
  JSON.stringify({ subscriptionId }, null, 2)
);
console.log(`Saved subscription ${subscriptionId} to config/azure.json`);
