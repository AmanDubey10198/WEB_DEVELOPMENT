function* SelectionSort(arr){

	for(let i = 0; i<arr.length; i++){
        let pos = arr.length-1;
        for(let j = arr.length-1; j>=i; j--){
            if( arr[j] < arr[pos]){
                pos = j;
            }
            
    		yield arr;
        }

        const tmp = arr[i];
        arr[i] = arr[pos];
        arr[pos] = tmp;
        
	}
}


module.exports = {SelectionSort};
