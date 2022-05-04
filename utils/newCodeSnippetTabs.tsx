import CodeIcon from 'components/icons/Code'
import BoxIcon from 'components/icons/Box'


export enum Tab {
  Code = 'code',
  Env = 'env',
}

export const tabs = {
  [Tab.Code]: {
    key: Tab.Code,
    title: 'Code',
    icon: <CodeIcon/>,
  },
  [Tab.Env]: {
    key: Tab.Env,
    title: 'Environment',
    icon: <BoxIcon/>,
  },
}
