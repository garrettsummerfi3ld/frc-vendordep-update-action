/**
 * Unit tests for src/vendordep.ts
 */

import * as vendordep from '../src/vendordep'
import { expect } from '@jest/globals'
import path from 'path'
import * as fs from 'fs'

describe('vendordep.ts', () => {
  const mockDir = path.join(__dirname, 'mockDir')
  const mockFile = path.join(mockDir, 'mockFile.json')
  const mockUrl = 'http://example.com/mockFile.json'
  const mockJson = {
    filename: 'mockFile.json',
    name: 'Mock Name',
    version: '1.0.0',
    uuid: '1234-5678-91011',
    mavenUrls: [],
    jsonUrl: '',
    javaDependencies: [],
    jniDependencies: [],
    cppDependencies: []
  }

  beforeAll(() => {
    fs.mkdirSync(mockDir, { recursive: true })
    fs.writeFileSync(mockFile, JSON.stringify(mockJson))
  })

  afterAll(() => {
    fs.rmSync(mockDir, { recursive: true, force: true })
  })

  describe('getJsonFiles', () => {
    it('should return a list of JSON files in the directory', async () => {
      const files = await vendordep.getJsonFiles(mockDir)
      expect(files).toContain(mockFile)
    })

    it('should throw an error if no JSON files are found', async () => {
      const emptyDir = path.join(mockDir, 'empty')
      fs.mkdirSync(emptyDir)
      await expect(vendordep.getJsonFiles(emptyDir)).rejects.toThrow('No JSON files found in the given directory')
    })
  })

  describe('getJson', () => {
    it('should return a JSON object if the file is correctly formatted', async () => {
      const json = await vendordep.getJson(mockFile)
      expect(json).toEqual(mockJson)
    })

    it('should throw an error if the JSON file is incorrectly formatted', async () => {
      const badJsonFile = path.join(mockDir, 'badFile.json')
      fs.writeFileSync(badJsonFile, JSON.stringify({}))
      await expect(vendordep.getJson(badJsonFile)).rejects.toThrow('JSON file is formatted incorrectly')
    })
  })

  describe('downloadJson', () => {
    it('should download and replace the JSON file', async () => {
      await vendordep.downloadJson(mockUrl, mockFile)
      const json = JSON.parse(fs.readFileSync(mockFile, 'utf8'))
      expect(json).toEqual(mockJson)
    })
  })
})