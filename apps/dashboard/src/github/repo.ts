import { Octokit } from '@octokit/rest'
import * as toml from '@iarna/toml'
import JSZip from 'jszip'

import getClient from './octokit'
import path from 'path'
import { notEmpty } from 'utils/notEmpty'

const guideConfigName = 'guide.json'
const envConfigName = 'dbk.toml'

export interface File {
  content: string
  name: string
}

async function getGuideDirs({
  owner,
  repo,
  dir,
  ref,
  github,
}: {
  owner: string,
  repo: string,
  dir: string,
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

  const regex = dir === '.' || dir === './' ? new RegExp('^[^\/]+\/[^\/]+\/$') : new RegExp(`^[^\/]+\/${dir}\/[^\/]+\/$`)
  const devbookFiles = zip.folder(regex)

  return devbookFiles.map(d => {
    const dir = zip.folder(d.name)
    return dir ? { dir, name: d.name } : undefined
  }).filter(notEmpty)
}

export async function getGuidesFromRepo({
  installationID,
  owner,
  repo,
  dir,
  ref,
}: {
  installationID: number,
  owner: string,
  repo: string,
  dir: string,
  ref: string,
}) {
  const github = await getClient({ installationID })
  const guideDirs = await getGuideDirs({
    ref,
    dir,
    github,
    owner,
    repo,
  })

  const guides = guideDirs.map(async (g) => {
    const slug = path.basename(g.name)

    const guideConfigContentRaw = await g.dir.file(guideConfigName)?.async('string')
    if (!guideConfigContentRaw) {
      throw new Error(`Invalid guide config for guide ${g.name}`)
    }
    const guideConfig = JSON.parse(guideConfigContentRaw)

    const envConfigContentRaw = await g.dir.file(envConfigName)?.async('string')
    if (!envConfigContentRaw) {
      throw new Error(`Invalid env config for guide ${g.name}`)
    }
    const envConfig = toml.parse(envConfigContentRaw)

    const introFile = await getFile(
      g.dir.file('intro.mdx')
    )

    const ratingFile = await getFile(
      g.dir.file('rating.mdx')
    )

    const stepFiles = await Promise.all(g.dir.file(/step-.+.mdx$/).map(getFile))

    return {
      slug,
      stepFiles,
      ratingFile,
      introFile,
      envConfig,
      guideConfig,
    }
  })

  return await Promise.all(guides)
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
