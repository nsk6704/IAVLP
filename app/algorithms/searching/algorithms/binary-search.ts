/**
 * Binary Search implementation
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 */
export async function binarySearch(
  arr: number[],
  target: number,
  getDelay: () => number,
  animateStep: (index: number, found: boolean) => void
): Promise<number> {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Calculate middle index
    const mid = Math.floor((left + right) / 2);
    
    // Animate checking the middle element
    animateStep(mid, false);
    
    // Wait for the animation
    await new Promise(resolve => setTimeout(resolve, getDelay()));
    
    // Get the absolute value (to handle highlighted elements)
    const value = Math.abs(arr[mid]);
    
    // Check if middle element is the target
    if (value === target) {
      // Animate finding the element
      animateStep(mid, true);
      return mid;
    }
    
    // If target is greater, ignore left half
    if (value < target) {
      left = mid + 1;
    } 
    // If target is smaller, ignore right half
    else {
      right = mid - 1;
    }
  }
  
  // Target not found
  return -1;
}