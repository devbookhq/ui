import {
  useEffect,
  useState,
} from 'react'

import { useSharedSession } from 'utils/SessionContext'
import { CodeSnippetOutput } from 'utils/useSession'
import Title from 'components/typography/Title'
import Button from 'components/Button'
import Output from 'components/Output'
import SpinnerIcon from 'components/icons/Spinner'
import CheckIcon from 'components/icons/Check'
import CancelIcon from 'components/icons/Cancel'

enum JobType {
  Install,
  Uninstall,
}

enum JobState {
  Loading,
  Success,
  Fail,
}

interface Job {
  type: JobType
  state: JobState
  dep: string
  output: CodeSnippetOutput[]
  isHidden: boolean
}

function Deps() {
  const session = useSharedSession()
  if (!session) throw new Error('Undefined session but it should be defined. Are you missing SessionContext in parent component?')

  const [newDep, setNewDep] = useState('')
  const [isLoadingDeps, setIsLoadingDeps] = useState(true)
  const [deps, setDeps] = useState<string[]>([])

  const [jobs, setJobs] = useState<Job[]>([
    {
      type: JobType.Install,
      state: JobState.Loading,
      dep: 'dep1',
      output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
      isHidden: true,
    },
    {
      type: JobType.Install,
      state: JobState.Success,
      dep: 'dep3',
      output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
      isHidden: true,
    },
    {
      type: JobType.Install,
      state: JobState.Fail,
      dep: 'dep2',
      output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
      isHidden: true,
    },
  ])

  function isJobLoading(dep: string) {
    const j = jobs.find(j => j.dep === dep)
    return j?.state === JobState.Loading ?? false
  }

  function toggleJobLogs(dep: string, isHidden: boolean) {
    console.log('Toggle job logs', dep)
    const idx = jobs.findIndex(j => j.dep === dep)
    console.log('found idx', idx)
    if (idx === -1) return
    setJobs(current => {
      const j = current[idx]
      console.log(j)
      current[idx] = {
        ...j,
        isHidden,
      }
      return [...current]
    })
  }

  function installDep(dep: string) {
    if (!dep) return
    const newJob: Job = {
      type: JobType.Install,
      state: JobState.Loading,
      dep,
      output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
      isHidden: true,
    }
    setJobs(j => [...j, newJob])
    //setJobs(j => j.set(dep, newJob))
    session?.installDep(dep)
    .then(response => {
      console.log({ response })
    })
    .catch(console.error)
  }

  //useEffect(() => {
  //  console.log({ jobs })
  //  setTimeout(() => {
  //    setInterval(() => {
  //      const j = jobs.get('react')
  //      console.log({ job: j })
  //      if (!j) return

  //      j.output = [...j.output, {
  //        type: 'stdout',
  //        value: 'lorem ipsum',
  //      }]
  //      setJobs(jj => jj.set('react', { ...j }))
  //      //setJobs(jj => {
  //      //  jj[0] = {...j}
  //      //  return [...jj]
  //      //})
  //      //console.log({ jobs })
  //    }, 430)
  //  }, 2000)
  //  new Promise<void>(resolve => {
  //  })
  //}, [jobs])
  useEffect(() => {
    if (!jobs.length) return
    if (jobs[0].output.length > 3) return

    console.log('START', { jobs })
    setTimeout(() => {
      setInterval(() => {
        //setJobs(jobs => {
        //  const j = jobs[0]
        //  jobs[0] = {
        //    ...j,
        //    output: [...j.output, {
        //      type: 'stdout',
        //      value: 'lorem ipsum',
        //    }]
        //  }
        //  j.output = [...j.output, {
        //    type: 'stdout',
        //    value: 'lorem ipsum',
        //  }]
        //  return [...jobs]
        //})
        //console.log({ jobs })
      }, 430)
    }, 2000)
    new Promise<void>(resolve => {
    })
  }, [])

  function uninstallDep(dep: string) {

  }

  function handleKeyDown(e: any) {
    if (e.key !== 'Enter') return
    // TODO: Install dep
  }

  useEffect(function loadCurrentDeps() {
    // TODO: Get the list of installed deps
    new Promise<void>(resolve => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
    .then(() => {
      setDeps(['dep1', 'dep2', 'dep3'])
      setIsLoadingDeps(false)
    })
  }, [])

  return (
    <div className="
      flex-1
      flex
      flex-col
      items-start
      space-y-4
    ">
      <Title
        title="Install new NPM package"
        size={Title.size.T2}
      />

      <div className="
        w-full
        flex
        flex-col
        items-start
        space-y-8
      ">
        <div className="
          w-full
          flex
          flex-row
          space-x-4
        ">
          <input
            className="
              flex-1
              bg-transparent
              border-b
              border-black-700
              font-mono
              outline-none
              active:border-green-200
              focus:border-green-200
            "
            value={newDep}
            onChange={e => setNewDep(e.target.value)}
            placeholder="package, package@v4.2.0, @scope/package"
            onKeyDown={handleKeyDown}
          />
          <Button
            text="Install"
            onClick={() => installDep(newDep)}
          />
        </div>
        <div className="
          w-full
          flex
          flex-col
          items-start
          justify-center
          space-y-4
        ">
          <Title
            title="Installed packages"
            size={Title.size.T2}
          />
          {isLoadingDeps && (
            <div className="
              w-full
              flex
              items-center
              justify-center
            ">
              <SpinnerIcon/>
            </div>
          )}
          {!isLoadingDeps && deps && deps.map(d => (
            <div
              key={d}
              className="
                pb-2
                w-full
                flex
                flex-row-reverse
                border-b
                border-black-700
                hover:border-green-200
                group
                block
              "
            >
              <Button
                isDisabled={isJobLoading(d)}
                icon={isJobLoading(d) ? <SpinnerIcon/> : undefined}
                className="peer"
                text="Remove"
              />
              <span className="
                w-full
                font-mono
                peer-hover:text-green-200
                group-hover:text-green-200
              ">
                {d}
              </span>
            </div>
          ))}
        </div>

        <div className="
          w-full
          flex
          flex-col
          items-start
          justify-center
          space-y-4
        ">
          <Title
            title="Jobs"
            size={Title.size.T2}
          />
          {jobs.map((job) => (
            <div
              key={job.dep}
              onClick={() => toggleJobLogs(job.dep, !job.isHidden)}
              className="
                p-2
                w-full
                flex
                flex-col
                items-start
                justify-center
                rounded-lg
                hover:cursor-pointer
                hover:bg-black-800
              "
            >
              <div className="
                w-full
                flex
                flex-row
                items-center
                justify-between
              ">
                <Title
                  className="font-mono"
                  title={`${job.type === JobType.Install ? 'Installing' : 'Uninstallin'} ${job.dep}`}
                  size={Title.size.T3}
                />
                {job.state === JobState.Loading && <SpinnerIcon/>}
                {job.state === JobState.Success && <CheckIcon className="text-green-200"/>}
                {job.state === JobState.Fail && <CancelIcon className="text-red-400"/>}
              </div>
              {!job.isHidden &&
                <Output
                  className="w-full max-h-[300px]"
                  output={job.output}
                />
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Deps
