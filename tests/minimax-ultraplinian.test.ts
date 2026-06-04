/**
 * Unit tests for MiniMax in ULTRAPLINIAN tier system.
 *
 * Validates that MiniMax M3 (default), M2.7, and M2.7-highspeed are correctly
 * placed in the power tier of the multi-model racing engine.
 * Older models (M2.5, M2.1, M2, M1) must be absent from all tiers.
 */
import { describe, it, expect } from 'vitest'
import { ULTRAPLINIAN_MODELS, getModelsForTier } from '../api/lib/ultraplinian'

describe('MiniMax in ULTRAPLINIAN tiers', () => {
  it('should include MiniMax M3 in the power tier', () => {
    expect(ULTRAPLINIAN_MODELS.power).toContain('minimax/minimax-m3')
  })

  it('should include MiniMax M2.7 in the power tier', () => {
    expect(ULTRAPLINIAN_MODELS.power).toContain('minimax/minimax-m2.7')
  })

  it('should include MiniMax M2.7 Highspeed in the power tier', () => {
    expect(ULTRAPLINIAN_MODELS.power).toContain('minimax/minimax-m2.7-highspeed')
  })

  it('should NOT include deprecated M2.5/M2.1/M2/M1 in any tier', () => {
    const allTierModels = [
      ...ULTRAPLINIAN_MODELS.fast,
      ...ULTRAPLINIAN_MODELS.standard,
      ...ULTRAPLINIAN_MODELS.smart,
      ...ULTRAPLINIAN_MODELS.power,
      ...ULTRAPLINIAN_MODELS.ultra,
    ]
    expect(allTierModels).not.toContain('minimax/minimax-m2.5')
    expect(allTierModels).not.toContain('minimax/minimax-m2.1')
    expect(allTierModels).not.toContain('minimax/minimax-m2')
    expect(allTierModels).not.toContain('minimax/minimax-m1')
  })

  it('should include M3 when querying power tier cumulative models', () => {
    const powerModels = getModelsForTier('power')
    expect(powerModels).toContain('minimax/minimax-m3')
  })

  it('should include M3 when querying ultra tier (includes all)', () => {
    const ultraModels = getModelsForTier('ultra')
    expect(ultraModels).toContain('minimax/minimax-m3')
  })

  it('should NOT include M3 in fast tier (frontier flagship belongs in power)', () => {
    const fastModels = getModelsForTier('fast')
    expect(fastModels).not.toContain('minimax/minimax-m3')
  })

  it('should NOT include M3 in standard tier', () => {
    const standardModels = getModelsForTier('standard')
    expect(standardModels).not.toContain('minimax/minimax-m3')
  })

  it('should NOT include M3 in smart tier', () => {
    const smartModels = getModelsForTier('smart')
    expect(smartModels).not.toContain('minimax/minimax-m3')
  })

  it('power tier should have correct number of models', () => {
    expect(ULTRAPLINIAN_MODELS.power.length).toBeGreaterThanOrEqual(10)
  })
})
