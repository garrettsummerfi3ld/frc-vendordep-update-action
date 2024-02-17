import * as core from '@actions/core'
import * as vendordep from './vendordep'
import * as git from './git'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get the directory from the inputted arguments for vendordeps
    const files = core.getInput('dir')
    const author = core.getInput('author')
    const message = core.getInput('message')

    // Get all JSON files in the directory
    const jsonList = await vendordep.getJsonFiles(files)

    // Read the contents of each JSON file as a JSON object, and put the JSON object into a list
    const jsonObjects = await Promise.all(jsonList.map(async (file: string) => {
      return await vendordep.getJson(file)
    }))

    // For each JSON object, log the keys and values
    jsonObjects.forEach((json: any) => {
      for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          core.debug(`${key}: ${json[key]}`)
        }
      }
    })

    // From each JSON object, get the value of the "url" key and download the JSON file at that URL to replace the original file
    await Promise.all(jsonObjects.map(async (json: any) => {
      if (json.url) {
        await vendordep.downloadJson(json.url, json.filepath)
      }
    }))

    // For each new JSON file, create a new commit on a new branch with only the changes to a single JSON file
    await Promise.all(jsonObjects.map(async (json: any) => {
      if (json.filepath) {
        await git.createBranch("vendordep/" + json.name + "-" + json.frcYear + "-" + json.version)
        await git.stageFile(json.filepath)
        await git.createCommit("Bump " + json.name + " to " + json.version, author)
      }
    }))

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
