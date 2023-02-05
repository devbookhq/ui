import { Octokit } from '@octokit/rest'
import * as toml from '@iarna/toml'
import JSZip from 'jszip'

import { AppContentJSON } from 'apps/content'

const envConfigName = 'dbk.toml'

export interface File {
  content: string
  name: string
}

export interface EnvConfig {
  id: string
}

export async function getRepo({
  owner,
  repo,
  ref,
  github,
}: {
  owner: string,
  repo: string,
  ref: string,
  github: Octokit,
}) {
  const archive = await github.repos.downloadZipballArchive({
    accept: 'application/vnd.github+json',
    owner,
    repo,
    ref,
  })

  const zip = JSZip()
  await zip.loadAsync(archive.data as string)
  return zip
}

export async function getAppContentFromRepo({
  dir,
  repo,
}: {
  repo: JSZip,
  dir: string,
}): Promise<AppContentJSON | undefined> {
  const rootRegex = dir === '.' || dir === './' ? new RegExp('^[^\/]+\/$') : new RegExp(`^[^\/]+\/${dir}\/$`)
  const rootDir = repo.folder(rootRegex)

  if (rootDir.length === 0) return
  const name = rootDir[0].name
  const root = repo.folder(name)

  if (!root) return

  const envConfigContentRaw = await root.file(envConfigName)?.async('string')
  if (!envConfigContentRaw) {
    throw new Error(`Invalid env config in ${name}`)
  }
  const env = toml.parse(envConfigContentRaw) as unknown as EnvConfig
  const mdx = await Promise.all(root.file(/.+.mdx$/).map(getFile))

  return {
    env,
    mdx,
  }
}

async function getFile(o: JSZip.JSZipObject | null): Promise<File> {
  if (!o) {
    throw new Error('Cannot get file')
  }

  return {
    name: o.name,
    content: await o.async('string')
  }
}
