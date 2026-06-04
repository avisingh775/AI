/**
 * Unit tests for MiniMax model configuration in ModelSelector.
 *
 * Validates that MiniMax M3 (default), M2.7, and M2.7-highspeed models
 * are correctly defined in the MODELS array with proper OpenRouter IDs,
 * metadata, and context. Older models (M2.5, M2.1, M2, M1) must be absent.
 */
import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

// Parse the MODELS array from ModelSelector.tsx source to avoid JSX import issues
function parseModelsFromSource(): Array<{
  id: string
  name: string
  provider: string
  description: string
  context: string
}> {
  const source = fs.readFileSync(
    path.resolve(__dirname, '../src/components/ModelSelector.tsx'),
    'utf-8'
  )
  // Extract the MODELS array declaration
  const modelsMatch = source.match(/const MODELS:\s*ModelInfo\[\]\s*=\s*\[([\s\S]*?)\n\]/)
  if (!modelsMatch) throw new Error('Could not find MODELS array in ModelSelector.tsx')

  const modelsBlock = modelsMatch[1]
  const entries: Array<{ id: string; name: string; provider: string; description: string; context: string }> = []

  // Match each model object
  const objectPattern = /\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*provider:\s*'([^']+)',\s*description:\s*'([^']+)',\s*context:\s*'([^']+)'\s*\}/g
  let match
  while ((match = objectPattern.exec(modelsBlock)) !== null) {
    entries.push({
      id: match[1],
      name: match[2],
      provider: match[3],
      description: match[4],
      context: match[5],
    })
  }
  return entries
}

const MODELS = parseModelsFromSource()

describe('MiniMax models in ModelSelector', () => {
  const minimaxModels = MODELS.filter(m => m.provider === 'MiniMax')

  it('should include MiniMax M3 model (default)', () => {
    const m3 = minimaxModels.find(m => m.id === 'minimax/minimax-m3')
    expect(m3).toBeDefined()
    expect(m3!.name).toBe('MiniMax M3')
    expect(m3!.provider).toBe('MiniMax')
    expect(m3!.context).toBe('512K')
  })

  it('should include MiniMax M2.7 model', () => {
    const m27 = minimaxModels.find(m => m.id === 'minimax/minimax-m2.7')
    expect(m27).toBeDefined()
    expect(m27!.name).toBe('MiniMax M2.7')
    expect(m27!.provider).toBe('MiniMax')
    expect(m27!.context).toBe('204K')
  })

  it('should include MiniMax M2.7 Highspeed model', () => {
    const m27hs = minimaxModels.find(m => m.id === 'minimax/minimax-m2.7-highspeed')
    expect(m27hs).toBeDefined()
    expect(m27hs!.name).toBe('MiniMax M2.7 Highspeed')
    expect(m27hs!.provider).toBe('MiniMax')
  })

  it('should NOT include deprecated M2.5/M2.1/M2/M1 models', () => {
    const deprecated = minimaxModels.filter(m =>
      ['minimax/minimax-m2.5', 'minimax/minimax-m2.1', 'minimax/minimax-m2', 'minimax/minimax-m1'].includes(m.id)
    )
    expect(deprecated.length).toBe(0)
  })

  it('should have at least 3 MiniMax models (M3, M2.7, M2.7-highspeed)', () => {
    expect(minimaxModels.length).toBeGreaterThanOrEqual(3)
  })

  it('should use valid OpenRouter model ID format', () => {
    for (const model of minimaxModels) {
      expect(model.id).toMatch(/^minimax\/minimax-/)
    }
  })

  it('should list M3 first (default, latest)', () => {
    const m3Index = MODELS.findIndex(m => m.id === 'minimax/minimax-m3')
    const m27Index = MODELS.findIndex(m => m.id === 'minimax/minimax-m2.7')
    expect(m3Index).toBeLessThan(m27Index)
  })

  it('should have non-empty descriptions', () => {
    for (const model of minimaxModels) {
      expect(model.description.length).toBeGreaterThan(0)
    }
  })
})
