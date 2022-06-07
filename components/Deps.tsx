import {
  useEffect,
  useState,
} from 'react'
import cn from 'classnames'

import { useSharedSession } from 'utils/SessionContext'
import { CodeSnippetOutput } from 'utils/useSession'
import { showErrorNotif } from 'utils/notification'
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
  const [deps, setDeps] = useState<string[]>()
  const [jobs, setJobs] = useState<Job[]>([
    //{
    //  type: JobType.Install,
    //  state: JobState.Loading,
    //  dep: 'dep1',
    //  output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
    //  isHidden: true,
    //},
    //{
    //  type: JobType.Install,
    //  state: JobState.Success,
    //  dep: 'dep3',
    //  output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
    //  isHidden: true,
    //},
    //{
    //  type: JobType.Install,
    //  state: JobState.Fail,
    //  dep: 'dep2',
    //  output: [{ type: 'stdout', value: 'val1'}, {type: 'stderr', value: 'val2'}],
    //  isHidden: true,
    //},
  ])

  function isJobLoading(dep: string) {
    const j = jobs.find(j => j.dep === dep)
    return j?.state === JobState.Loading ?? false
  }

  function toggleJobLogs(dep: string, isHidden: boolean) {
    const idx = jobs.findIndex(j => j.dep === dep)
    if (idx === -1) return

    setJobs(current => {
      const j = current[idx]
      current[idx] = {
        ...j,
        isHidden,
      }
      return [...current]
    })
  }

  function installDep(dep: string) {
    if (!dep) return
    if (!session) {
      showErrorNotif('Session is undefined')
      return
    }

    setNewDep('')

    const newJob: Job = {
      type: JobType.Install,
      state: JobState.Loading,
      dep,
      output: [],
      isHidden: true,
    }
    setJobs(j => [...j, newJob])

    session?.installDep(dep)
    .then(({ error }) => {
      setJobs(jobs => {
        const idx = jobs.findIndex(j => j.dep === dep)
        if (idx === -1) return jobs

        const j = jobs[idx]
        jobs[idx] = {
          ...j,
          state: error ? JobState.Fail : JobState.Success,
          output: error ? [...j.output, { type: 'stderr', value: error }] : j.output,
        }
        return [...jobs]
      })
    })
    .catch(showErrorNotif)
  }

  function uninstallDep(dep: string) {
    if (!dep) return
    if (!session) {
      showErrorNotif('Session is undefined')
      return
    }

    const newJob: Job = {
      type: JobType.Uninstall,
      state: JobState.Loading,
      dep,
      output: [],
      isHidden: true,
    }
    setJobs(j => [...j, newJob])

    session?.uninstallDep(dep)
    .then(({ error }) => {
      setJobs(jobs => {
        const idx = jobs.findIndex(j => j.dep === dep)
        if (idx === -1) return jobs

        const j = jobs[idx]
        jobs[idx] = {
          ...j,
          state: error ? JobState.Fail : JobState.Success,
          output: error ? [...j.output, { type: 'stderr', value: error }] : j.output,
        }
        return [...jobs]
      })
    })
  }

  function handleKeyDown(e: any) {
    if (e.key !== 'Enter') return
    // TODO: Install dep
  }

  // TODO: Useless?
  useEffect(function loadCurrentDeps() {
    session.listDeps()
    .then(deps => {
      if (deps) {
        setDeps(deps)
      }
    })
  }, [])

  useEffect(function onSessionDepsChange() {
    if (!session.deps) return
    setDeps(session.deps)
  }, [session.deps])


  useEffect(function onDepsStdoutChange() {
    setJobs(jobs => {
      session.depsOutput.forEach(out => {
        const idx = jobs.findIndex(j => j.dep === out.dep)
        if (idx === -1) return

        const j = jobs[idx]
        jobs[idx] = {
          ...j,
          output: [...j.output, { type: out.type, value: out.line }]
        }
      })
      return [...jobs]
    })
  }, [session.depsOutput])

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
          {!deps && (
            <div className="
              w-full
              flex
              items-center
              justify-center
            ">
              <SpinnerIcon/>
            </div>
          )}
          {deps && deps.length === 0 && (
            <Title
              title="No installed packages"
              rank={Title.rank.Secondary}
              size={Title.size.T3}
            />
          )}
          {deps && deps.map(d => (
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
                onClick={() => uninstallDep(d)}
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
          {jobs.length === 0 && (
            <Title
              title="No running jobs"
              rank={Title.rank.Secondary}
              size={Title.size.T3}
            />
          )}
          {jobs.length > 0 && jobs.map((job) => (
            <div
              key={job.dep}
              onClick={() => toggleJobLogs(job.dep, !job.isHidden)}
              className={cn(
                'p-2',
                'w-full',
                'flex',
                'flex-col',
                'space-y-2',
                'items-start',
                'justify-center',
                'rounded-lg',
                'hover:cursor-pointer',
                'hover:bg-black-800',
                { 'bg-black-800': !job.isHidden },
              )}
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
                  title={`${job.type === JobType.Install ? 'Installing' : 'Uninstalling'} ${job.dep}`}
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
