/**
 * Unit tests for src/vendordep.ts
 */

import * as vendordep from '../src/vendordep'
import { expect } from '@jest/globals'
import path from 'path'

describe('vendordep.ts', () => {
  it('throw if no JSON files found', async () => {
    const files = './test/vendordeps/empty'
    await expect(vendordep.getJsonFiles(files)).rejects.toThrow(
      'No JSON files found in the given directory'
    )
  })

  it('throw if JSON file is formatted incorrectly', async () => {
    const file = './test/vendordeps/test.json'
    await expect(vendordep.getJson(file)).rejects.toThrow(
      'JSON file is formatted incorrectly'
    )
  })

  it('download JSON file', async () => {
    const url = 'https://not.a.real.domain.com/test.json'
    const file = './test/vendordeps/test.json'
    await expect(vendordep.downloadJson(url, file)).resolves.toThrow()
  })

  it('get JSON files', async () => {
    const files = './test/vendordeps'
    const receivedAbsolute = await vendordep.getJsonFiles(files)
    const received = receivedAbsolute.map(p => path.relative(process.cwd(), p))

    await expect(received).resolves.toEqual([
      'test/vendordeps/test.json',
      'test/vendordeps/bad.json'
    ])
  })

  it('get JSON', async () => {
    const file = './test/vendordeps/test.json'
    expect(vendordep.getJson(file)).not.toThrow()
  })

  it('download JSON', async () => {
    const url = 'https://software-metadata.revrobotics.com/REVLib-2024.json'
    const file = './test/vendordeps/test.json'
    await expect(vendordep.downloadJson(url, file)).resolves.not.toThrow()
  })
})
