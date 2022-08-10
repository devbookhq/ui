import {
  CodeIcon,
  CubeIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons'

export enum Tab {
  Code = 'code',
  Env = 'env',
  Deps = 'deps',
}

export const tabs = {
  [Tab.Code]: {
    key: Tab.Code,
    title: 'Code',
    icon: <CodeIcon />,
  },
  [Tab.Deps]: {
    key: Tab.Deps,
    title: 'Dependencies',
    icon: <CubeIcon />,
  },
  [Tab.Env]: {
    key: Tab.Env,
    title: 'Env variables',
    icon: <LockClosedIcon />,
  },
}
