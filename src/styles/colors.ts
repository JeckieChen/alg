export const STEP_COLORS = {
  default: '#3B82F6',
  comparing: '#F59E0B',
  swapping: '#EF4444',
  visiting: '#8B5CF6',
  sorted: '#10B981',
  excluded: '#9CA3AF',
  pivot: '#EC4899',
} as const

export type StepColorKey = keyof typeof STEP_COLORS
