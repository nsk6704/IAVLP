async function testComplexityAnalyzer() {
  const testCode = `
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

  try {
    const response = await fetch('http://localhost:3000/api/analyze-complexity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCode,
        language: 'javascript'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Analysis result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testComplexityAnalyzer();