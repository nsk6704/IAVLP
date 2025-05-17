/**
 * Jump Search implementation
 * Time Complexity: O(√n)
 * Space Complexity: O(1)
 */
export async function jumpSearch(
  arr: number[],
  target: number,
  getDelay: () => number,
  animateStep: (index: number, found: boolean) => void
): Promise<number> {
  const n = arr.length;
  
  // Finding block size to jump
  let step = Math.floor(Math.sqrt(n));
  
  // Finding the block where the target may be present
  let prev = 0;
  while (prev < n && Math.abs(arr[Math.min(step, n) - 1]) < target) {
    // Animate checking the step boundary
    animateStep(Math.min(prev, n-1), false);
    
    // Wait for the animation
    await new Promise(resolve => setTimeout(resolve, getDelay()));
    
    prev = step;
    step += Math.floor(Math.sqrt(n));
    
    if (prev >= n) {
      return -1;
    }
  }
  
  // Linear search in the identified block
  while (prev < n) {
    // Animate checking this element
    animateStep(prev, false);
    
    // Wait for the animation
    await new Promise(resolve => setTimeout(resolve, getDelay()));
    
    // Check if current element is the target
    if (Math.abs(arr[prev]) === target) {
      // Animate finding the element
      animateStep(prev, true);
      return prev;
    }
    
    prev++;
  }
  
  // Target not found
  return -1;
}