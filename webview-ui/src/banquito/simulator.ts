// Banquito Simulator - Simulates Mexican bank employees working
import type { OfficeLayout } from '../office/types.js'
import { loadBanquitoLayout } from './defaultLayout.js'

export interface BankeiroActivity {
  id: number
  name: string
  position: string
  activities: string[]
  phrases: string[]
}

// Our 4 dramatic banqueiros
export const BANQUEIROS: BankeiroActivity[] = [
  {
    id: 1,
    name: "Don Roberto",
    position: "Gerente Dramático",
    activities: [
      "Aprovando empréstimo",
      "Negando crédito", 
      "Analisando garantias",
      "Contando dinheiro",
      "Suspirando dramaticamente",
      "Verificando documentos"
    ],
    phrases: [
      "¡Ay, Dios Mío!",
      "¡Por favor!",
      "¡Que dramático!",
      "Processando...",
      "¡Increíble!"
    ]
  },
  {
    id: 2,
    name: "Doña Carmen",
    position: "Caixa Apaixonada",
    activities: [
      "Atendendo cliente",
      "Contando moedas",
      "Carimbando documentos",
      "Organizando gaveta",
      "Conferindo notas",
      "Digitando números"
    ],
    phrases: [
      "¡Corazón mío!",
      "Calculando...",
      "¡Que paixão!",
      "Trabalhando...",
      "¡Mi amor!"
    ]
  },
  {
    id: 3,
    name: "Panchito",
    position: "Assistente Jovem",
    activities: [
      "Organizando arquivos",
      "Digitando relatórios",
      "Escaneando documentos",
      "Enviando emails",
      "Fazendo backup",
      "Atualizando sistema"
    ],
    phrases: [
      "Codificando...",
      "Processando...",
      "¡Trabajando!",
      "Quase pronto...",
      "¡Vamos!"
    ]
  },
  {
    id: 4,
    name: "La Jefa",
    position: "Diretora Poderosa",
    activities: [
      "Supervisionando equipe",
      "Revisando relatórios",
      "Tomando decisões",
      "Conferindo números",
      "Planejando estratégia",
      "Avaliando risco"
    ],
    phrases: [
      "Supervisionando...",
      "Analisando...",
      "¡Perfecto!",
      "Estrategia...",
      "¡Excelente!"
    ]
  }
]

export class BanquitoSimulator {
  private agentActivityTimers: Map<number, number> = new Map()
  private onMessage: (data: any) => void
  
  constructor(onMessage: (data: any) => void) {
    this.onMessage = onMessage
    // Start simulation immediately
    window.setTimeout(async () => await this.startSimulation(), 100)
  }

