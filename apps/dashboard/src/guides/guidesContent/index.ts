

import { serialize } from 'next-mdx-remote/serialize'
import naturalCompare from 'natural-compare-lite'

import { notEmpty } from 'utils/notEmpty'

import type {
  Guide,
  GuideStep,
  Intro,
  Layout,
  RatingStep,
} from './Guide'
import { GuideDBEntry } from 'queries/db'

// const rootDir = path.join(process.cwd(), 'content')
// const guidesDir = path.join(rootDir, 'guides')
// const guideConfigName = 'guide.json'

// async function getGuideConfig(configPath: string) {
//   const content = await readFile(configPath, 'utf-8')
//   return JSON.parse(content) as Pick<Guide, 'environmentID' | 'title'>
// }

// export async function getGuides() {
//   const guides = await readdir(guidesDir)

//   return await Promise.all(guides.map(async guideID => {
//     const guideDir = path.join(guidesDir, guideID)

//     const guideConfigPath = path.join(guideDir, guideConfigName)
//     const guideConfig = await getGuideConfig(guideConfigPath)

//     return {
//       ...guideConfig,
//       id: guideID,
//     }
//   }))
// }


// export async function getGuideData(id: string): Promise<Guide> {
//   const guideDir = path.join(guidesDir, id)

//   const guideConfigPath = path.join(guideDir, guideConfigName)
//   const guideConfig = await getGuideConfig(guideConfigPath)

//   // Handle the `step-intro.mdx` and `step-rating.mdx` separately if present.
//   const {
//     stepFiles,
//     introFile,
//     ratingFile,
//   } = await loadMDXFiles(guideDir)

//   const guideSteps: GuideStep[] = await Promise.all(stepFiles
//     // The order of steps is determined by the natural sorting (https://www.npmjs.com/package/natural-compare) of the .mdx files -
//     // the `step-10.mdx` will be AFTER `step-2.mdx` even though when sorted alphabeticaly their order is reversed.
//     .sort((a, b) => naturalCompare(a.path, b.path))
//     .map(async (stepFile) => {
//       const mdxData = await serialize(stepFile.content, { parseFrontmatter: true })

//       // Validate if required fields are present
//       if (!mdxData.frontmatter?.title) throw new Error(`'${stepFile.path}': missing 'title'`)

//       const guideStep: GuideStep = {
//         type: 'Guide',
//         title: mdxData.frontmatter.title,
//         layout: mdxData.frontmatter?.layout as unknown as Layout || null,
//         content: mdxData,
//       }

//       return guideStep
//     })
//   )

//   // Parse an validate the `introFile`
//   let intro: Intro
//   if (!introFile) throw new Error(`Missing intro.mdx file for guide '${id}'`)
//   else {
//     const mdxData = await serialize(introFile.content, { parseFrontmatter: true })
//     // Validate if required fields are present
//     if (!mdxData.frontmatter?.title) throw new Error(`'${introFile.path}': missing 'title'`)

//     if (mdxData.frontmatter?.tags && !Array.isArray(mdxData.frontmatter?.tags)) {
//       throw new Error(`'${introFile.path}': unexpect type for the field 'tags'. Expected 'string[]'`)
//     }

//     intro = {
//       title: mdxData.frontmatter.title,
//       tags: (mdxData.frontmatter.tags as unknown as string[]) || [],
//       image: mdxData.frontmatter.image || null,
//       content: mdxData,
//     }
//   }

//   // Parse an validate the `ratingFile`
//   let rating: RatingStep | null
//   if (!ratingFile) rating = null
//   else {
//     const mdxData = await serialize(ratingFile.content, { parseFrontmatter: true })
//     // Validate if required fields are present
//     if (!mdxData.frontmatter?.title) throw new Error(`'${ratingFile.path}': missing 'title'`)
//     rating = {
//       type: 'Rating',
//       title: mdxData.frontmatter.title,
//       content: mdxData,
//     }
//   }

//   const steps = [...guideSteps.filter(notEmpty), rating].filter(Boolean) as (GuideStep | RatingStep)[]

//   return {
//     id,
//     intro,
//     ...guideConfig,
//     steps,
//   }
// }
export async function getGuideData(g: GuideDBEntry): Promise<Guide> {
  const stepFiles = g.content?.steps.filter(f => f.name.includes('step-'))!
  const introFile = g.content?.steps.find(f => f.name.includes('intro.mdx'))!
  const ratingFile = g.content?.steps.find(f => f.name.includes('rating.mdx'))!

  const guideSteps: GuideStep[] = await Promise.all(stepFiles
    // The order of steps is determined by the natural sorting (https://www.npmjs.com/package/natural-compare) of the .mdx files -
    // the `step-10.mdx` will be AFTER `step-2.mdx` even though when sorted alphabeticaly their order is reversed.
    .sort((a, b) => naturalCompare(a.name, b.name))
    .map(async (stepFile) => {
      const mdxData = await serialize(stepFile.content, { parseFrontmatter: true })

      // Validate if required fields are present
      if (!mdxData.frontmatter?.title) throw new Error(`'${stepFile.name}': missing 'title'`)

      const guideStep: GuideStep = {
        type: 'Guide',
        title: mdxData.frontmatter.title,
        layout: mdxData.frontmatter?.layout as unknown as Layout || null,
        content: mdxData,
      }

      return guideStep
    })
  )

  // Parse an validate the `introFile`
  let intro: Intro
  if (!introFile) throw new Error(`Missing intro.mdx file for guide '${g.id}'`)
  else {
    const mdxData = await serialize(introFile.content, { parseFrontmatter: true })
    // Validate if required fields are present
    if (!mdxData.frontmatter?.title) throw new Error(`'${introFile.name}': missing 'title'`)

    if (mdxData.frontmatter?.tags && !Array.isArray(mdxData.frontmatter?.tags)) {
      throw new Error(`'${introFile.name}': unexpect type for the field 'tags'. Expected 'string[]'`)
    }

    intro = {
      title: mdxData.frontmatter.title,
      tags: (mdxData.frontmatter.tags as unknown as string[]) || [],
      image: mdxData.frontmatter.image || null,
      content: mdxData,
    }
  }

  // Parse an validate the `ratingFile`
  let rating: RatingStep | null
  if (!ratingFile) rating = null
  else {
    const mdxData = await serialize(ratingFile.content, { parseFrontmatter: true })
    // Validate if required fields are present
    if (!mdxData.frontmatter?.title) throw new Error(`'${ratingFile.name}': missing 'title'`)
    rating = {
      type: 'Rating',
      title: mdxData.frontmatter.title,
      content: mdxData,
    }
  }

  const steps = [...guideSteps.filter(notEmpty), rating].filter(Boolean) as (GuideStep | RatingStep)[]

  return {
    id: g.id,
    intro,
    title: g.content?.guide.title!,
    environmentID: g.content?.env.id!,
    steps,
  }
}

// export async function getAllGuides(): Promise<Guide[]> {
//   const guideIDs = readdirSync(guidesDir)
//   const guides = (await Promise.all(guideIDs.map(id => getGuideData(id))))
//     .sort((g1, g2) => {
//       if (g1.id < g2.id) return -1
//       else if (g2.id > g1.id) return 1
//       return 0
//     })

//   return guides
// }
