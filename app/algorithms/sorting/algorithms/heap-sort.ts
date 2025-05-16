// Heap sort implementation
export async function heapSort(
  array: number[],
  speed: number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  const n = array.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(array, n, i, speed, updateArrayState);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [array[0], array[i]] = [array[i], array[0]];
    
    // Update the array state and wait
    updateArrayState([...array]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Call max heapify on the reduced heap
    await heapify(array, i, 0, speed, updateArrayState);
  }
  
  return Promise.resolve();
}

// To heapify a subtree rooted with node i
async function heapify(
  array: number[],
  n: number,
  i: number,
  speed: number,
  updateArrayState: (newArray: number[]) => void
): Promise<void> {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // Left child
  const right = 2 * i + 2; // Right child
  
  // If left child is larger than root
  if (left < n && array[left] > array[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && array[right] > array[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    // Swap
    [array[i], array[largest]] = [array[largest], array[i]];
    
    // Update the array state and wait
    updateArrayState([...array]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Recursively heapify the affected sub-tree
    await heapify(array, n, largest, speed, updateArrayState);
  }
  
  return Promise.resolve();
}
