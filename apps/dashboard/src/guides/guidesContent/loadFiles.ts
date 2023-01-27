import * as fs from 'fs/promises'
import * as fsWalk from '@nodelib/fs.walk'
import { basename } from 'path'
import { promisify } from 'util'

const walk = promisify(fsWalk.walk)
const mdxExtension = '.mdx'

export interface File {
  content: string
  path: string
  name: string
}

export async function loadMDXFiles(rootPath: string) {
  const entries = await walk(
    rootPath,
    { entryFilter: (e) => !!e.dirent.isFile && e.name.endsWith(mdxExtension) }
  )

  // e.g.: step-1.mdx
  const stepEntries = entries.filter(e => basename(e.path).startsWith('step-'))
  // intro.mdx, rating.mdx
  const introEntry = entries.find(e => basename(e.path) === 'intro.mdx')
  const ratingEntry = entries.find(e => basename(e.path) === 'rating.mdx')


  const stepFiles = await Promise.all(
    stepEntries
      .map(async e => {
        return {
          content: await fs.readFile(e.path, 'utf-8'),
          path: e.path,
          name: e.name,
        }
      })
  )

  const introFile = introEntry && {
    content: await fs.readFile(introEntry.path, 'utf-8'),
    path: introEntry.path,
    name: introEntry.name,
  }

  const ratingFile = ratingEntry && {
    content: await fs.readFile(ratingEntry.path, 'utf-8'),
    path: ratingEntry.path,
    name: ratingEntry.name,
  }

  return {
    stepFiles,
    introFile,
    ratingFile,
  }
}
