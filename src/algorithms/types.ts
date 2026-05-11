export type StepEventType =
  | 'compare'
  | 'swap'
  | 'mark'
  | 'visit'
  | 'set'
  | 'exclude'
  | 'done'

export interface StepEvent {
  type: StepEventType
  targets: number[]
  description?: string
  value?: number
  extra?: Record<string, any>
}

export type VisualType = 'linear' | 'tree' | 'graph' | 'table' | 'linked-list' | 'array-2d' | 'stack' | 'circular-queue'

export type DataShape =
  | { kind: 'array'; defaultSize: number; min?: number; max?: number }
  | { kind: 'tree'; nodeCount: number }
  | { kind: 'graph'; nodeCount: number; edgeCount: number }
  | { kind: 'table'; rows: number; cols: number }
  | { kind: 'linked-list'; nodeCount: number }
  | { kind: 'array-2d'; rows: number; cols: number; min?: number; max?: number }

export interface AlgorithmMeta {
  id: string
  name: string
  category: string
  categoryLabel: string
  summary: string
  complexity: {
    time: string
    timeBest?: string
    timeWorst?: string
    space: string
  }
  stable?: boolean
  inPlace?: boolean
}

export interface VisualConfig {
  colorScheme?: Partial<typeof import('@/styles/colors').STEP_COLORS>
  animationDuration?: number
  showLabels?: boolean
  dataOptions?: Record<string, any>
}

export interface AlgorithmCategory {
  id: string
  label: string
  icon: string
  description: string
  visualType: VisualType
  algorithms: AlgorithmDefinition[]
}

export interface AlgorithmDefinition {
  meta: AlgorithmMeta
  dataShape: DataShape
  visualType: VisualType
  generateData: () => any
  generator: (data: any, options?: { targetValue?: number }) => Generator<StepEvent>
  pseudoCode: string[]
  visualConfig?: Partial<VisualConfig>
}
