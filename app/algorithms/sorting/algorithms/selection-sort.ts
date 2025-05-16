// Selection sort implementation
export async function selectionSort(
  array: number[],
  speed: number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    // Find the minimum element in the unsorted part of the array
    let minIndex = i;
    
    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      
      // Update the array state and wait
      updateArrayState([...array]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
  }
  
  return Promise.resolve();
}
