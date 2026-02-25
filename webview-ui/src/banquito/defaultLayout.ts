// Default bank layout for Banquito
import type { OfficeLayout } from '../office/types.js'

// Load the default office layout and adapt it for our bank
export async function loadBanquitoLayout(): Promise<OfficeLayout | null> {
  try {
    console.log('🏦 Loading Banquito default layout...')
    console.log('🔍 Fetch URL: ./assets/default-layout.json')
    
    const response = await fetch('./assets/default-layout.json')
    console.log(`📡 Response status: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      console.error('❌ Failed to load default-layout.json:', response.status, response.statusText)
      return null
    }
    
    const text = await response.text()
    console.log(`📄 Response length: ${text.length} chars`)
    console.log(`📄 First 200 chars: ${text.substring(0, 200)}`)
    
    const layout = JSON.parse(text) as OfficeLayout
    console.log(`🏢 ✅ Loaded office layout: ${layout.cols}×${layout.rows} with ${layout.furniture?.length || 0} furniture pieces`)
    console.log(`📋 Furniture items:`, layout.furniture?.slice(0, 5).map(f => `${f.type} at (${f.col},${f.row})`))
    
    return layout
  } catch (error) {
    console.error('❌ Error loading Banquito layout:', error)
    console.error('📍 Stack trace:', error instanceof Error ? error.stack : String(error))
    return null
  }
}