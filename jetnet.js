var net = require("net");
var argv = process.argv.slice(2);
var client = null;
var init = function(print, error, quit, argv, keyboard) {
    client = new net.Socket();
    client.on("data", print);
    client.on("error", error);
    client.on("close", quit);
    client.connect(parseInt(argv[1], 10), argv[0], function() { });
    process.stdin.resume();
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", keyboard);
};
var print = function(text) {
    process.stdout.write(text);
};
var keyboard = function(key) {
    client.write(key);
};
var error = function(e) {
    print(e.toString() + "\n");
    quit();
};
var quit = function() {
    process.exit();
};
init(print, error, quit, argv, keyboard);
