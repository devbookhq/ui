import type { GetServerSideProps } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { apps, apps_feedback } from 'database'
import type { ParsedUrlQuery } from 'querystring'

import Project from 'components/Project'
import { prisma } from 'queries/prisma'

interface PathProps extends ParsedUrlQuery {
  id: string
}

export const getServerSideProps: GetServerSideProps<Props, PathProps> = async (ctx) => {
  if (!ctx.params?.id) {
    return {
      notFound: true
    }
  }

  const supabase = createServerSupabaseClient(ctx)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return {
      redirect: {
        destination: '/sign',
        permanent: false,
      },
    }
  }

  const app = await prisma.apps.findUnique({
    where: {
      id: ctx.params.id,
    },
    include: {
      github_repositories: {
        select: {
          repository_fullname: true,
        },
      },
    },
  })

  if (!app) {
    return {
      notFound: true,
    }
  }

  const feedback = await prisma.apps_feedback.findMany({
    where: {
      appId: ctx.params.id,
    },
  })

  return {
    props: {
      app,
      feedback,
    }
  }
}

interface Props {
  app: apps & {
    github_repositories: {
      repository_fullname: string;
    } | null
  }
  feedback: apps_feedback[]
}

function ProjectPage({ app, feedback }: Props) {
  return (
    <Project
      app={app}
      feedback={feedback}
    />
  )
}

export default ProjectPage
