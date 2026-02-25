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
    
    // 1. Send character sprites (use templates since we don't have actual PNG sprites)
    this.sendMessage({
      type: 'characterSpritesLoaded',
      characters: [] // Empty array will trigger fallback to built-in CHARACTER_TEMPLATES
    })

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

    // 4. Send furniture assets
    this.sendMessage({
      type: 'furnitureAssetsLoaded',
      catalog: this.getBasicFurnitureCatalog(),
      sprites: {}
    })

    // 5. FINALLY send layout (last in correct order!) - Force loaded layout over fallback
    const layout = await loadBanquitoLayout()
    console.log('🎯 Layout loaded:', layout ? 'SUCCESS' : 'FALLBACK')
    
    if (layout) {
      console.log(`📐 Using full layout: ${layout.cols}×${layout.rows} with ${layout.furniture?.length} furniture`)
      this.sendMessage({
        type: 'layoutLoaded',
        layout: layout
      })
    } else {
      console.warn('⚠️ Could not load default-layout.json, using basic fallback')
      this.sendMessage({
        type: 'layoutLoaded',
        layout: this.getDefaultLayout()
      })
    }

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
    return {
      version: 1,
      cols: 20,
      rows: 15,
      tiles: Array(20 * 15).fill(1), // Basic floor
      furniture: [
        // Bank desks
        { uid: 'desk_1', type: 'desk', col: 3, row: 3, color: { h: 30, s: 50, b: -20, c: 10, colorize: true } },
        { uid: 'desk_2', type: 'desk', col: 8, row: 3, color: { h: 30, s: 50, b: -20, c: 10, colorize: true } },
        { uid: 'desk_3', type: 'desk', col: 13, row: 6, color: { h: 30, s: 50, b: -20, c: 10, colorize: true } },
        { uid: 'desk_4', type: 'desk', col: 16, row: 9, color: { h: 25, s: 40, b: -30, c: 15, colorize: true } }, // Manager desk
        // Bank vault
        { uid: 'vault_1', type: 'cabinet', col: 18, row: 2, color: { h: 180, s: 30, b: -40, c: 20, colorize: true } },
        // Customer area
        { uid: 'chair_1', type: 'chair', col: 5, row: 8, color: { h: 35, s: 60, b: -10, c: 5, colorize: true } },
        { uid: 'chair_2', type: 'chair', col: 7, row: 8, color: { h: 35, s: 60, b: -10, c: 5, colorize: true } },
        { uid: 'chair_3', type: 'chair', col: 9, row: 8, color: { h: 35, s: 60, b: -10, c: 5, colorize: true } }
      ]
    }
  }

  private getBasicFurnitureCatalog() {
    return [
      {
        id: 'desk',
        name: 'desk',
        label: 'Mesa Bancária',
        category: 'furniture',
        file: 'desk.png',
        width: 64,
        height: 32,
        footprintW: 2,
        footprintH: 1,
        isDesk: true,
        canPlaceOnWalls: false
      },
      {
        id: 'chair',
        name: 'chair', 
        label: 'Cadeira Cliente',
        category: 'furniture',
        file: 'chair.png',
        width: 32,
        height: 32,
        footprintW: 1,
        footprintH: 1,
        isDesk: false,
        canPlaceOnWalls: false
      },
      {
        id: 'cabinet',
        name: 'cabinet',
        label: 'Cofre Banco',
        category: 'furniture', 
        file: 'cabinet.png',
        width: 64,
        height: 64,
        footprintW: 2,
        footprintH: 2,
        isDesk: false,
        canPlaceOnWalls: false
      }
    ]
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