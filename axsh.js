import fs from "fs";
import readline from "readline"
import { spawn } from "child_process"

// * Load * \\
const config = JSON.parse(fs.readFileSync("./axsh.config.json", "utf-8"));
const PROMPT = config.prompt || 'AXSH@NOTFOUND';
const USER_FILE = "./user.json";
let DEFAULT_BROWSER = null;

function loadUser() {
  if (!fs.existsSync(USER_FILE)) {
    return { user: {} };
  }
  return JSON.parse(fs.readFileSync(USER_FILE, "utf-8"));
}

function saveUser(data) {
  fs.writeFileSync(USER_FILE, JSON.stringify(data, null, 2));
}

const userDataInit = loadUser();
if (userDataInit?.user?.browser?.path) {
  DEFAULT_BROWSER = userDataInit.user.browser.path;
}

// * System Base * \\
class AXSHSB {
  static LOG(Content="Default AXSH message") {
    return console.log(Content)
  }

  static NEWLINE(lines) {
    this.LOG("\n".repeat(lines))
  }

  static CLOG(Content="Default AXSH message", color="white") {
    const colors = {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
      gray: "\x1b[90m",
      brightRed: "\x1b[91m",
      brightGreen: "\x1b[92m",
      brightYellow: "\x1b[93m",
      brightBlue: "\x1b[94m",
      brightMagenta: "\x1b[1;35m",
      brightCyan: "\x1b[96m",
      brightWhite: "\x1b[97m",
      reset: "\x1b[0m",
      bold: "\x1b[1m",
      dim: "\x1b[2m",
      underline: "\x1b[4m",
      inverse: "\x1b[7m"
    };

    const chosenColor = colors[color] || colors.white;
    console.log(`${chosenColor}${Content}${colors.reset}`);
  }
}
function CLOG(Content="Default AXSH message", color="white") {
  const colors = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    brightRed: "\x1b[91m",
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[1;35m",
    brightCyan: "\x1b[96m",
    brightWhite: "\x1b[97m",
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    underline: "\x1b[4m",
    inverse: "\x1b[7m"
  };

  const chosenColor = colors[color] || colors.white;
  console.log(`${chosenColor}${Content}${colors.reset}`);
}
function LOG(Content="Default AXSH message") {
  return console.log(Content)
}

function NEWLINE(lines) {
  this.LOG("\n".repeat(lines))
}

// * System * \\
class AXSH {
  static banner() {
    console.clear();
    console.log("Axolotl Shell for Windows [ AXSH@WIN ]")
    console.log("Type 'help' to see commands.\n")
  }

