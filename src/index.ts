import { mainModule } from "process"
import { run } from "./main"

export async function start(): Promise<void> {
    run();
}

start()