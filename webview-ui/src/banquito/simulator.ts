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
        // Desks - like DESK_SQUARE_SPRITE (32x32, 2x2 tiles)
        category = 'desks'
        isDesk = true
        width = 32
        height = 32
        footprintW = 2
        footprintH = 2
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
    console.log(`🎨 Creating REALISTIC sprite for ${type}: ${width}x${height}`)
    
    // Create realistic sprites based on furniture type (similar to spriteData.ts patterns)
    if (type.includes('ASSET_40') || type.includes('ASSET_42') || type.includes('ASSET_83') || type.includes('ASSET_84')) {
      return this.createDeskSprite(width, height)
    } else if (type.includes('ASSET_44') || type.includes('ASSET_49') || type.includes('ASSET_51') || type.includes('ASSET_109')) {
      return this.createChairSprite(width, height)
    } else if (type.includes('ASSET_99') || type.includes('ASSET_101') || type.includes('ASSET_27')) {
      return this.createPlantSprite(width, height)
    } else if (type.includes('ASSET_142') || type.includes('ASSET_143') || type.includes('ASSET_123')) {
      return this.createStorageSprite(width, height)
    } else {
      return this.createGenericFurnitureSprite(width, height)
    }
  }

  private createDeskSprite(width: number, height: number) {
    const _ = '' // transparent
    const W = '#8B6914' // wood edge (from spriteData.ts)
    const L = '#A07828' // lighter wood
    const S = '#B8922E' // surface
    const D = '#6B4E0A' // dark edge
    
    const sprite = []
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        if (y === 0 || y === height - 1) {
          row.push(x === 0 || x === width - 1 ? _ : W)
        } else if (x === 0 || x === width - 1) {
          row.push(W)
        } else if (y === 1 || y === height - 2) {
          row.push(L) // highlight
        } else if (y === Math.floor(height / 2)) {
          row.push(D) // horizontal divider
        } else {
          row.push(S) // main surface
        }
      }
      sprite.push(row)
    }
    console.log(`📐 Created DESK sprite ${width}x${height} - wood brown theme`)
    return sprite
  }

  private createChairSprite(width: number, height: number) {
    const _ = ''
    const W = '#8B6914' // wood frame
    const D = '#6B4E0A' // dark frame
    const B = '#5C3D0A' // back
    const S = '#A07828' // seat
    
    const sprite = []
    const backHeight = Math.floor(height * 0.6)
    const seatHeight = Math.floor(height * 0.8)
    
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        if (y < backHeight) {
          // Chair back
          if (x === 0 || x === width - 1 || y === 0) {
            row.push(D)
          } else if (x === 1 || x === width - 2 || y === 1) {
            row.push(W)
          } else {
            row.push(B)
          }
        } else if (y < seatHeight) {
          // Chair seat
          if (x === 0 || x === width - 1) {
            row.push(D)
          } else {
            row.push(S)
          }
        } else {
          // Chair legs
          if ((x < 3 || x >= width - 3) && y < height - 1) {
            row.push(W)
          } else if (y === height - 1 && (x < 3 || x >= width - 3)) {
            row.push(D)
          } else {
            row.push(_)
          }
        }
      }
      sprite.push(row)
    }
    console.log(`🪑 Created CHAIR sprite ${width}x${height} - office chair design`)
    return sprite
  }

  private createPlantSprite(width: number, height: number) {
    const _ = ''
    const G = '#3D8B37' // green leaves (from spriteData.ts)
    const D = '#2D6B27' // dark green
    const T = '#6B4E0A' // trunk/stem
    const P = '#B85C3A' // pot
    const R = '#8B4422' // pot rim
    
    const sprite = []
    const potStart = Math.floor(height * 0.65)
    
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        if (y < height * 0.4) {
          // Leaves area - create leaf pattern
          const centerX = Math.floor(width / 2)
          const leafRadius = Math.min(width / 2.5, height / 3)
          const dist = Math.sqrt((x - centerX) ** 2 + (y - height * 0.2) ** 2)
          
          if (dist < leafRadius) {
            // Random leaf pattern
            row.push((x + y) % 3 === 0 ? D : G)
          } else {
            row.push(_)
          }
        } else if (y < potStart) {
          // Stem area
          const centerX = Math.floor(width / 2)
          if (x >= centerX - 1 && x <= centerX + 1) {
            row.push(T)
          } else {
            row.push(_)
          }
        } else {
          // Pot area
          if (y === potStart && x > 0 && x < width - 1) {
            row.push(R) // pot rim
          } else if ((x === 0 || x === width - 1 || y === height - 1) && y >= potStart) {
            row.push(R) // pot border
          } else if (y > potStart) {
            row.push(P) // pot fill
          } else {
            row.push(_)
          }
        }
      }
      sprite.push(row)
    }
    console.log(`🌱 Created PLANT sprite ${width}x${height} - plant in pot design`)
    return sprite
  }

  private createStorageSprite(width: number, height: number) {
    const W = '#8B6914' // wood frame
    const D = '#6B4E0A' // dark wood
    const R = '#CC4444' // red books
    const B = '#4477AA' // blue books
    const G = '#44AA66' // green books
    const Y = '#CCAA33' // yellow books
    
    const sprite = []
    const shelfCount = 3
    const shelfHeight = Math.floor(height / shelfCount)
    
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          // Frame
          row.push(W)
        } else if (y % shelfHeight === 0 && y > 0) {
          // Shelf separator
          row.push(W)
        } else if (x === 1 || x === width - 2) {
          // Inner frame
          row.push(D)
        } else {
          // Books - create book pattern
          const bookType = (Math.floor(x / 2) + Math.floor(y / shelfHeight)) % 4
          switch (bookType) {
            case 0: row.push(R); break
            case 1: row.push(B); break
            case 2: row.push(G); break
            case 3: row.push(Y); break
            default: row.push(D)
          }
        }
      }
      sprite.push(row)
    }
    console.log(`📚 Created STORAGE sprite ${width}x${height} - bookshelf with colorful books`)
    return sprite
  }

  private createGenericFurnitureSprite(width: number, height: number) {
    const C = '#8B7355' // generic brown
    const L = '#A0855B' // light brown
    const D = '#6B5530' // dark brown
    
    const sprite = []
    for (let y = 0; y < height; y++) {
      const row = []
      for (let x = 0; x < width; x++) {
        if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
          row.push(D) // border
        } else if (x === 1 || y === 1) {
          row.push(L) // highlight
        } else {
          row.push(C) // fill
        }
      }
      sprite.push(row)
    }
    console.log(`🏠 Created GENERIC sprite ${width}x${height} - simple furniture design`)
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