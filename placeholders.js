const setting = process.argv.slice(2)[0].toLowerCase();
const placeholders = setting == "mcm" ? "// CRACKED BY OGs" : "// CRACKED BY OGs";

const fs = require('fs');

const ignore = [
    "node_modules",
    "configs",
    "data",
    "assets"
]

const getJSFilesInDir = (directory) => {
    console.log('Checking ' + directory);
    const files = fs.readdirSync(directory);

    files
        .filter(f => f.endsWith(".js"))
        .forEach(f => {
            fs.appendFile(directory + "/" + f, "\n" + placeholders, () => { })
        })
    console.log(`Got ${files.filter(f => f.endsWith(".js")).length} js files in ${directory}`);

    files
        .filter(f => !f.includes(".") && !ignore.map(i => i.toLowerCase()).includes(f))
        .forEach(dir => {
            getJSFilesInDir(directory + "/" + dir);
        })
}

getJSFilesInDir("./");
// CRACKED BY OGs