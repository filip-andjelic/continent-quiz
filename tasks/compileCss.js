var sass = require('node-sass');
var fs = require('fs');
var outputFile = 'public/application.css';

sass.render({
    file: 'src/style/application.scss',
    outputStyle: 'compressed',
    sourceMap: true,
    outFile: outputFile,
}, function(err, result) {
    // Successful compilation of SCSS files
    if (!err){
        fs.writeFile(outputFile, result.css, function(err){
            if (!err){
                console.log('Successfully created application.css file in public folder!')
            }
        });
    } else {
        console.log('Error creating application.css file in public folder!', err);
    }
});