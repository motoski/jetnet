
var net = require("net");
var argv = process.argv.slice(2);
var client = null;
var echo = false;
var hostName = null;
var port = null;
var charSet = "utf-8";

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

var print = function(text) {
    process.stdout.write(text);
};

var keyboard = function(key) {
    if (echo) print(key);
    client.write(key);
};

var error = function(e) {
    print(e.toString() + "\n");
    quit();
};

var quit = function() {
    print("\n");
    process.exit();
};

var argParser = function(arg) {
    if (arg.startsWith("echo")) echo = true;
    else if(arg.startsWith("host:")) hostName = arg.split(":")[1];
    else if (arg.startsWith("port:")) port = parseInt(arg.split(":")[1]);
    else if (arg.startsWith("charSet:")) charSet = arg.split(":")[1];
}

var checkVars = function() {
    if (hostName == null ||
        port == null) {
      print("\nNEVER RUN FOREIGN CODE WITHOUT FIRST READING IT\n");
      quit();
    }
}

init(print, error, quit, argv, keyboard, argParser);
