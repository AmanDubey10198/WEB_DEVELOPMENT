const sortFunction = require('./sortFunction');

let arr = [1,3,4,5,3];

let val = [];

const sortIt = sortFunction('Selection Sort');

const generator = sortIt(arr);

do{
	val = generator.next().value;
	if (val)
		console.log(val);
}while (val);
