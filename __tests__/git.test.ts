/**
 * Unit tests for src/git.ts
 */

import * as git from '../src/git'
import { expect } from '@jest/globals'

describe('git.ts', () => {
  it('throws error if author is empty', async () => {
    const message = 'Bump package to version 1.0.0'
    const author = ''

    await expect(git.createCommitWithAuthor(message, author)).rejects.toThrow(
      'Commit author cannot be empty'
    )
  })

  it('throws error if message is empty', async () => {
    const message = ''

    await expect(git.createCommit(message)).rejects.toThrow(
      'Commit message cannot be empty'
    )
  })

  it('creates a commit with a message', async () => {
    const message = 'Bump package to version 1.0.0'

    await expect(git.createCommit(message)).resolves.not.toThrow()
  })

  it('creates a commit with a message and author', async () => {
    const message = 'Bump package to version 1.0.0'
    const author = 'octocat <noreply@users.github.com>'

    await expect(
      git.createCommitWithAuthor(message, author)
    ).resolves.not.toThrow()
  })

  it('creates a branch', async () => {
    const branchName = 'test-branch'

    await expect(git.createBranch(branchName)).resolves.not.toThrow()
  })

  it('stages a file', async () => {
    const filepath = './test/vendordeps/test.json'

    await expect(git.stageFile(filepath)).resolves.not.toThrow()
  })
})