  private async startSimulation() {
    console.log('🎭 Starting Banquito simulation...')
    console.log('🏦 BANQUITO - El Banco Pequeñito')
    console.log('👀 Watch the bankers work automatically!')
    console.log('🖱️ Click on characters to see their activities!')
    
    // CORRECT LOAD ORDER per documentation:
    // characterSpritesLoaded → floorTilesLoaded → wallTilesLoaded → furnitureAssetsLoaded → layoutLoaded
    
    // 1. DON'T send characterSpritesLoaded - let system use built-in CHARACTER_TEMPLATES
    console.log('🎭 Using built-in character templates (no characterSpritesLoaded message)')

    // 2. Send floor tiles (simple patterns)
    this.sendMessage({
      type: 'floorTilesLoaded',
      sprites: this.createBasicFloorSprites()
    })

    // 3. Send wall tiles  
    this.sendMessage({
      type: 'wallTilesLoaded',
      sprites: this.createBasicWallSprites()
    })

    // 4. Send furniture assets with proper sprite data
    console.log('🪑 Loading furniture catalog...')
    const catalog = this.getBasicFurnitureCatalog()
    const sprites: Record<string, any> = {}
    
    // Create basic furniture sprites programmatically
    for (const item of catalog) {
      const spriteData = this.createFurnitureSprite(item.width, item.height, item.id)
      sprites[item.id] = spriteData
      console.log(`🪑 Created sprite for ${item.id}: ${item.width}x${item.height}`)
    }
    
    console.log(`📦 Sending ${catalog.length} furniture items with sprites:`)
    console.log('📋 Catalog preview:', catalog.slice(0, 3).map(item => `${item.id} (${item.category})`))
    console.log('🎨 Sprites keys:', Object.keys(sprites).slice(0, 10))
    
    this.sendMessage({
      type: 'furnitureAssetsLoaded',
      catalog: catalog,
      sprites: sprites
    })
    
    console.log('✅ furnitureAssetsLoaded message sent')
    
    // Small delay to ensure furniture processing completes before layout
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('⏱️ Furniture processing delay completed')

    // 5. FINALLY send layout (last in correct order!) - Force loaded layout over fallback
    console.log('🎯 Starting layout loading...')
    const layout = await loadBanquitoLayout()
    console.log('🎯 Layout loaded result:', layout ? 'SUCCESS' : 'FALLBACK')
    
    let finalLayout
    if (layout) {
      console.log(`📐 ✅ Using full layout: ${layout.cols}×${layout.rows} with ${layout.furniture?.length} furniture`)
      console.log('🪑 First 5 furniture pieces from loaded layout:')
      if (layout.furniture) {
        layout.furniture.slice(0, 5).forEach((item, i) => {
          console.log(`  ${i+1}. ${item.type} at (${item.col}, ${item.row}) uid: ${item.uid}`)
        })
      }
      finalLayout = layout
    } else {
      console.warn('⚠️ Could not load default-layout.json, using enhanced fallback')
      finalLayout = this.getDefaultLayout()
      console.log(`📐 📦 Using fallback layout: ${finalLayout.cols}×${finalLayout.rows} with ${finalLayout.furniture?.length} furniture`)
      if (finalLayout.furniture) {
        finalLayout.furniture.forEach((item, i) => {
          console.log(`  Fallback ${i+1}. ${item.type} at (${item.col}, ${item.row}) uid: ${item.uid}`)
        })
      }
    }
    
    console.log('📤 Sending layoutLoaded message...')
    this.sendMessage({
      type: 'layoutLoaded',
      layout: finalLayout
    })
    console.log('✅ layoutLoaded message sent successfully')
    
    // Debug: Show what we're about to render
    console.log(`🎯 LAYOUT SUMMARY - Ready to render ${finalLayout.furniture?.length} furniture pieces on ${finalLayout.cols}×${finalLayout.rows} grid`)

    // 6. NOW send existing banqueiros (after layout is loaded) - Add agents one by one  
    console.log('👨‍💼 Adding banqueiros...')
    BANQUEIROS.forEach((banqueiro, index) => {
      console.log(`🏦 Adding ${banqueiro.name} (ID: ${banqueiro.id})`)
      
      // Send individual agent creation
      this.sendMessage({
        type: 'agentCreated',
        id: banqueiro.id,
        palette: index % 6,
        hueShift: index * 20
      })
      
      // Set initial status  
      this.sendMessage({
        type: 'agentStatus',
        id: banqueiro.id,
        status: 'active'
      })
    })
    
    // Also send existingAgents as backup
    console.log('📋 Sending existingAgents backup...')
    this.sendMessage({
      type: 'existingAgents',
      agents: BANQUEIROS.map(b => b.id),
      agentMeta: {
        1: { palette: 0, hueShift: 0 },
        2: { palette: 1, hueShift: 20 },
        3: { palette: 2, hueShift: 40 },
        4: { palette: 3, hueShift: 60 }
      }
    })

    // 7. Send settings
    this.sendMessage({
      type: 'settingsLoaded',
      soundEnabled: true
    })

    // 8. Ensure we're NOT in edit mode (force game mode)
    console.log('🎮 Forcing GAME MODE (not editor)')
    this.sendMessage({
      type: 'forceGameMode',
      isEditMode: false
    })
    
    // 9. Start activity simulation for each banqueiro (stagger slightly to see them all) 
    console.log('🎭 Starting banqueiro activities...')
    BANQUEIROS.forEach((banqueiro, index) => {
      window.setTimeout(() => {
        console.log(`▶️ Starting activities for ${banqueiro.name}`)
        this.startBanqueiroActivities(banqueiro)
      }, 1000 + (index * 500)) // Extra delay to ensure layout is processed first
    })
  }

  private sendMessage(data: any) {
    // Simulate message event
    this.onMessage(data)
  }

