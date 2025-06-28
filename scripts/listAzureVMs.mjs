import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient } from "@azure/arm-compute";
import { execSync } from "child_process";

(async () => {
  try {
    // Use az CLI login context to fetch subscription id
    const subscriptionId = execSync(
      "az account show --query id -o tsv",
      { encoding: "utf8" }
    ).trim();

    if (!subscriptionId) {
      console.error("No active Azure subscription found. Run 'az login' first.");
      process.exit(1);
    }

    const credential = new DefaultAzureCredential();
    const client = new ComputeManagementClient(credential, subscriptionId);

    const vms = [];

    for await (const vm of client.virtualMachines.listAll()) {
      const resourceGroup = vm.id?.split("/resourceGroups/")[1]?.split("/")[0] ?? "";
      const status = vm.instanceView?.statuses?.find((s) => s.code?.startsWith("PowerState"))?.displayStatus ?? "unknown";
      vms.push({ Name: vm.name, ResourceGroup: resourceGroup, PowerState: status });
    }

    console.table(vms);
  } catch (err) {
    console.error("Error listing VMs:", err);
    process.exit(1);
  }
})();
