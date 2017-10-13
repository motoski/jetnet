var net = require("net");

var argv = process.argv.slice(2);

var client = null;

var init = function(argv, keyboard, print, connected, quit) {
    client = new net.Socket();
    client.connect(parseInt(argv[1], 10), argv[0], connected);
    client.on("data", print);
    client.on("close", quit);
    process.stdin.resume();
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", keyboard);
};

var print = function(text) {
    process.stdout.write(text);
};

var keyboard = function(text) {
    client.write(text.trim() + "\n");
};

var connected = function() {
    print("connected\r\n");
};

var quit = function() {
    process.exit();
};

init(argv, keyboard, print, connected, quit);
