function* InsertionSort(arr){

	for(let i = 1; i<arr.length; i++){
		const key = arr[i];
		let j = i-1;
		while (j>-1 && arr[j]>key){
			arr[j+1] = arr[j]
			yield arr;
			j-=1;
		}
		arr[j+1] = key;
		
		yield arr;
	}
}


module.exports = {InsertionSort};
