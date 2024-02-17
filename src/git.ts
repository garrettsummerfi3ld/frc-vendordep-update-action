import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';

/**
 * Create a branch with a given name
 * @param {string} branchName The name of the branch to create
 * @returns {Promise<void>} Resolves when the branch has been created
 */
export async function createBranch(branchName: string): Promise<void> {
  const git: SimpleGit = simpleGit()
  await git.checkoutLocalBranch(branchName)
}

/**
 * Add a file to the staging area
 * @param {string} filepath The path to the file to stage
 * @returns {Promise<void>} Resolves when the file has been staged
 */
export async function stageFile(filepath: string): Promise<void> {
  const git: SimpleGit = simpleGit()
  await git.add(filepath)
}

/**
 * Create a commit with a given message and author
 * @param {string} message The message for the commit
 * @param {string} author The author for the commit
 * @returns {Promise<void>} Resolves when the commit has been created
 * @throws {Error} If the commit message is empty
 * @throws {Error} If the commit author is empty
 */
export async function createCommit(message: string, author: string): Promise<void> {
  if (!message) {
    throw new Error('Commit message cannot be empty')
  }
  if (!author) {
    throw new Error('Commit author cannot be empty')
  }
  const git: SimpleGit = simpleGit()
  await git.commit(message, [], { '--author': author })
}

/**
 * Push the current branch to the remote repository
 * @param {string} remote The name of the remote repository
 * @param {string} branch The name of the branch
 * @returns {Promise<void>} Resolves when the branch has been pushed
 */
export async function pushBranch(remote: string, branch: string): Promise<void> {
  const git: SimpleGit = simpleGit()
  await git.push(remote, branch)
}

