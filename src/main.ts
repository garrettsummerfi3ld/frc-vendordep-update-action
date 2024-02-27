import * as core from '@actions/core'
import * as vendordep from './vendordep'
import * as git from './git'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const files = core.getInput('dir')
    const author = core.getInput('author')

    const currJsonList = await vendordep.getJsonFiles(files)

    const currJsonObjects = await Promise.all(currJsonList.map(async (file: string) => {
      return await vendordep.getJson(file)
    }))

    currJsonObjects.forEach((json: any) => {
      for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          core.debug(`${key}: ${json[key]}`)
        }
      }
    })

    await Promise.all(currJsonObjects.map(async (json: any) => {
      if (json.url) {
        await vendordep.downloadJson(json.url, json.filepath)
      }
    }))

    const newJsonList = await vendordep.getJsonFiles(files)

    const newJsonObjects = await Promise.all(newJsonList.map(async (file: string) => {
      return await vendordep.getJson(file)
    }))

    await Promise.all(currJsonObjects.map(async (json: any) => {
      
    }))

  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
