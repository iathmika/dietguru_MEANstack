const fs = require('fs'); 
  
// Allowing only read permission 
console.log("Giving only read permission to the user"); 
//fs.chmodSync("habits.txt", fs.constants.S_IRUSR); 
  
// Test the read permission 
fs.access('habits.txt', fs.constants.R_OK, (err) => { 
  console.log('\n> Checking Permission for reading the file'); 
  if (err) 
    console.error('No Read access'); 
  else
    console.log('File can be read'); 
}); 
  
// Test  write permissions 
fs.access('habits.txt', fs.constants.R_OK  
                  | fs.constants.W_OK, (err) => { 
  console.log('\n> Checking Permission for reading"  + " and writing to file'); 
  if (err)
    console.error('No Write access'); 
  else
    console.log('File can be written'); 
}); 

//Check if file exists without blocking


var path = './habits.txt'

fs.access(path, fs.F_OK, (err) => {
  if (err) {
    console.error(err)
    return
  }
else {console.log("File exists. ") }
  //file exists
})

//check if file exists by file opening



try {
  if (fs.existsSync(path)) {
    //file exists
  }
} catch(err) {
  console.error(err)
}

//determining line count
filePath =   './input.txt'
fileBuffer = fs.readFileSync(filePath); 
to_string = fileBuffer.toString(); 
split_lines = to_string.split("\n"); 
console.log("Number of lines in file: "+(split_lines.length-1));


