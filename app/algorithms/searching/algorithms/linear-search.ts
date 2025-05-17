/**
 * Linear Search implementation
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
export async function linearSearch(
  arr: number[],
  target: number,
  getDelay: () => number,
  animateStep: (index: number, found: boolean) => void
): Promise<number> {
  // Iterate through the array
  for (let i = 0; i < arr.length; i++) {
    // Animate checking this element
    animateStep(i, false);
    
    // Wait for the animation
    await new Promise(resolve => setTimeout(resolve, getDelay()));
    
    // Check if current element is the target
    if (Math.abs(arr[i]) === target) {
      // Animate finding the element
      animateStep(i, true);
      return i;
    }
  }
  
  // Target not found
  return -1;
}