function* BubbleSort(arr){

	for(let i = 0; i<arr.length; i++){
		let flag = 0;
		for(let j = 0; j<arr.length-i; j++){
			if (arr[j] > arr[j+1]){
				const tmp = arr[j+1];
				arr[j+1] = arr[j];
				arr[j] = tmp;
				
				flag = 1;
			}
			yield arr;
		}
		if (flag === 0){
			break;
		}
	}

}



module.exports = {BubbleSort};
