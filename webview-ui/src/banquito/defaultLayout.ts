// Default bank layout for Banquito
import type { OfficeLayout } from '../office/types.js'

// Load the default office layout and adapt it for our bank
export async function loadBanquitoLayout(): Promise<OfficeLayout | null> {
  try {
    console.log('🏦 Loading Banquito default layout...')
    const response = await fetch('./assets/default-layout.json')
    if (!response.ok) {
      console.error('Failed to load default-layout.json:', response.statusText)
      return null
    }
    
    const layout = await response.json() as OfficeLayout
    console.log(`🏢 Loaded office layout: ${layout.cols}×${layout.rows} with ${layout.furniture?.length || 0} furniture pieces`)
    
    // TODO: Could adapt furniture for bank theme here
    // e.g., replace some office furniture with bank counters, safes, etc.
    
    return layout
  } catch (error) {
    console.error('Error loading Banquito layout:', error)
    return null
  }
}