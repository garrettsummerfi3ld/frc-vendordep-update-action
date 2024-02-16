import * as core from '@actions/core'
import { getJSONFiles, getJSON } from './vendordep-handle'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Get the directory from the inputted arguments for vendordeps
    const files = core.getInput('dir')

    // Get all JSON files in the directory
    const jsonList = await getJSONFiles(files)

    // Read the contents of each JSON file, and 
    for (const file of jsonList) {
      core.info(`Reading file: ${file}`)
      const json = await getJSON(file)
      core.info(`File contents: ${JSON.stringify(json)}`)
    }

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
