const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const assetsDir = path.join(rootDir, 'assets');
const unusedDir = path.join(rootDir, 'unused'); // Make sure we ignore this

// 1. Gather all file contents
const filesToSearch = [];
function findFilesToSearch(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            // Exclude these directories from search
            if (item !== '.git' && item !== 'assets' && item !== 'node_modules' && item !== 'unused') {
                findFilesToSearch(fullPath);
            }
        } else {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
                // Ignore backup files and previous scripts we just made
                if (item !== 'cleanup.js') {
                    filesToSearch.push(fullPath);
                }
            }
        }
    }
}
findFilesToSearch(rootDir);

// specifically add assets/css and assets/js which are also being used
function findAssetCode(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findAssetCode(fullPath);
        } else {
            if (fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
                filesToSearch.push(fullPath);
            }
        }
    }
}
findAssetCode(path.join(assetsDir, 'css'));
findAssetCode(path.join(assetsDir, 'js'));

const allText = filesToSearch.map(f => fs.readFileSync(f, 'utf8')).join('\n');

// 2. Gather all assets
const assetFiles = [];
function findAssetFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            findAssetFiles(fullPath);
        } else {
            assetFiles.push(fullPath);
        }
    }
}
findAssetFiles(assetsDir);

// 3. Check usage and delete
let deletedCount = 0;
for (const file of assetFiles) {
    // We only check if the filename itself appears in the code text
    const filename = path.basename(file);
    let used = false;

    // Check if filename appears anywhere in the used code
    if (allText.includes(filename)) {
        used = true;
    }

    // Always keep core css/js and fonts if they don't have explicit filenames or are loaded dynamically
    if (['style.css', 'main.js', 'script.js'].includes(filename) || file.includes('fonts\\fontawesome') || file.includes('fonts/fontawesome')) {
        used = true;
    }

    if (!used) {
        console.log('Deleting unused asset: ' + file);
        try {
            fs.unlinkSync(file);
            deletedCount++;
        } catch (e) { }
    }
}

// 4. Delete empty folders
function cleanEmptyFolders(dir) {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            cleanEmptyFolders(fullPath);
        }
    }

    const remaining = fs.readdirSync(dir);
    if (remaining.length === 0 && dir !== assetsDir) {
        console.log('Deleting empty folder: ' + dir);
        try {
            fs.rmdirSync(dir);
        } catch (e) { }
    }
}
cleanEmptyFolders(assetsDir);

console.log('Cleanup finished! Deleted files: ' + deletedCount);
