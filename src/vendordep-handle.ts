/**
 * Return a list of all JSON files in the given directory.
 * @param {string} dir The directory to search for JSON files.
 * @returns {string[]} A list of all JSON files in the given directory.
 */
export async function getJSONFiles(dir: string): Promise<string[]> {
  const fs = require('fs')
  const path = require('path')
  const filesList = fs.readdirSync(dir)
  return filesList.filter((file: string) => path.extname(file) === '.json')
}

/**
 * Open a file as a JSON object.
 * @param {string} filepath The path to the file to open.
 * @returns {JSON} The JSON object of the file.
 */
export async function getJSON(filepath: string): Promise<string> {
  const fs = require('fs')
  const fileContent = fs.readFileSync(filepath, 'utf8')
  const json = JSON.parse(fileContent)
  return json
}

/**
 * Download the JSON file at the given URL and replace the original file.
 * @param {string} url The URL of the JSON file to download.
 * @param {string} filepath The path to the file to replace.
 * @returns {Promise<void>} Resolves when the file has been replaced.
 */
export async function downloadJSON(url: string, filepath: string): Promise<void> {
  const fetch = require('node-fetch')
  const response = await fetch(url)
  const json = await response.json()
  const fs = require('fs')
  fs.writeFileSync(filepath, JSON.stringify(json, null, 2))
}