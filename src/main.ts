import * as core from '@actions/core'
import * as vendordep from './vendordep'
import * as git from './git'
import * as github from '@actions/github'

export const dryrun = core.getInput('dryrun')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const files = core.getInput('dir')
    const author = core.getInput('author')
    const octokit = github.getOctokit(core.getInput('token'))

    core.info(`Checking vendordeps in directory: ${files}`)
    const currJsonList = await vendordep.getJsonFiles(files)

    if (currJsonList.length === 0) {
      throw new Error('No JSON files found in the given directory')
    }

    const currJsonObjects = await Promise.all(
      currJsonList.map(async (file: string) => {
        return await vendordep.getJson(file)
      })
    )

    for (const json of currJsonObjects) {
      core.debug('Old JSON object:')
      for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          core.debug(
            `${key}: ${(json as VendordepJsonObject)[key as keyof VendordepJsonObject]}`
          )
        }
      }
    }

    await Promise.all(
      currJsonObjects.map(async (json: VendordepJsonObject) => {
        if (json.jsonUrl) {
          await vendordep.downloadJson(
            json.jsonUrl,
            `${files}/${json.filename}`
          )
        }
      })
    )

    const newJsonList = await vendordep.getJsonFiles(files)

    const newJsonObjects = await Promise.all(
      newJsonList.map(async (file: string) => {
        return await vendordep.getJson(file)
      })
    )

    for (const json of newJsonObjects) {
      core.debug('New JSON object:')
      for (const key in json) {
        if (Object.prototype.hasOwnProperty.call(json, key)) {
          core.debug(
            `${key}: ${(json as VendordepJsonObject)[key as keyof VendordepJsonObject]}`
          )
        }
      }
    }

    const {
      data: { default_branch }
    } = await octokit.rest.repos.get({
      owner: 'owner',
      repo: 'repo'
    })

    for (const [index, json] of newJsonObjects.entries()) {
      const currJson = currJsonObjects[index]
      const message = `Bump ${json.name} to ${json.version}\n\nBumped to version ${json.version} from ${currJson.version}.\n\n${json.jsonUrl}`
      git.createBranch(`vendordeps/${json.name}/${json.version}`)
      git.stageFile(newJsonList[index])
      if (author) {
        git.createCommitWithAuthor(message, author)
      } else {
        git.createCommit(message)
      }
      git.pushBranch('origin', `vendordeps/${json.name}/${json.version}`)
      createPullRequest(
        octokit,
        `vendordeps/${json.name}/${json.version}`,
        default_branch,
        `Bump ${json.name} to ${json.version}`,
        `Bumped to version ${json.version} from ${currJson.version}.\n\n${json.jsonUrl}`
      )
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function createPullRequest(
  octokit: ReturnType<typeof github.getOctokit>,
  branch: string,
  base: string,
  title: string,
  body: string
): Promise<void> {
  if (dryrun) {
    console.log(`Dry run: create pull request for branch ${branch}`)
    return
  }
  await octokit.rest.pulls.create({
    owner: 'owner',
    repo: 'repo',
    base,
    head: branch,
    title,
    body
  })
  console.log(`Pull request created for branch ${branch}`)
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
