
var net = require("net");
var argv = process.argv.slice(2);
var client = null;
var echo = false;
var hostName = null;
var port = null;
var charSet = "utf-8";
// parse, and connect to network, using program arguments
// place callbacks connecting unit to local machine
// set keyboard to unbuffered stream
// set encoding charset and place callback for keyboard
var init = function(print, error, quit, argv, keyboard, argParser) {
    argv.forEach(argParser);
    checkVars();
    client = new net.Socket();
    client.on("data", print);
    client.on("error", error);
    client.on("close", quit);
    client.connect(port, hostName, function() { });
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding(charSet);
    process.stdin.on("data", keyboard);
};
// output socket stream input to screen printer
var print = function(text) {
    process.stdout.write(text);
};
// input keyboard stream to socket stream
var keyboard = function(key) {
    if (echo) print(key);
    client.write(key);
};
// output discription of unit fault to screen printer and call quit
var error = function(e) {
    print(e.toString() + "\n");
    quit();
};
// exit unit process after continuing screen output to a new line
var quit = function() {
    print("\n");
    process.exit();
};
// prepare initial variable values for unit
var argParser = function(arg) {
    if (arg.startsWith("echo")) echo = true;
    else if(arg.startsWith("host:")) hostName = arg.split(":")[1];
    else if (arg.startsWith("port:")) port = parseInt(arg.split(":")[1]);
    else if (arg.startsWith("charSet:")) charSet = arg.split(":")[1];
}
// check for valid values with unit parameters
var checkVars = function() {
    if (hostName == null ||
        port == null) {
      print("\nINITIAL PARAMETERS NOT CORRECT:\n")
      print("REQUIRED: host:<hostname or address> port:<port>\n");
      print("OPTIONAL: echo charSet:<charset name>");
      quit();
    }
}
// initialize unit with prepared function objects
init(print, error, quit, argv, keyboard, argParser);
