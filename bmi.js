// Importing the Required Modules 
const fs = require('fs'); 
const readline = require('readline'); 
  
// Creating a readable stream from file 
// readline module reads line by line  
// but from a readable stream only. 
const file = readline.createInterface({ 
    input: fs.createReadStream('input.txt'), 
    output: process.stdout, 
    terminal: false
}); 
  
// Printing the content of file line by 
//  line to console by listening on the 
// line event which will triggered 
// whenever a new line is read from 
// the stream 
file.on('line', (line) => { 
    console.log(line); 
}); 

console.log(process.argv.slice(2));
var height = parseFloat(process.argv.slice(2)[0]);
var weight = parseFloat(process.argv.slice(2)[1]);
bmi = (weight/(height*height)).toFixed(2);

if(bmi<18.5)
{
    index = "Under Weight";
}
else if (bmi>=18.5 && bmi<=24.9)
{
    index = "Normal Weight";
}
else if (bmi>24.9 &&  bmi<=29.9)
{
    index = "over Weight";
}
else
{
    index = "obesity";
}

console.log("Your BMI is: "+bmi);
console.log("Result: "+index);