  private startBanqueiroActivities(banqueiro: BankeiroActivity) {
    const startRandomActivity = () => {
      // Random activity
      const activity = banqueiro.activities[Math.floor(Math.random() * banqueiro.activities.length)]
      
      // Start activity
      this.sendMessage({
        type: 'agentToolStart',
        id: banqueiro.id,
        toolId: `${banqueiro.id}_${Date.now()}`,
        status: activity
      })

      this.sendMessage({
        type: 'agentStatus',
        id: banqueiro.id,
        status: 'active'
      })

      // Random duration between 3-10 seconds
      const duration = 3000 + Math.random() * 7000

      window.setTimeout(() => {
        // Finish activity
        this.sendMessage({
          type: 'agentToolDone',
          id: banqueiro.id,
          toolId: `${banqueiro.id}_${Date.now() - duration}`
        })

        this.sendMessage({
          type: 'agentStatus',
          id: banqueiro.id,
          status: 'waiting'
        })

        // Clear after a moment
        window.setTimeout(() => {
          this.sendMessage({
            type: 'agentToolsClear',
            id: banqueiro.id
          })

          this.sendMessage({
            type: 'agentStatus',
            id: banqueiro.id,
            status: 'active'
          })

          // Schedule next activity
          const nextDelay = 2000 + Math.random() * 8000 // 2-10 seconds
          const timer = window.setTimeout(startRandomActivity, nextDelay)
          this.agentActivityTimers.set(banqueiro.id, timer)
        }, 1000)
      }, duration)
    }

    // Start first activity
    startRandomActivity()
  }

  private getDefaultLayout(): OfficeLayout {
    console.log('🏗️ Creating fallback office layout...')
    
    return {
      version: 1,
      cols: 21,
      rows: 21,
      tiles: Array(21 * 21).fill(1), // Basic floor
      furniture: [
        // Bank desks with matching IDs from catalog
        { uid: 'desk_1', type: 'desk_basic', col: 4, row: 4 },
        { uid: 'desk_2', type: 'desk_basic', col: 8, row: 4 },
        { uid: 'desk_3', type: 'desk_basic', col: 12, row: 7 },
        { uid: 'desk_4', type: 'desk_basic', col: 16, row: 10 },
        
        // Bank chairs
        { uid: 'chair_1', type: 'chair_basic', col: 4, row: 6 },
        { uid: 'chair_2', type: 'chair_basic', col: 8, row: 6 },
        { uid: 'chair_3', type: 'chair_basic', col: 12, row: 9 },
        { uid: 'chair_4', type: 'chair_basic', col: 16, row: 12 },
        
        // Office decoration
        { uid: 'plant_1', type: 'plant_basic', col: 2, row: 2 },
        { uid: 'plant_2', type: 'plant_basic', col: 18, row: 18 },
        
        // Filing cabinet/vault
        { uid: 'vault_1', type: 'cabinet_basic', col: 18, row: 3 },
        { uid: 'vault_2', type: 'cabinet_basic', col: 2, row: 18 }
      ]
    }
  }

  private getBasicFurnitureCatalog() {
    // Create catalog that matches the ASSET_XX IDs from default-layout.json
    console.log('📦 Creating furniture catalog with ASSET_XX IDs for compatibility')
    
    const assetTypes = [
      'ASSET_40', 'ASSET_44', 'ASSET_42', 'ASSET_61', 'ASSET_49', 'ASSET_41_0_1',
      'ASSET_7', 'ASSET_18', 'ASSET_17', 'ASSET_143', 'ASSET_142', 'ASSET_83',
      'ASSET_84', 'ASSET_101', 'ASSET_NEW_110', 'ASSET_NEW_111', 'ASSET_NEW_106',
      'ASSET_140', 'ASSET_141', 'ASSET_NEW_112', 'ASSET_109', 'ASSET_99',
      'ASSET_51', 'ASSET_27_A', 'ASSET_34', 'ASSET_33', 'ASSET_102', 'ASSET_72',
      'ASSET_100', 'ASSET_139', 'ASSET_90', 'ASSET_123'
    ]
    
    return assetTypes.map(assetId => {
      // Determine furniture type and properties based on ASSET ID
      let category = 'furniture'
      let isDesk = false
      let width = 32
      let height = 32 
      let footprintW = 1
      let footprintH = 1
      let canPlaceOnWalls = false
      
      // Classify assets based on ID patterns (educated guess from typical office assets)
      if (['ASSET_40', 'ASSET_42', 'ASSET_83', 'ASSET_84'].includes(assetId)) {
        // Desks
        category = 'desks'
        isDesk = true
        width = 32
        height = 16
        footprintW = 2
        footprintH = 1
      } else if (['ASSET_44', 'ASSET_49', 'ASSET_51', 'ASSET_109'].includes(assetId)) {
        // Chairs
        category = 'chairs'
        width = 16
        height = 16
        footprintW = 1
        footprintH = 1
      } else if (['ASSET_99', 'ASSET_101', 'ASSET_27_A'].includes(assetId)) {
        // Plants and decorations
        category = 'decor'
        width = 16
        height = 24
      } else if (['ASSET_142', 'ASSET_143', 'ASSET_123'].includes(assetId)) {
        // Storage/cabinets
        category = 'storage'
        width = 16
        height = 32
        footprintW = 1
        footprintH = 2
      }
      
      return {
        id: assetId,
        name: assetId,
        label: `Office ${assetId}`,
        category: category,
        file: `${assetId}.png`,
        width: width,
        height: height,
        footprintW: footprintW,
        footprintH: footprintH,
        isDesk: isDesk,
        canPlaceOnWalls: canPlaceOnWalls
      }
    })
  }

