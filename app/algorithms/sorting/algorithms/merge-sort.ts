// Merge sort implementation
export async function mergeSort(
  array: number[],
  start: number,
  end: number,
  getSpeed: () => number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  if (start < end) {
    // Find the middle point
    const mid = Math.floor((start + end) / 2);
    
    // Sort first and second halves
    await mergeSort(array, start, mid, getSpeed, updateArrayState);
    await mergeSort(array, mid + 1, end, getSpeed, updateArrayState);
    
    // Merge the sorted halves
    await merge(array, start, mid, end, getSpeed, updateArrayState);
  }
  
  return Promise.resolve();
}

// Merge function for merge sort
async function merge(
  array: number[],
  start: number,
  mid: number,
  end: number,
  getSpeed: () => number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  // Create temporary arrays
  const leftSize = mid - start + 1;
  const rightSize = end - mid;
  
  const leftArray = new Array(leftSize);
  const rightArray = new Array(rightSize);
  
  // Copy data to temporary arrays
  for (let i = 0; i < leftSize; i++) {
    leftArray[i] = array[start + i];
  }
  for (let j = 0; j < rightSize; j++) {
    rightArray[j] = array[mid + 1 + j];
  }
  
  // Merge the temporary arrays back into the main array
  let i = 0; // Initial index of first subarray
  let j = 0; // Initial index of second subarray
  let k = start; // Initial index of merged subarray
  
  while (i < leftSize && j < rightSize) {
    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }
    
    // Update the array state and wait
    updateArrayState([...array]);
    await new Promise(resolve => setTimeout(resolve, getSpeed()));
    
    k++;
  }
  
  // Copy the remaining elements of leftArray, if any
  while (i < leftSize) {
    array[k] = leftArray[i];
    i++;
    k++;
    
    // Update the array state and wait
    updateArrayState([...array]);
    await new Promise(resolve => setTimeout(resolve, getSpeed()));
  }
  
  // Copy the remaining elements of rightArray, if any
  while (j < rightSize) {
    array[k] = rightArray[j];
    j++;
    k++;
    
    // Update the array state and wait
    updateArrayState([...array]);
    await new Promise(resolve => setTimeout(resolve, getSpeed()));
  }
  
  return Promise.resolve();
}
