import process from "process";
import chalk from "chalk";

class QwikLogger {
  public init() {
    console.log = this.log;
    console.warn = this.warn;
    console.error = this.error;
  }

  public log(...str: any) {
    process.stdout.write(chalk.bold.bgGray(`[LOG]`) + " ");
    process.stdout.write(chalk.green(str));
    process.stdout.write(" " + "\n");
  }

  public warn(...str: any) {
    process.stdout.write(
      chalk.bold.bgGray("[WARN]") + " " + chalk.yellow(str) + "\n",
    );
  }

  public error(...str: any) {
    process.stdout.write(
      chalk.bold.bgGrey("[ERROR]") + " " + chalk.red(str) + "\n",
    );
  }
}

export { QwikLogger };
