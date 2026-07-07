import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { scanProject } from '../src/scan.js'
import { detectRuntimeFlags } from '../src/flags.js'
import { normalizeFolderPath } from '../src/vite-plugin.js'

const fixtureRoot = join(import.meta.dirname, 'fixtures/project')

describe('scanProject', () => {
  const result = scanProject(fixtureRoot)

  it('finds both fixture components with stable ids and category from folder', () => {
    expect(result.entries.map((e) => e.id)).toEqual([
      'nested/Button.tsx#Button',
      'nested/UserCard.tsx#UserCard',
    ])
    expect(result.entries.every((e) => e.source === 'imported')).toBe(true)
    expect(result.entries.every((e) => e.category === 'nested')).toBe(true)
    expect(result.stats).toMatchObject({ filesScanned: 2, componentsFound: 2, flaggedComponents: 1 })
  })

  it('extracts typed props with defaults, requiredness, and doc comments', () => {
    const button = result.entries.find((e) => e.name === 'Button')!
    expect(button.description).toBe('A plain presentational button.')

    const props = Object.fromEntries(button.props.map((p) => [p.name, p]))
    expect(props.label).toMatchObject({ type: 'string', required: true })
    expect(props.label.description).toBe('The label shown inside the button')
    expect(props.variant.type).toBe('"solid" | "outline"')
    expect(props.variant).toMatchObject({ required: false, defaultValue: 'solid' })
    expect(props.size).toMatchObject({ type: 'number', defaultValue: '14' })
    expect(props.className).toBeDefined()
  })

  it('flags context/data-hook components as needing mocks; leaves pure ones alone', () => {
    const button = result.entries.find((e) => e.name === 'Button')!
    expect(button.flags).toEqual({ usesContext: false, externalHooks: [], needsMocking: false })

    const userCard = result.entries.find((e) => e.name === 'UserCard')!
    expect(userCard.flags).toEqual({
      usesContext: true,
      externalHooks: ['useUserData'],
      needsMocking: true,
    })
  })
})

describe('detectRuntimeFlags', () => {
  it('ignores react hooks, type-only imports, and non-hook named imports', () => {
    const source = [
      "import { useState, useEffect } from 'react'",
      "import type { useFake } from './types'",
      "import { type useAlsoFake, cn } from './utils'",
      "import { Slot } from '@radix-ui/react-slot'",
    ].join('\n')
    expect(detectRuntimeFlags(source)).toEqual({
      usesContext: false,
      externalHooks: [],
      needsMocking: false,
    })
  })

  it('detects member-expression context calls (React.useContext)', () => {
    const source = [
      "import * as React from 'react'",
      'export function C() { const t = React.useContext(Ctx); return null }',
    ].join('\n')
    expect(detectRuntimeFlags(source).usesContext).toBe(true)
  })

  it('catches aliased, default-imported, mixed, and package data hooks', () => {
    const source = [
      "import { useQuery as useData } from '@tanstack/react-query'",
      "import useSWR, { useSWRConfig } from 'swr'",
      "import React, { useCart } from './cart'",
    ].join('\n')
    expect(detectRuntimeFlags(source).externalHooks).toEqual([
      'useCart',
      'useSWR',
      'useSWRConfig',
      'useQuery',
    ].sort())
  })
})

describe('normalizeFolderPath', () => {
  it('unescapes shell-escaped spaces and expands ~', () => {
    expect(normalizeFolderPath('/a/UI\\ library ')).toBe('/a/UI library')
    expect(normalizeFolderPath('~/Dev')).toMatch(/^\/.+\/Dev$/)
    expect(normalizeFolderPath('~/Dev')).not.toContain('~')
  })
})
