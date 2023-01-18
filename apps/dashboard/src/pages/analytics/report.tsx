import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  return {
    props: {

    }
  }
}

export interface Props {

}

function AnalyticsReport({ }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-1 bg-slate-100">
      <div
        className="
          flex
          flex-1
          flex-col
          items-center
          justify-center
          space-y-2
        "
      >

      </div>
    </div>
  )
}

export default AnalyticsReport
