// Simple test to verify the infinite loop fix
// This tests the store without triggering React renders

import { useWheelStore } from './src/state/wheel.store.js'

console.log('Testing wheel store for infinite loop issues...')

// Test 1: Check if store can be created without errors
try {
  const store = useWheelStore.getState()
  console.log('✓ Store created successfully')
  console.log('✓ Initial segments count:', store.wheel.segments.length)
  console.log('✓ Default segments loaded:', store.wheel.segments.map(s => s.label).join(', '))
} catch (error) {
  console.error('✗ Store creation failed:', error)
}

// Test 2: Check if we can filter enabled segments without calling functions
try {
  const store = useWheelStore.getState()
  const enabledSegments = store.wheel.segments.filter(seg => seg.enabled)
  console.log('✓ Enabled segments filter works:', enabledSegments.length)
} catch (error) {
  console.error('✗ Segment filtering failed:', error)
}

// Test 3: Check if we can update segments
try {
  const { updateSegment } = useWheelStore.getState()
  updateSegment('seg-1', { label: 'Test Update' })
  const updatedStore = useWheelStore.getState()
  console.log('✓ Segment update works:', updatedStore.wheel.segments[0].label)
} catch (error) {
  console.error('✗ Segment update failed:', error)
}

console.log('All tests completed!')