  private createBasicFloorSprites() {
    // Create 7 simple floor patterns (16x16 each)
    const sprites = []
    for (let pattern = 0; pattern < 7; pattern++) {
      const sprite = []
      for (let y = 0; y < 16; y++) {
        const row = []
        for (let x = 0; x < 16; x++) {
          // Different shades of gray for each pattern
          const base = 80 + pattern * 15
          const variation = (x + y) % 2 === 0 ? 10 : 0
          const gray = base + variation
          const hex = `#${gray.toString(16).padStart(2, '0').repeat(3)}`
          row.push(hex)
        }
        sprite.push(row)
      }
      sprites.push(sprite)
    }
    return sprites
  }

  private createBasicWallSprites() {
    // Create 16 wall bitmask sprites (16x32 each)
    const sprites = []
    for (let mask = 0; mask < 16; mask++) {
      const sprite = []
      for (let y = 0; y < 32; y++) {
        const row = []
        for (let x = 0; x < 16; x++) {
          // Simple dark gray wall color
          const color = '#3A3A5C'
          row.push(color)
        }
        sprite.push(row)
      }
      sprites.push(sprite)
    }
    return sprites
  }

  private createFurnitureSprite(width: number, height: number, type: string) {
    console.log(`🎨 Creating sprite for ${type}: ${width}x${height}`)
    
    // Create a simple colored sprite for furniture with better colors
    const sprite = []
    
    // More distinctive colors based on asset patterns
    let baseColor = '#B8860B' // Dark goldenrod - default
    let borderColor = '#8B4513' // Saddle brown
    
    // Classify by ASSET_ ID patterns for better colors
    if (type.includes('ASSET_40') || type.includes('ASSET_42') || type.includes('ASSET_83') || type.includes('ASSET_84')) {
      // Desks - wood brown
      baseColor = '#A0522D'
      borderColor = '#654321'
    } else if (type.includes('ASSET_44') || type.includes('ASSET_49') || type.includes('ASSET_51')) {
      // Chairs - darker brown  
      baseColor = '#8B4513'
      borderColor = '#5D2F1A'
    } else if (type.includes('ASSET_99') || type.includes('ASSET_101') || type.includes('ASSET_27')) {
      // Plants - green
      baseColor = '#228B22'
      borderColor = '#006400'
    } else if (type.includes('ASSET_142') || type.includes('ASSET_143') || type.includes('ASSET_123')) {
      // Storage - gray
      baseColor = '#708090'
      borderColor = '#2F4F4F'
    }
    
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        // Simple border and fill pattern with shading
        if (x === 0 || y === 0 || x === width-1 || y === height-1) {
          row.push(borderColor) // Border
        } else if (x === 1 || y === 1) {
          // Highlight edge
          const r = parseInt(baseColor.slice(1, 3), 16)
          const g = parseInt(baseColor.slice(3, 5), 16) 
          const b = parseInt(baseColor.slice(5, 7), 16)
          const highlight = `#${Math.min(255, r + 30).toString(16).padStart(2, '0')}${Math.min(255, g + 30).toString(16).padStart(2, '0')}${Math.min(255, b + 30).toString(16).padStart(2, '0')}`
          row.push(highlight)
        } else {
          row.push(baseColor)
        }
      }
      sprite.push(row)
    }
    
    console.log(`✅ Created ${width}x${height} sprite for ${type} with color ${baseColor}`)
    return sprite
  }

  public cleanup() {
    this.agentActivityTimers.forEach(timer => window.clearTimeout(timer))
    this.agentActivityTimers.clear()
  }
}

// Global simulator instance
let simulator: BanquitoSimulator | null = null

export function startBanquitoSimulation(onMessage: (data: any) => void) {
  if (simulator) {
    simulator.cleanup()
  }
  simulator = new BanquitoSimulator(onMessage)
  return simulator
}

export function stopBanquitoSimulation() {
  if (simulator) {
    simulator.cleanup()
    simulator = null
  }
}