  static ascii = class {
    static hi() {
      AXSHSB.CLOG('⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀⣀⣤⠶⠞⠛⠉⠉⠉⠙⠛⠲⠶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⢀⣾⠿⠟⠙⠿⠛⣷⣀⣴⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠳⣦⡀⢀⣤⣤⡶⣦⣤⡀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⢠⣿⠂⠀⠀⠀⢀⣾⠏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⠉⠉⠀⠀⢸⡇⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠈⠛⣶⠀⠀⢠⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣧⡀⠀⢠⣴⠟⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⢀⡀⣀⣼⣛⢲⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⢶⣶⣧⣀⣀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⢠⣴⣿⠉⠛⠀⠉⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣟⠁⠘⠋⠹⢷⡄', "brightMagenta");
      AXSHSB.CLOG('⠸⣷⡄⠀⠀⠀⢰⡟⠀⠀⠀⠀⠀⣰⣶⣄⠀⠀⣀⠀⠀⡀⠀⢀⡀⠀⢰⣿⣷⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⣾⠃', "brightMagenta");
      AXSHSB.CLOG('⠀⠛⠿⣷⣀⣀⣼⣇⠀⠀⠀⠄⣀⠻⡿⠋⠀⠀⠻⣦⡾⠻⠶⠾⠃⠀⠈⠛⠛⡀⠀⠉⠳⠄⣿⣦⣄⣽⠟⠋⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⣈⣽⡟⠳⣿⡀⣇⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢷⣀⠀⣠⢀⡿⠺⢿⣅⣀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⣸⣯⠉⠁⠀⠸⣧⠘⠶⠴⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⢁⣾⠃⠀⠈⢩⣿⡀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠿⣶⡀⣤⠀⢀⡿⣷⣤⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⢿⣇⢀⣰⡆⣼⡾⠏⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠘⠛⠛⠷⠛⢹⡏⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢻⡟⣿⡷⠟⠛⠛⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠀⠀⠀⠀⠀⣈⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⠿⠋⠀⠀⠀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠀⢀⣴⠶⢶⠟⢻⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⢠⡾⡟⠀⠀⠀⠸⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠃⠀⠀⠀⠀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠘⠷⣦⣀⣰⡀⢠⡿⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠷⣦⠀⠀⠀⠀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⢷⣤⣀⣠⣦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣴⣟⣁⣴⠟⠀⠀⠀⠀⠀⠀⠀', "brightMagenta");
      AXSHSB.CLOG('⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠉⠉⠛⠛⠓⠶⠶⠶⠶⠖⠛⠛⠉⠁⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀', "brightMagenta");
    }

    static happy() {
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠙⢦⠈⠀⠙⣆⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣀⣿⠀⠀⢸⠀⠀⢠⡇⠀⠳⢦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠁⠘⣿⡀⠀⣼⠀⡴⠋⠻⡏⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣤⣤⣀⣸⣇⠀⢸⣷⠞⢷⣾⡅⠀⢠⡗⠀⡼⠛⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⣤⡀⠀⣀⠀⠀⠀⠀⠀⣀⣴⠖⠋⠉⠁⠀⠀⠀⠀⠀⠀⠉⠛⢦⣿⡏⣷⣸⣿⠂⢀⣼⡷⠎⠀⢀⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⢠⡞⠳⣄⡇⠀⢱⡄⠉⢷⡀⠀⣴⠞⠋⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⣿⣧⣾⣧⣄⣦⣾⢿⣳⣶⣺⣍⣀⣀⠀⣀⣀⠀⢀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠸⣇⠀⠘⣧⡀⠀⣧⠀⠀⣧⡾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣷⣄⠀⠀⠀⠹⠿⢿⣿⣟⣻⡾⠁⠀⣽⠋⠀⢸⠋⠁⠀⠀⠀⠀⠀⠂", "brightMagenta");
    AXSHSB.CLOG("⢠⡶⠾⠧⣄⣈⣷⣷⣈⣷⣤⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣏⣻⣿⣄⠐⠖⣶⣿⣷⣿⡿⠁⢤⣾⠃⢀⡴⠿⢾⠉⠉⡿⠁⠀⡠⠂", "brightMagenta");
    AXSHSB.CLOG("⠈⢧⡤⢤⣤⡖⠻⣯⡟⢿⣿⣲⣷⠀⠀⠀⢀⣤⣤⣤⠤⠾⠛⠀⠀⠀⠉⠅⠘⠀⠀⠀⠈⠙⣛⣿⣷⣾⡿⠿⠍⢁⣀⣠⠏⠀⡾⠁⠀⡄⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠘⣇⠀⠙⢷⡠⠾⣗⢸⣿⡿⢿⡆⠠⠴⠞⠷⠿⠿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣉⠘⠙⢷⣄⠐⣾⠀⠀⠀⢰⠃⠀⠀⡁⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⡤⠞⠳⠦⠈⣳⣄⣹⣾⣿⠻⠾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡞⣿⠳⢦⣄⣀⠀⢀⡾⠃⠙⡷⢶⠾⠉⠉⠁⠀⠀⠀⢸⡀⠀⠀⣇⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠳⣄⣀⣠⠼⠻⣯⡛⢻⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣧⡈⠇⠀⠈⠛⠛⠟⠓⠒⠺⢷⣤⡀⠀⠀⠀⠀⠀⠀⠈⣇⠀⠀⢸⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⢰⠎⠻⢦⣄⣈⣹⣿⣿⢿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢦⡄⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠓⠒⠶⢤⡀⠀⠀⣿⠀⠀⢸⡇⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠈⠓⠢⡔⠋⢹⠋⢀⣉⣮⡏⠛⣶⣤⣄⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣬⠇⠀⣸⠇⠀⠀⣸⠁⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠁⠀⠘⠶⠞⠉⠋⠀⠸⣯⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⠞⢉⣠⡴⠚⠉⠀⠀⣰⠇⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠒⠦⠤⠤⠤⠤⢤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⡏⠉⠉⠉⠀⠀⠀⠀⣠⡼⠁⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠳⢤⣤⣀⠀⠀⠀⠀⠀⠀⣋⣀⣙⣷⠦⠤⠤⠴⠶⠛⠁⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠲⠶⠖⠚⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
  }
  static logo() {
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣤⣶⣿⠷⠿⢞⡛⢻⢛⡛⢻⠛⡟⢻⠻⠷⡶⣯⣴⣶⣠⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣰⡴⢶⢛⣋⣍⡲⢠⠍⡜⢢⠉⢆⠲⣈⠥⢚⡨⢡⠣⡑⠦⢡⠆⠭⡙⡛⠷⣮⣔⡠⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡶⠗⠯⡱⡸⠊⠁⠀⠀⡼⠡⠎⡔⢣⢉⠬⡑⠢⢎⡡⢎⠢⠣⢜⢨⢡⢊⠥⠱⣉⠲⠤⣉⠛⠷⣧⣂⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⢕⣩⠌⡙⠴⡑⢀⡀⡤⢖⠹⠰⣉⠖⡡⢎⢂⠣⡅⡋⠦⡘⠢⡍⢣⠎⢢⠅⣊⠬⡑⠤⢃⡱⢌⠩⠜⣠⠛⠷⣗⡠⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⡚⢆⡶⠋⠀⠀⣜⢡⢮⢡⠜⡰⢌⣃⣳⣌⣒⣡⠎⡌⡒⠬⢡⠣⢍⠣⠜⡡⢊⣥⣾⡶⡿⢿⡿⡿⢷⡾⣥⣋⠤⣉⢲⢌⡻⣮⡢⡀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⢀⣼⠇⡸⠃⠀⠀⠀⢠⡛⢤⠸⢃⣜⣿⡿⣿⢟⡿⣻⢿⣿⣄⢣⠛⡄⢣⠜⣃⢇⢣⣿⢿⣇⢿⡻⣿⢻⣛⣧⢻⡻⢿⣧⣜⠠⠘⢤⡘⢿⣜⠄⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⢔⡵⢃⠞⠁⠀⠀⠀⣰⠫⠜⡄⢣⣿⡟⣧⢻⣎⢿⣜⢧⣏⣷⣻⣷⣽⣶⠷⠾⠶⢾⣿⣏⡿⣜⢧⡻⡽⣧⣛⣾⢣⡟⣧⢏⡿⣮⡑⢄⢱⢣⡙⣯⣢⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⢠⣢⠟⡨⢍⠀⠀⢀⡠⢞⡡⠣⠍⡔⣿⢿⣹⣎⣷⡮⣟⢮⣷⡾⠟⠋⠉⠀⠀⠀⠀⠀⢸⣷⢞⡿⣜⢧⡻⢵⣫⡝⣮⢳⡝⣮⣛⡼⣿⡎⣅⠋⡤⢃⠬⢳⡥⡀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⡠⣵⠣⣉⠴⢡⢋⠹⢌⡑⠦⢡⢃⠧⢼⣿⣏⢷⡹⢶⣹⣾⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠂⠸⣿⣎⢷⣏⢾⡹⢧⡳⣝⣮⣷⡿⣶⠿⣷⣿⣇⠆⡍⡆⠋⢆⡍⢻⡴⡀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⡠⣽⢃⠱⠄⡎⠆⡥⢃⠖⡌⠎⣅⠪⣔⣩⣿⡽⢮⡽⣷⡟⠁⠀⠀⠀⠀⠀⠀⠀⠠⠈⠀⠀⠀⠙⢿⣾⡜⣷⣛⢧⣿⢿⡻⣼⡱⢯⣝⡳⣏⢿⣿⣔⡱⡀⠀⠪⢥⢻⡴⡀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⢠⣽⠣⢌⠎⡱⡈⠖⡡⢎⡸⢌⠱⣈⣷⣟⣯⣽⣿⣭⣻⡟⠀⠀⠀⠠⠀⠠⠀⠈⠀⠀⠠⠐⠈⠀⠀⠀⠙⠛⠷⢿⣿⡽⣳⡝⡶⣝⡳⣎⢷⣹⣞⣼⣻⣧⢥⠀⠀⢳⢌⢿⣱⠀", "brightMagenta");
    AXSHSB.CLOG("⢀⢶⡇⢎⠆⢭⡐⡅⡋⡔⢢⡑⡊⢆⣿⡟⣵⣚⡶⣹⠿⣿⠀⠀⠠⠈⠀⠀⠀⠀⠀⠈⠀⠀⠄⠐⠀⠁⠀⠀⠀⠀⣾⡷⣏⢧⡻⣝⢮⡳⣝⡾⢧⣛⢶⡹⣿⣆⠃⠀⠀⢏⠼⣏⠇", "brightMagenta");
    AXSHSB.CLOG("⣞⡟⣈⠲⣘⠂⡖⣈⠦⢡⢃⠬⡱⠌⣿⣽⢳⣭⣛⣧⣟⡿⠀⠀⣀⢀⠀⠈⠀⠀⠈⠀⠀⠄⠀⠄⠀⠄⠀⠁⠀⠀⢹⣿⡹⣎⢷⣫⢞⡵⣻⡝⣧⣛⢮⡳⣽⡇⠎⠀⠀⠘⡎⢿⣰", "brightMagenta");
    AXSHSB.CLOG("⣿⠇⢢⡑⢢⢙⡐⢢⠊⡅⢎⢒⡡⢎⢻⣞⡳⢮⡷⣻⢼⡏⣴⣿⣿⣿⠀⠀⠀⠀⠄⠀⠀⠀⠄⠀⠀⣀⣤⣤⣤⣀⠈⢿⣷⣹⢎⣷⢫⡞⣵⢻⠶⣭⡳⣽⣹⣇⠳⠀⠀⠀⡟⣸⡇", "brightMagenta");
    AXSHSB.CLOG("⣸⢌⡱⡜⠉⢱⢌⠣⠜⣈⢆⢃⠖⣈⢒⡻⣿⣧⡻⣵⣻⣿⣿⣿⣿⣿⠀⠀⠀⡀⠤⠀⠐⠀⠀⢠⣾⣿⣿⣿⣿⣿⣷⡀⠙⢿⣾⡜⡷⣽⢎⡯⣝⢶⡹⣖⣿⢡⢃⢃⠀⠀⢰⢩⡗", "brightMagenta");
    AXSHSB.CLOG("⣿⠠⠾⠀⠀⢸⢠⠣⢍⡂⠎⢆⡓⢌⠆⣒⣾⣻⢟⣿⠏⣿⣿⣿⣿⠃⠀⠀⠉⠉⠉⠉⠂⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠙⢿⣷⣹⣞⡽⣎⢷⣹⣾⠏⡒⡌⢎⠀⢀⠧⣊⡟", "brightMagenta");
    AXSHSB.CLOG("⣿⠐⡆⠀⠀⠘⣌⠢⢌⡃⠖⡬⠱⡘⠴⣉⣿⡯⣞⣿⠀⢿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢀⣠⣼⡿⣟⢿⣳⢿⣼⣿⠏⡔⢣⠱⠌⣆⠼⢠⢋⡷", "brightMagenta");
    AXSHSB.CLOG("⣻⠌⡇⠀⠀⠈⡦⢑⠢⡌⣃⠆⡣⢍⠲⢄⠻⣿⣾⡽⣏⠳⠂⠀⠀⣀⣀⡀⠁⠀⠈⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⡿⢀⣾⣿⢯⡷⣽⢎⡷⣻⢞⣷⡘⠬⡡⢎⠱⡄⢎⢡⢺⡇", "brightMagenta");
    AXSHSB.CLOG("⣸⡎⠇⠀⠀⠀⠓⣌⠱⢄⡃⢎⡑⢎⡑⠎⡔⠢⣍⠹⡩⠷⣤⡾⠛⠋⠙⠛⢷⣄⣠⣤⣤⣤⡂⠹⢿⣿⣿⣿⣿⡿⠟⠁⣾⣿⣹⣎⠷⣭⢿⡜⣧⡟⣾⡏⣅⠣⣌⢣⠘⠦⢡⢾⢡", "brightMagenta");
    AXSHSB.CLOG("⡟⣧⢹⠀⠀⠀⠘⣄⠓⡢⣉⠆⡍⢆⠥⢋⡔⠣⡄⢳⠠⣿⡏⠀⠀⠀⠀⠀⣰⠟⠁⠀⠀⠉⢻⣧⠀⠉⠉⠉⠁⢰⠲⠄⢻⣯⣽⢎⡿⣜⢯⡞⣵⢯⣿⠑⣂⠧⡐⠦⡙⡘⢤⡟⡄", "brightMagenta");
    AXSHSB.CLOG("⢿⢿⣈⡆⠀⠀⠀⢨⢒⡱⠐⢎⠔⡉⢆⢣⣬⣵⣼⣤⣃⣻⣇⠀⠀⠀⠀⢠⡏⠀⠀⠀⠀⠀⠀⢻⣇⠀⠀⣀⣀⣠⣤⣶⡿⠿⣯⣟⣼⣫⢷⣹⡿⢟⡡⢋⠔⢢⡑⡱⢌⠱⣾⢱⠃", "brightMagenta");
    AXSHSB.CLOG("⠀⢟⣧⠼⡄⠀⠀⠈⢦⠰⣉⠦⡙⡌⢆⣿⠂⠀⠀⠈⣹⠏⠹⢷⣤⣴⣤⡼⣇⠀⠀⠀⢀⠀⡀⠈⣿⡛⠛⠛⢻⡟⠭⡑⣌⠒⡤⢋⢍⠫⢍⡹⢐⡡⢒⡡⢎⡱⠰⣡⠊⣵⢇⠗⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠈⠾⣧⢙⡄⠀⠀⠘⡵⡐⢢⠱⣘⠢⣿⠀⠀⢀⠀⣿⠀⠀⠀⠈⠉⠀⠀⠹⣆⠀⠀⠀⠀⠀⠀⠈⠛⠂⠀⣿⡏⢆⡱⢠⢓⡰⡉⢆⠓⡌⣔⣡⠶⠥⠶⢆⡅⡓⣄⣳⢏⠃⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠈⡽⣶⠘⢦⠀⠀⢸⢅⣃⠓⡤⢓⣸⡇⠀⠀⠀⣿⡀⠀⢀⠀⡀⢀⠀⠀⠈⠛⢦⣤⣴⣠⠤⡆⠀⠀⠀⣿⣏⠒⣌⠲⣈⠦⡙⠤⢋⠖⠉⠀⠀⠀⠀⠀⡧⣑⣲⢯⠊⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠈⢞⣯⡢⣉⠦⡙⣤⡢⡙⡔⢣⠰⢻⡄⠀⠀⠘⣷⡀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⣠⣤⣀⠀⢀⣿⢣⢉⠦⡑⢌⡲⡑⢪⠃⠀⠀⠀⠀⠀⠀⣰⢓⡼⡧⠉⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠺⣳⣤⢃⢼⠀⠈⢲⠡⣃⠥⢋⢻⣄⠀⠀⠈⠻⣦⡀⠐⠀⠀⠀⠀⠀⠂⢰⣿⠁⣿⣿⠟⢀⣾⡟⢢⠉⢦⠉⢞⠲⣍⢹⠀⠀⠀⠀⠀⢀⡼⣥⢟⠝⠁⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠁⣿⣧⡎⢳⡄⢸⢰⢡⠊⣥⠒⢹⣷⡄⠀⠀⠈⠛⣶⣤⡄⠀⠀⠂⠀⠀⠉⣤⡌⠀⢠⣿⢫⠘⣤⠋⣤⠋⡌⢲⢠⠋⣦⣤⣤⡖⠊⣧⣿⣵⠋⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠪⣷⣎⡩⣑⠢⡑⢎⠰⣘⢢⠘⡻⢶⣄⡀⠀⠀⠉⠉⠉⠉⠐⠀⠀⠀⠉⣡⣴⣟⢋⡔⢣⡐⢎⡰⡜⠉⠀⠚⠒⢤⡓⠰⣄⣿⣻⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⢦⣇⣑⢊⡑⢆⢢⡙⠤⢃⡍⣛⠷⢶⣦⣤⣤⣤⣤⣤⣶⠾⡟⢫⡑⠤⡒⢌⠒⣌⢒⠰⣣⣀⡀⣀⠤⣎⣵⢟⡿⠎⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⠫⢻⢦⣕⡪⢔⡈⠞⡰⡘⡰⣊⣲⣄⣣⣜⣌⣢⠱⣈⠖⣡⢃⡜⢢⡑⢪⠑⣂⠎⡱⢠⢎⣴⣽⢾⡯⠅⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠊⠘⠹⢳⠾⣥⣒⣡⡙⠿⣳⣽⣻⢾⡽⣟⡿⣷⣾⠐⡆⡜⠡⡜⠢⣍⣰⣮⡵⢾⣛⠭⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠑⠋⣩⢟⣛⣶⠶⢯⣭⣿⣽⣿⣬⣥⣽⡶⠾⢷⣿⣿⣿⡝⠓⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
  }
  static logo2() {
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⣴⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠛⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠙⠛⠻⠿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠿⢿⣿⣿⣟⣿⣿⣿⣿⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⡿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⣿⣿⣿⢿⣿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⢿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢻⣿⣿⣿⣿⣿⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠁⠀⠀⠀⠈⠰⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠃⠀⠀⠀⠀⠀⠀⠀⠈⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⣘⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⡀⠀⢀⠀⠀⡀⠀⠀⠘⢿⣿⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⢀⣼⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠈⢇⡀⠀⠀⠀⠀⠀⠀⡔⠁⠀⠀⠀⠀⠀⠀⠀⢀⠠⣀⣠⣐⣤⣄⣦⣤⣴⣤⣄⣆⣠⣐⣀⡀⠂⢀⠐⠀⠀⠁⡀⠀⠁⡀⠈⠀⡀⠁⢀⠈⠀⡀⠁⠠⠀⢀⠠⠀⠀⠄⠀⠠⠀⢀⠐⠀⠠⠀⢻⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⠏⠀⢀⣶⣿⣶⣄⠁⠀⠂⠁⠀⢀⠈⠀⠀⠘⠠⠤⡀⠤⠔⠉⠀⢀⠠⠐⠀⣠⣤⣶⣶⣿⠿⠿⠛⠛⠛⠋⠋⡉⠙⠉⠋⠛⠛⠻⠻⠿⢿⣿⣷⣶⣦⣌⣀⠀⠄⠁⢀⠀⠁⠀⠄⠂⠀⠄⠀⡐⠀⠠⠀⢀⠐⠀⠠⠈⣠⣶⣷⣶⡀⠀⠄⠀⠻⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⠇⠀⠀⣾⡿⠀⠹⣿⣦⠀⠐⠀⡈⠀⡀⠌⠀⡐⠀⡀⠀⠄⠀⠄⠂⣀⣤⣶⣿⠿⠛⠉⠀⠀⠀⢀⠐⠀⠂⠄⢁⠠⠈⠄⡁⠄⠡⢂⠱⣈⠖⡤⣋⡝⢻⠿⣿⣿⣶⣦⣀⠠⠁⠂⠠⠐⠈⢀⠐⠀⠠⠁⢀⠂⠀⠌⠀⣴⣿⡟⣹⣿⣷⠀⠈⠠⠀⠹⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⣼⣿⣿⣿⣿⠏⠀⡀⠁⣿⣇⠀⠀⠘⢿⣷⣄⠁⢀⠐⠀⡀⠂⢀⠐⠀⡈⠀⢌⣴⣿⠿⠋⠁⠀⠀⠀⠀⠀⢀⠈⠀⠠⠈⠐⠈⡀⠄⠂⡐⠀⠄⡁⠎⡐⢆⡚⠴⣑⢎⢧⣛⢦⣏⢿⣻⣿⣷⣦⡄⠁⠄⡈⠀⠄⡈⠄⠐⡀⠠⠁⣠⣾⡿⢋⠴⢣⣿⣿⠀⠈⠄⢈⠀⠻⣿⣿⣿⣿⣷⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⣸⣿⣿⣿⣿⡏⠀⡐⠀⠄⢻⣷⡀⣬⣄⡀⠛⢿⣷⣦⡀⢂⠠⠐⠀⠄⠂⣠⣷⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠠⠈⢀⠂⢁⠐⠀⠄⡁⠠⢈⠠⢀⠃⡜⢠⢎⡱⢎⡚⢦⡝⡶⣎⢷⣹⢮⡟⣿⣿⣷⣄⠀⠌⠀⠄⠐⠠⢐⣴⣾⡿⠋⢠⣱⣾⢿⣿⡗⠀⠌⢀⠂⠐⡀⢻⣿⣿⣿⣿⣇⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⢠⣿⣿⣿⣿⡿⠀⠐⠀⡐⠠⠈⢿⣧⡈⠻⣿⣶⣬⣙⠿⣿⣷⣶⣤⣁⣰⣼⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠠⠐⠀⡀⠂⠈⠄⠂⡀⠡⠀⠄⢂⠡⡘⢄⠎⡴⢩⢞⡱⢞⡵⣫⢞⡧⣟⢾⣳⢻⣿⣿⣶⣄⣡⣬⣶⣿⠿⠛⡁⣠⣶⣿⢟⣫⣾⡿⠁⠠⢈⡀⠄⢁⠠⠀⣿⣿⣿⣿⣿⡄⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⣾⣿⣿⣿⣿⠃⢠⣿⡿⢿⣷⣦⣌⣻⣿⣦⣈⠙⢿⣿⣿⣷⣿⣿⢿⣿⣿⡟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠄⠂⠀⠌⠐⡀⢁⠐⡀⠡⠐⡈⠰⡁⢎⠸⣰⢋⠶⣙⢮⢳⡝⣮⠽⣞⢯⣽⢻⣼⣻⢿⣿⠟⠉⠁⢠⣠⣶⣿⠿⠋⣡⣾⣿⣏⣤⣴⣷⣿⣿⣷⡀⠠⠁⢸⣿⣿⣷⣿⣷⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⢰⣿⣿⣿⣿⡏⢀⢸⣿⡁⠀⠀⠉⠛⠛⠛⠻⠿⢿⣶⣯⣿⡿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣾⣿⣷⣦⡀⠄⠂⠁⡐⠠⠐⠀⠄⡐⠀⢂⠐⡡⠘⡄⢳⣼⣿⣿⣿⣿⣮⣝⡮⣟⡽⣞⣧⣟⡾⣽⣻⣿⣷⣴⣿⠿⠟⣉⣤⣶⡿⠿⠿⠿⠿⣿⢻⠿⣽⣿⣿⠇⠀⠌⠀⢿⣿⣿⣿⣿⡆⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⣾⣿⣿⣿⣿⠃⠠⠀⣿⣧⠀⠀⣀⣀⣀⢀⡂⢀⡄⢌⡙⣿⣹⣷⢿⣿⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⠟⠉⠙⡀⠄⠁⠠⠐⢀⠁⢂⠠⠈⡀⢂⠔⡡⢊⣽⣿⣿⣿⠟⠉⠙⣿⡵⣫⣞⠷⣞⡾⣽⣳⢯⢿⣿⣏⠀⠀⠀⠉⠈⢀⠀⡄⢦⣙⣼⣮⣿⣿⣳⣿⡿⠃⢈⠠⠁⠚⣿⣿⣿⣿⣧⠀", "brightMagenta");
    AXSHSB.CLOG("⢠⣿⣿⣿⣿⡿⠀⠄⡁⠈⠻⣿⣦⣄⣉⠛⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣷⣤⣾⠁⠀⠌⢀⠂⠄⡈⠀⠄⠂⠐⡀⠆⡡⠭⣿⣿⣿⣿⣧⣤⣾⡿⣳⢳⣭⢿⣹⣞⠷⣽⣫⣟⣿⣿⣶⣾⣿⣿⣿⣿⣿⡿⢿⠿⣿⣻⣿⣾⣿⠟⢁⠘⠤⡐⢈⠄⣿⣿⣿⣽⣿⠄", "brightMagenta");
    AXSHSB.CLOG("⢸⣿⣿⣿⣿⡏⠄⠂⠄⡡⠐⠈⢉⠛⠻⠿⢿⣿⡿⠿⠿⢏⠻⣝⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠿⣶⣿⣿⡿⠉⠀⢈⠠⠀⡐⠠⠀⡁⠂⢁⠂⡐⠌⠰⣁⠻⣿⣶⣿⣿⣿⢟⡵⣫⢟⣼⡳⢯⣞⢿⣳⣻⣼⣻⣿⣇⠀⠀⠀⠙⠿⠿⢿⣿⡿⠿⠛⡛⡉⠔⡈⢆⡉⠰⡐⡈⢆⢿⣿⣿⣿⣿⡃", "brightMagenta");
    AXSHSB.CLOG("⢼⣿⣿⣿⣿⡇⡘⠄⢣⠐⡁⠎⠤⠘⣠⣶⡿⠟⠀⠠⠐⣬⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠐⠀⡀⠂⠄⠠⠁⠠⢈⠀⡐⠀⠎⡡⢂⡕⢪⡝⣻⡙⢮⢏⡾⣱⡻⢮⣽⣛⡾⣏⣷⣳⣽⣻⣿⣿⢿⣷⣦⡀⠠⠀⠌⢻⣿⣶⡱⢄⡱⠨⢔⠢⣉⠖⡡⢜⠨⢾⣿⣿⣷⣿⡗", "brightMagenta");
    AXSHSB.CLOG("⣻⣿⣿⣿⣿⡇⡘⢌⠢⢡⠘⣴⣾⡿⠟⠋⠀⠠⣈⢴⣿⣿⡿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠈⠀⢂⠠⠐⠈⡀⠌⠐⡀⠐⡀⢉⠰⢁⡒⢌⢣⡚⢥⢫⡝⣮⢳⡳⣽⣛⡶⢯⣷⣛⣮⢷⣫⣿⣿⣿⣧⡙⠿⣿⣶⣦⣀⠣⢜⡻⣿⣿⣶⣍⢆⠳⣄⠫⡔⢪⡑⢻⣿⣿⣿⣿⡟", "brightMagenta");
    AXSHSB.CLOG("⣿⣿⣿⣿⣿⡇⡸⣀⠏⡆⠹⣾⣿⠀⠀⠀⣰⣷⣿⣿⠿⣱⣿⣿⠿⡈⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢀⠀⠆⠁⢀⠰⢀⠀⠁⡀⠆⢁⠶⣸⠸⣆⠹⡎⢷⡸⣇⡏⣷⢇⡿⣾⠿⣶⢿⡾⣏⣷⣿⣿⢁⢿⣿⣷⡈⠹⢿⣿⣷⣾⣱⣉⢿⣿⣿⠎⣱⡈⢷⡸⣁⡎⣹⣿⣿⣿⣿⣏", "brightMagenta");
    AXSHSB.CLOG("⢿⣿⣿⣿⣿⡧⡑⢆⡚⡴⢣⠹⣿⣦⣤⣝⣛⣩⣥⣶⣾⡿⢟⡱⢊⠵⢸⣿⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⡀⠂⠹⣶⣤⣈⣤⣴⣶⣾⣦⣴⣌⣦⣾⡟⢣⢌⢳⡙⢶⣙⢶⡹⣎⢯⣗⢯⣻⣭⢷⣻⣽⣾⣿⢏⡚⢦⡙⡻⢿⣷⣶⣬⣟⣿⣿⣿⣿⣿⠟⡼⣡⢞⡡⢖⡱⢬⣹⣿⣿⣯⣿⡧", "brightMagenta");
    AXSHSB.CLOG("⣻⣿⣿⢿⣿⣧⡙⢮⠜⣥⢣⢛⡔⣫⠟⡿⢿⢻⡛⣭⠳⡜⣆⡳⣍⢞⡱⣚⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠄⠀⠄⡀⠈⠙⠛⠛⢉⠉⠉⡙⠛⠟⡛⡉⠜⡢⢎⡱⢎⡳⢎⡷⣹⢎⡿⣼⢫⣷⣛⣮⣷⣿⡿⣏⢮⣙⢶⡩⣕⣫⢜⡛⡟⢿⡻⢟⡻⢏⢮⡙⢶⡱⢎⡵⣋⡞⣥⢻⣿⣿⣿⣻⡗", "brightMagenta");
    AXSHSB.CLOG("⢸⣿⣿⣿⣿⡧⡝⢮⣙⢦⣋⠞⡼⣡⢛⡜⣎⢧⣙⢦⣻⣼⠞⠙⠚⣾⣵⢪⡜⣻⢿⣷⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠂⢀⠀⢁⠂⠈⠄⠂⠈⠄⠐⡀⠂⡔⢡⢉⠖⣡⠞⣡⣛⢼⡱⣏⢾⡳⣭⣟⣶⣿⣿⣿⠟⡵⣎⡳⢎⡧⣝⡲⡵⢮⣝⢺⣣⡝⢮⣓⠯⡶⣹⢣⡝⣮⢳⡱⣝⣎⢿⣿⣿⣿⣿⠅", "brightMagenta");
    AXSHSB.CLOG("⠸⣿⣿⣿⣿⣿⣙⡞⡼⡲⢭⣛⠶⣍⡳⢞⡼⡲⢭⡖⣿⡄⠀⠀⠀⠈⣿⣆⠿⡥⣏⣻⢿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠂⠈⡀⠠⠁⡐⠈⡐⠈⠠⢀⠡⢐⠢⢡⠚⡤⢛⡴⣩⠶⣹⢎⡷⣽⣶⣿⣿⡿⣻⡜⣯⢳⢧⣻⡹⣜⢧⡻⣜⡳⣎⢷⣓⡞⣧⢏⡿⣜⢧⡻⣜⢧⣏⢷⣓⢮⣿⣿⣿⣯⣿⠂", "brightMagenta");
    AXSHSB.CLOG("⠐⣿⣿⣿⣿⣿⡞⣼⠳⣝⢧⣛⢾⡱⣏⢯⢶⡹⢧⡻⡼⣷⣀⣀⣀⣼⣿⠾⣿⣷⣜⢧⡻⣜⡻⢿⣿⣷⣦⣤⣀⠀⠀⠈⠀⠄⠁⠠⠐⢀⠐⠠⠐⠈⠠⢀⠂⢅⠊⡤⢋⡴⢋⣶⣡⣿⣵⣿⣿⣿⢿⣛⢧⡻⣵⢻⡜⣯⢞⡵⣻⡜⣧⢟⣼⢳⡽⣎⢷⣹⢎⡿⣼⡹⣎⣷⢫⡾⣜⣧⣛⢮⣿⣿⣷⣿⡿⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⢹⣿⣿⣿⣿⣿⣜⡻⣼⢣⡟⣮⢳⡝⣮⡳⣝⣧⢻⡵⣫⣟⡻⣿⣾⠁⠀⠀⠈⣿⡷⣹⢮⣝⣳⢮⣝⡻⢿⡿⣿⣿⣶⣶⣤⣬⣀⡐⠀⠂⠁⠄⡁⠂⠄⠊⣤⣩⣶⣷⣾⣿⣿⢿⡟⣟⣳⢎⣯⢽⣚⡷⣭⣗⣻⡼⣏⡾⢧⣻⡝⣾⢣⣟⢾⣹⡞⡽⣞⣳⢧⡟⣵⡞⣯⢞⣳⢮⣝⣯⣿⣿⢿⣻⡇⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠈⣿⣿⣿⣿⣿⡼⣝⠾⣭⣻⠼⣯⡝⣧⢟⡵⣞⢧⣻⣵⣫⢷⣹⢿⣆⡀⠀⣀⣾⡟⣧⣟⢮⣽⣣⢯⣽⡳⣽⣳⣿⡟⠁⠉⠉⠉⠡⢈⠠⠁⢂⠠⠈⡀⠂⢍⠛⣉⠏⣭⢻⣿⣿⡞⣽⢧⢯⣛⣮⢷⣻⣼⣷⣾⣵⣻⡼⣏⡿⣵⠟⠯⣟⡾⡽⢶⣻⣝⣳⢯⢾⣹⢧⢿⣹⠾⣭⡟⣮⣿⣿⣻⣿⣿⠁⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⢹⣿⣿⣿⣿⣿⣞⣻⡵⣏⡿⣖⣻⢽⣺⢽⡞⣯⠓⠺⣧⢟⣧⡟⣾⣻⢿⣟⡯⢿⣼⣚⣯⠶⣏⡷⣞⡽⣳⣿⡟⠀⠀⢀⠂⠁⠄⠂⢀⠂⠄⡐⠠⢀⢁⠊⡔⢡⠚⣤⢣⢿⣿⣿⢽⣺⢯⡽⣞⣧⢿⡟⠁⠀⠙⣿⣳⢯⣽⣯⠀⢀⣼⣻⡽⣏⡷⡾⣭⡟⣯⡽⣞⡯⢷⣻⢧⡿⣽⣿⣿⣿⣿⠏⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⢿⣿⣿⣿⣿⣾⢧⣛⣾⢳⣯⡽⡾⣭⡟⣞⡷⣶⢾⣝⣯⠾⣝⣧⢿⣽⣾⠿⠿⣶⣿⣮⡿⡽⣽⢾⡽⣿⣿⠀⠀⠐⠀⠠⠈⡀⠌⢀⠐⠠⢀⠂⠄⢢⣱⠈⠦⡙⣤⢛⡮⢿⣿⣯⠷⣯⢟⡾⣞⣻⢿⣄⣀⣼⣿⢯⣟⣮⣟⣿⣿⢯⣷⢻⣭⢷⣻⣳⢟⣳⢯⣟⢾⢯⡷⢯⣟⣿⣿⣿⣿⡿⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠘⣿⣿⣿⣿⣿⣯⣻⣼⢻⣶⢻⣽⣳⣻⢽⢾⣭⡟⣞⡾⣻⡽⣾⠟⠉⠀⠀⠀⠀⠀⠙⢿⣽⣳⢯⣿⣿⡇⠀⠀⠂⠈⢀⠐⠀⣿⡀⠄⠂⠄⡐⢠⣸⡯⡘⢰⡑⢦⡙⣼⣻⣿⣿⣻⣭⢿⡽⡾⣭⣟⣾⣻⡽⣞⣿⣼⣷⡿⣿⣾⣳⡞⣿⣺⢏⡷⣯⣻⣭⣟⣾⣫⠿⣽⢯⣿⣿⣿⣿⣿⠃⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠹⣿⣿⣿⣿⣷⣟⡾⣻⣼⣻⢶⣏⡷⣯⡟⣶⣻⢽⣳⢿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣯⢷⣿⡿⠁⣶⡀⠀⠁⠠⠐⠀⢻⣧⠐⠈⡀⠐⣠⣿⠇⡘⢄⡚⢤⣋⣶⣿⢿⣿⡷⣯⢟⡾⣽⣳⢯⡶⣯⢿⣽⡿⠉⠀⠀⠈⠹⣿⣽⣳⡽⢯⣻⣵⣻⢮⣷⣳⢯⠿⣽⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣽⣳⡽⣞⣯⢾⣽⡳⣟⣳⢯⣟⡾⣻⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⡇⠀⠸⣷⡀⠈⡀⠄⠁⡘⣿⡆⠐⢀⠁⣾⣟⠠⢑⠪⡜⢢⣽⣿⢣⢿⣿⣿⡽⣯⢟⣳⢯⣟⣳⢯⣟⣿⣇⠀⠀⠀⠀⠀⣿⡷⢯⣞⣯⢷⣳⢯⣟⡶⣯⣻⣟⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣧⣟⡷⣫⣟⣶⣻⣽⢫⣷⣫⣽⣳⢿⣧⡀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣾⣿⠀⠀⠀⠙⣷⡄⠀⡐⠠⠀⣿⡧⠐⢀⢸⣿⠃⡌⢢⠑⣘⣿⣿⠇⣏⡞⣿⣿⡿⣼⢯⡿⣹⢾⣭⢷⣞⡾⣻⣦⣄⣀⣠⣾⡿⣽⣛⡾⡽⡾⣭⢷⣛⣾⢳⣽⣾⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣾⡽⣳⡽⣞⡵⣞⡿⢶⣛⡶⢯⣻⣞⣿⣤⣀⠀⠀⢀⣠⣶⣿⣟⣾⣿⡇⠀⠀⠀⠀⠹⣿⣄⠀⡐⠀⣽⣿⠀⠠⢸⣿⠡⡐⢡⢪⣽⡿⢣⡛⣴⢫⣽⣿⣿⣳⢯⣻⡽⣳⣞⣯⡞⣷⢯⣽⡻⣟⡿⣳⢯⠷⣯⣻⣽⢻⡽⣏⣿⢺⣯⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣳⣽⢫⣽⣛⡾⣏⣿⣹⢯⣗⡿⣜⣯⢿⡿⣿⢿⣻⡽⣎⣷⣿⡟⠀⠀⠀⠀⠂⠀⠘⢿⣷⣤⣤⣿⡟⠀⠄⢹⣿⣧⣜⣶⣿⠟⡱⢣⡝⢦⢏⡶⣿⣿⣯⢷⣏⣷⣻⡼⣞⡽⣽⡞⣧⢿⣝⡾⣽⣫⣟⢷⣳⣭⣟⣳⠿⣼⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣾⣻⣞⣭⢷⣻⢮⣽⡳⣯⢾⡽⣞⣳⠿⣼⣏⣷⢻⡽⣾⣿⠃⠀⠀⠀⠀⠀⠁⠠⠀⠈⠛⠛⠋⢁⠈⠄⡀⢉⠿⠛⢏⡑⢎⡱⢣⢞⡱⣎⢷⣹⣿⣿⢯⣞⣧⢷⣻⣭⣟⣶⣻⢽⣫⢾⣝⣳⡽⣞⣯⣳⠷⣾⣹⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣷⣿⢮⡟⣧⣟⡾⣝⡷⢯⣻⣭⢯⣟⠷⣾⢭⡿⣽⣿⡿⠀⠀⠀⠀⠀⠁⡀⠁⠠⠁⡐⠠⠈⡀⠐⠠⠐⠀⠄⡩⠐⣌⢢⠱⣫⢜⡱⣎⠷⣭⢿⣿⣟⡾⡽⣞⣧⢷⡞⣧⠿⣭⡟⣧⣟⣧⡟⣧⣟⡞⣿⣳⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣽⣳⡽⢾⡽⣞⣯⢷⣫⣟⢾⣻⠽⣞⣳⢯⣿⡇⠀⠀⠀⠀⠰⣦⡄⠈⢀⠐⠀⠄⢁⠠⠁⢂⠈⡐⠈⠤⡙⠄⣎⣱⣼⣾⢳⡹⣞⡱⣿⣿⣿⣽⢻⣵⡻⡾⣝⣯⢟⣳⡟⣧⣟⣶⢻⣳⡽⣾⣿⣿⣿⣿⣿⣷⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣷⣿⣻⣼⣻⡼⢯⡷⣞⣯⣽⢻⡽⣭⣿⣿⡅⠀⠀⠀⠀⠀⠈⠹⢿⣤⡀⠌⢀⠂⢀⠂⠄⠂⡀⢁⠆⠱⣼⣶⡿⢏⢧⡓⢧⠯⣵⣫⣿⣿⣞⠿⣼⣳⢿⣹⣞⣯⢷⣻⣳⠾⣭⣟⣷⣿⣿⣿⣿⣿⣿⡟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣾⣧⣟⡿⣼⣛⡶⢯⣻⣝⣳⣿⣿⠄⠀⠀⠀⠀⠀⠄⠀⡀⠻⣷⣄⠂⢀⠂⠄⠂⢁⠐⠈⣰⣿⡿⢋⡔⢫⠲⣭⢫⡝⡶⣝⣿⣿⣯⢟⣳⢯⢯⡷⢾⡽⣞⣷⢫⣿⣷⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⣿⣿⣿⣾⣽⣷⣫⡽⣯⢷⣫⢷⣻⣿⠆⠀⠀⠀⠀⠀⠠⠀⠀⠄⠘⣿⣇⠠⠐⢀⠁⠂⡈⢰⣿⡿⢁⢇⠺⡥⣛⢴⢫⡞⡵⣯⣿⣿⣯⣻⣭⣟⣳⢟⣯⣽⣾⣽⣿⣿⣿⣿⣟⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢻⣿⣿⣿⣿⣿⣿⣿⣿⣾⣽⣹⢯⢿⣿⡇⠀⠀⠀⠀⠀⠄⠀⠁⡀⠂⢹⣿⠀⡐⠠⠈⠐⠠⣹⣿⢣⠘⣌⢣⠵⣩⢎⠷⣹⢳⣽⣿⣿⣳⢷⣳⢾⣭⣿⣾⣿⣿⣿⣿⣿⣿⣿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣿⣿⣿⡀⠀⠀⠀⠀⢀⠈⠀⠄⠐⣸⣿⠀⡐⠀⠡⢈⢶⣿⣿⡆⢩⠔⣣⢚⠵⣪⣛⡵⣫⣾⣿⡿⣽⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⢿⣾⣿⣿⣿⣿⣟⣿⣿⣿⣶⣦⣤⣀⣀⠠⠈⢀⠂⢽⡏⠀⠀⠌⡐⣬⢿⢾⣿⡯⢄⡋⢴⡩⣞⣱⣾⣼⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣿⡷⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣾⣿⣶⣾⣴⣾⣾⣿⣿⣿⣿⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣿⣷⣿⣿⠿⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
    AXSHSB.CLOG("⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⠛⠛⠻⠻⠟⢿⢻⡟⢿⡻⢟⠿⠛⠟⠛⠛⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", "brightMagenta");
  }
 }

 static {
  this.ascii.hi()
  this.banner()
 }

}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

const ASCII_LIST = {
  hi: AXSH.ascii.hi,
  happy: AXSH.ascii.happy,
  logo: AXSH.ascii.logo,
  logo2: AXSH.ascii.logo2
}
// ! # # # HANDLER # # # \\
function handle(input) {
  const args = input.trim().split(" ");
  const cmd = args[0];

  if (cmd === 'help') {
      AXSH.ascii.hi();
      AXSHSB.CLOG(`\n╔══════════════════════════════════════════╗`, 'brightMagenta');
      AXSHSB.CLOG(`║          AXSH - AXOLOTL SHELL HELP         ║`, 'brightMagenta');
      AXSHSB.CLOG(`╚══════════════════════════════════════════╝\n`, 'brightMagenta');
      
      AXSHSB.CLOG(`MAIN COMMANDS:`, 'brightCyan');
      AXSHSB.CLOG(`──────────────`, 'brightCyan');
      AXSHSB.CLOG(`• help                    - Show this help message`, 'white');
      AXSHSB.CLOG(`• exit                    - Close AXSH`, 'white');
      AXSHSB.CLOG(`• clear                   - Clear the terminal screen`, 'white');
      AXSHSB.CLOG(`• browser                 - Set default browser`, 'white');
      
      AXSHSB.CLOG(`\n'NEW' COMMANDS (AXSH System):`, 'brightCyan');
      AXSHSB.CLOG(`─────────────────────────────`, 'brightCyan');
      AXSHSB.CLOG(`• new log <text>          - Display text in console`, 'white');
      AXSHSB.CLOG(`• new slog <text>         - Display text with spacing`, 'white');
      AXSHSB.CLOG(`• new ascii <name>        - Show available ASCII art:`, 'white');
      AXSHSB.CLOG(`  - hi                     | Axolotl "Hi" art`, 'gray');
      AXSHSB.CLOG(`  - happy                  | Happy axolotl art`, 'gray');
      AXSHSB.CLOG(`  - logo                   | Large AXSH logo`, 'gray');
      AXSHSB.CLOG(`  - logo2                  | Alternative AXSH logo`, 'gray');
      AXSHSB.CLOG(`• new lines <number>      - Add N blank lines`, 'white');
      AXSHSB.CLOG(`• new open <target>       - Open file/folder/URL`, 'white');
      AXSHSB.CLOG(`  - Files: new open C:/folder/file.txt`, 'gray');
      AXSHSB.CLOG(`  - Folders: new open C:/folder/`, 'gray');
      AXSHSB.CLOG(`  - URLs: new open https://example.com`, 'gray');
      
      AXSHSB.CLOG(`\nSYSTEM COMMANDS:`, 'brightCyan');
      AXSHSB.CLOG(`────────────────`, 'brightCyan');
      AXSHSB.CLOG(`• Any CMD/PowerShell command works normally!`, 'white');
      AXSHSB.CLOG(`• Examples: dir, cd, mkdir, ipconfig, etc.`, 'white');
      
      AXSHSB.CLOG(`\nCONFIGURATION:`, 'brightCyan');
      AXSHSB.CLOG(`───────────────`, 'brightCyan');
      AXSHSB.CLOG(`• Customizable prompt in: ./axsh.config.json`, 'white');
      AXSHSB.CLOG(`• Default browser saved in: ./user.json`, 'white');
      
      AXSHSB.CLOG(`\n╔══════════════════════════════════════════╗`, 'brightMagenta');
      AXSHSB.CLOG(`║      Type any command to get started!      ║`, 'brightMagenta');
      AXSHSB.CLOG(`╚══════════════════════════════════════════╝\n`, 'brightMagenta');
      
      rl.prompt();
      return;
  }

  if (cmd === 'browser') {
    const default_browsers = {
      opera: `${process.env.USERPROFILE}/AppData/Local/Programs/Opera GX/opera.exe`,
      chrome: `${process.env.USERPROFILE}/AppData/Local/Google/Chrome/Application/chrome.exe`,
      firefox: `C:/Program Files/Mozilla Firefox/firefox.exe`,
      edge: `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`
    };

    LOG('Default browsers:');
    AXSHSB.NEWLINE(1);
    CLOG('- opera', 'gray');
    CLOG('- chrome', 'gray');
    CLOG('- firefox', 'gray');
    CLOG('- edge', 'gray');
    AXSHSB.NEWLINE(1);

    rl.question('Which browser you want to use as default? ', (answer) => {
      const choice = answer.toLowerCase();

      if (!default_browsers[choice]) {
        AXSHSB.CLOG('Browser not found.', 'red');
        rl.prompt();
        return;
      }

      const userData = loadUser();
      if (!userData.user) userData.user = {};
      if (!userData.user.browser) userData.user.browser = {};

      userData.user.browser.name = choice;
      userData.user.browser.path = default_browsers[choice];

      saveUser(userData);

      DEFAULT_BROWSER = default_browsers[choice];

      AXSHSB.CLOG(`Default browser set to ${choice}`, 'green');
      rl.prompt();
    });

    return;
  }

  if (cmd === 'exit') {
    AXSHSB.CLOG(`Closing ${config.axsh.thislv}...`, 'red')
    process.exit(1)
  }

  if (cmd === 'clear') {
  console.clear();
  AXSH.banner();
  rl.prompt();
  return;
  }

  // * New CMD's=*= \\
  if (cmd === "new") {

    if (args[1]?.toLowerCase() === "log") {
      AXSHSB.LOG(args.slice(2).join(" "))
      rl.prompt()
      return
    }

    if (args[1]?.toLowerCase() === "slog") {
      AXSHSB.NEWLINE(1)
      AXSHSB.LOG(args.slice(2).join(" "))
      AXSHSB.NEWLINE(1)
      rl.prompt()
      return
    }

    if (args[1]?.toLowerCase() === "ascii") {
      const asciiName = args[2]?.toLowerCase();
      if (asciiName in ASCII_LIST) {
        ASCII_LIST[asciiName]();
      } else {
        AXSHSB.CLOG("ASCII not found.", 'red');
      }
      rl.prompt();
      return;
    }


    if (args[1]?.toLowerCase() === "lines" || args[1]?.toLowerCase() === "line") {
      const numLines = Number(args[2]);
      if (isNaN(numLines) || numLines <= 0) {
        AXSHSB.CLOG("Please enter a valid number of lines.", 'yellow');
        rl.prompt();
        return;
      }

      if (numLines >= 1000) {
        AXSHSB.NEWLINE(0);
        rl.question(
          AXSHSB.CLOG("This may occasionally cause lag on your device, do you really want to do this? (Enter or 'y' for confirm | 'n' for no) ", 'yellow'),
          (answer) => {
            AXSHSB.NEWLINE(0);
            if (answer.toLowerCase() === "y" || answer === "") {
              AXSHSB.NEWLINE(numLines);
            }
            rl.prompt();
          }
        );
      } else {
        AXSHSB.NEWLINE(numLines);
        rl.prompt();
      }

      return;
  }

    if (args[1]?.toLowerCase() === "open") {
      const target = args.slice(2).join(" ");

      if (!target) {
        AXSHSB.CLOG("Usage: new open <file|folder|url>", 'yellow');
        rl.prompt();
        return;
      }

      const isURL = /^(https?:\/\/)/i.test(target);
      const userData = loadUser();

      if (isURL) {
        if (!userData?.user?.browser?.path) {
          AXSHSB.CLOG("No default browser set. Use 'browser' command first.", 'yellow');
          rl.prompt();
          return;
        }

        const BROWSERPATH = userData.user.browser.path.replace("%USERPROFILE%", process.env.USERPROFILE);

        spawn(BROWSERPATH, [target], {
          detached: true,
          stdio: "ignore"
        }).unref();
      } else {
        spawn("cmd", ["/c", "start", "", target], {
          detached: true,
          stdio: "ignore"
        }).unref();
      }

      rl.prompt();
      return;
    }
  }

  const child = spawn(config.shell, ["/c", input], {
    stdio: "inherit"
  });

  child.on("exit", () => {
    rl.prompt();
  });
}

rl.setPrompt(PROMPT);
rl.prompt();

rl.on("line", (line) => {
  handle(line);
});