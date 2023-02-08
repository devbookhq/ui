import type { GetServerSideProps } from 'next'
import { LayoutGrid, Plus } from 'lucide-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { apps } from 'database'

import ItemList from 'components/ItemList'
import Text from 'components/typography/Text'
import { prisma } from 'queries/prisma'
import Button from 'components/Button'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
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

  const user = await prisma.auth_users.findUniqueOrThrow({
    where: {
      id: session.user.id,
    },
    include: {
      users_teams: {
        include: {
          teams: {
            include: {
              apps: true,
            },
          }
        }
      }
    },
  })

  const hasDefaultTeam = user?.users_teams.some(t => t.teams.is_default)
  if (!hasDefaultTeam) {
    // User is one of the old users without default team - create default team.
    const team = await prisma.teams.create({
      data: {
        name: session.user.email || session.user.id,
        is_default: true,
        users_teams: {
          create: {
            users: {
              connect: {
                id: session.user.id,
              }
            }
          }
        },
      },
      include: {
        apps: true
      },
    })

    return {
      props: {
        apps: team.apps,
      }
    }
  }

  // Show apps from all teams for now.
  const appsFromAllTeams = user.users_teams.flatMap(t => t.teams.apps)
  return {
    props: {
      apps: appsFromAllTeams,
    }
  }
}

interface Props {
  apps: apps[]
}

function Projects({ apps: projects }: Props) {
  const router = useRouter()

  return (
    <div
      className="
      flex
      flex-1
      flex-col
      space-x-0
      space-y-4
      overflow-hidden
      p-8
      lg:flex-row
      lg:space-y-0
      lg:space-x-4
      lg:p-12
    "
    >
      <div className="flex items-start space-x-4 lg:justify-start justify-between">
        <div className="items-center flex space-x-2">
          <LayoutGrid size="30px" strokeWidth="1.5" />
          <Text
            size={Text.size.S1}
            text="Projects"
          />
        </div>

        <Button
          icon={<Plus size="16px" />}
          text="New"
          variant={Button.variant.Full}
          onClick={() => router.push('/new/project')}
        />
      </div>

      <div
        className="
        flex
        flex-1
        flex-col
        items-stretch
        overflow-hidden
        "
      >
        <div className="flex flex-1 justify-center overflow-hidden">
          <ItemList
            items={projects.map(i => ({
              ...i,
              title: i.title || i.id,
              path: '/projects/[id]',
              type: 'Project',
              icon: <LayoutGrid size="22px" strokeWidth="1.7" />,
            }))}
          />
        </div>
      </div>
    </div>
  )
}

export default Projects
