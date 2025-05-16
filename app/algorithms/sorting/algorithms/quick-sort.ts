// Quick sort implementation
export async function quickSort(
  array: number[],
  low: number,
  high: number,
  speed: number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  if (low < high) {
    // Partition the array and get the pivot index
    const pivotIndex = await partition(array, low, high, speed, updateArrayState);
    
    // Recursively sort the sub-arrays
    await quickSort(array, low, pivotIndex - 1, speed, updateArrayState);
    await quickSort(array, pivotIndex + 1, high, speed, updateArrayState);
  }
  
  return Promise.resolve();
}

// Partition function for quick sort
async function partition(
  array: number[],
  low: number,
  high: number,
  speed: number,
  updateArrayState: (newArray: number[]) => void
): Promise<number> {
  // Choose the rightmost element as pivot
  const pivot = array[high];
  
  // Index of smaller element
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than the pivot
    if (array[j] < pivot) {
      i++;
      
      // Swap elements
      [array[i], array[j]] = [array[j], array[i]];
      
      // Update the array state and wait
      updateArrayState([...array]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
  
  // Swap the pivot element with the element at (i + 1)
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  
  // Update the array state and wait
  updateArrayState([...array]);
  await new Promise(resolve => setTimeout(resolve, speed));
  
  return i + 1;
}
