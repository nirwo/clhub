import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient } from "@azure/arm-compute";
import { execSync } from "child_process";

(async () => {
  try {
    const credential = new DefaultAzureCredential();

    // Use the subscription set as default in az CLI
    const subscriptionId = execSync("az account show --query id -o tsv", { encoding: "utf8" }).trim();

    const client = new ComputeManagementClient(credential, subscriptionId);
    const vmArray = [] as { name: string; rg: string; powerState?: string }[];

    for await (const vm of client.virtualMachines.listAll()) {
      const resourceGroup = vm.id?.split("/resourceGroups/")[1]?.split("/")[0] ?? "";
      const powerState = vm.instanceView?.statuses?.find(s => s.code?.startsWith("PowerState"))?.displayStatus;
      vmArray.push({ name: vm.name ?? "", rg: resourceGroup, powerState });
    }

    console.table(vmArray);
  } catch (err) {
    console.error("Error listing VMs", err);
    process.exit(1);
  }
})();
