// Bubble sort implementation
export async function bubbleSort(
  array: number[],
  getSpeed: () => number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  const n = array.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (array[j] > array[j + 1]) {
        // Swap elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        
        // Update the array state and wait
        updateArrayState([...array]);
        await new Promise(resolve => setTimeout(resolve, getSpeed()));
      }
    }
  }
  
  return Promise.resolve();
}
