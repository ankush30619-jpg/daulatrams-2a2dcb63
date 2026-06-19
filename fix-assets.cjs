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
                        
                        // Using a simple split/join for global replacement
                        if (data.includes('/__l5e/assets-v1/')) {
                            const result = data.split('/__l5e/assets-v1/').join('https://daulatrams.lovable.app/__l5e/assets-v1/');
                            fs.writeFile(filePath, result, 'utf8', (err) => {
                                if (err) return console.log(err);
                                console.log('Fixed ' + filePath);
                            });
                        }
                    });
                }
            });
        });
    });
}

traverseAndReplace(directoryPath);
