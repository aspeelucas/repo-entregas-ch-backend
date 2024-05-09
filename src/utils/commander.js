import { Command } from "commander";

const program = new Command();


program.option("--mode <mode>", "modo de trabajo", "development");
program.parse();

export default program;