import { platform } from "node:os";
import { execSync } from "node:child_process";

if (platform() === "win32") {
    execSync("powershell -NoProfile -ExecutionPolicy Bypass -File scripts/ci-win32.ps1", { stdio: "inherit" });
} else {
    execSync("sh scripts/ci-unix.sh", { stdio: "inherit" });
}
