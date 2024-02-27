import * as path from 'path'
import * as glob from '@actions/glob'
import * as tools from '@actions/tool-cache'
import * as fs from 'fs'

/**
 * Return a list of all JSON files in the given directory.
 * @param {string} dir The directory to search for JSON files.
 * @returns {string[]} A list of all JSON files in the given directory.
 */
export async function getJsonFiles(dir: string): Promise<string[]> {
  const globbedJson = await glob.create(`${dir}/**/*.json`)
  const filesList = await globbedJson.glob()
  if (filesList.length === 0) {
    throw new Error('No JSON files found in the given directory')
  }
  return filesList.filter((file: string) => path.extname(file) === '.json')
}

/**
 * Open a file as a JSON object.
 * @param {string} filepath The path to the file to open.
 * @returns {JSON} The JSON object of the file.
 */
export async function getJson(filepath: string): Promise<VendordepJsonObject> {
  const fileContent = fs.readFileSync(filepath, 'utf8')
  const json = JSON.parse(fileContent) as VendordepJsonObject
  if (!json.filename || !json.name || !json.version || !json.uuid) {
    throw new Error('JSON file is formatted incorrectly')
  }
  return json
}

/**
 * Download the JSON file at the given URL and replace the original file.
 * @param {string} url The URL of the JSON file to download.
 * @param {string} filepath The path to the file to replace.
 * @returns {Promise<void>} Resolves when the file has been replaced.
 */
export async function downloadJson(
  url: string,
  filepath: string
): Promise<void> {
  const fileDownload = await tools.downloadTool(url)
  const json = JSON.parse(fs.readFileSync(fileDownload, 'utf8'))
  fs.writeFileSync(filepath, JSON.stringify(json, null, 2))
}

interface VendordepJsonObject {
  filename: string
  name: string
  version: string
  uuid: string
  mavenUrls: string[]
  jsonUrl: string
  javaDependencies: Dependency[]
  jniDependencies: Dependency[]
  cppDependencies: Dependency[]
}

interface Dependency {
  groupId: string
  artifactId: string
  version: string
  libName?: string
  headerClassifier?: string
  sharedLibrary?: boolean
  skipInvalidPlatforms?: boolean
  binaryPlatforms?: string[]
  validPlatforms?: string[]
  isJar?: boolean
}
