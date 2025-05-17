// Insertion sort implementation
export async function insertionSort(
  array: number[],
  getSpeed: () => number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  const n = array.length;
  
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    
    // Move elements that are greater than key to one position ahead
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j = j - 1;
      
      // Update the array state and wait
      updateArrayState([...array]);
      await new Promise(resolve => setTimeout(resolve, getSpeed()));
    }
    
    array[j + 1] = key;
    
    // Update the array state and wait
    updateArrayState([...array]);
    await new Promise(resolve => setTimeout(resolve, getSpeed()));
  }
  
  return Promise.resolve();
}
