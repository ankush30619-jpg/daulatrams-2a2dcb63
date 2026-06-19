const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'public', 'site');

function traverseAndReplace(dir) {
    fs.readdir(dir, (err, files) => {
        if (err) return console.log('Unable to scan directory: ' + err);

        files.forEach((file) => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stat) => {
                if (stat.isDirectory()) {
                    traverseAndReplace(filePath);
                } else if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) return console.log(err);
                        
                        let modified = false;
                        let result = data;
                        
                        // Fix double https://daulatrams.lovable.app
                        const badStr = 'https://daulatrams.lovable.apphttps://daulatrams.lovable.app';
                        if (result.includes(badStr)) {
                            result = result.split(badStr).join('https://daulatrams.lovable.app');
                            modified = true;
                        }
                        
                        if (modified) {
                            fs.writeFile(filePath, result, 'utf8', (err) => {
                                if (err) return console.log(err);
                                console.log('Fixed double URL in ' + filePath);
                            });
                        }
                    });
                }
            });
        });
    });
}

traverseAndReplace(directoryPath);
