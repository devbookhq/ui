import { Component } from 'react'
const { jsPanel } = require('jspanel4/es6module/jspanel')

import Portal from './Portal'
import FileEditor from './FileEditor'
import Controls from './Controls'
import { Env } from '@devbookhq/sdk'

let globalPanel: any = undefined

const startingPosition = {
  my: 'right-center',
  at: 'right-center',
  offsetX: -20,
}
const startingSize = {
  width: '450px',
  height: '600px',
}

export interface Props {
  env: Env
}

class ControlCenter extends Component<Props> {
  constructor(props: Props) {
    super(props)
    if (globalPanel) {
      globalPanel.front(() => {
        globalPanel.resize(startingSize)
        globalPanel.reposition(startingPosition)
      })
    } else {
      globalPanel = jsPanel.create({
        headerTitle: '\xa0',
        theme: '#292929',
        headerControls: {
          minimize: 'remove',
          smallify: 'remove',
          close: 'remove',
          maximize: 'remove',
        },
        position: startingPosition,
        contentSize: startingSize,
        onwindowresize: false,
        content: (panel: any) => {
          const div = document.createElement('div')
          const newId = `${panel.id}-node`
          div.id = newId
          div.className += 'h-full bg-black-650'
          panel.content.append(div)
        },
        callback: (panel: any) => {
          panel.style.height = startingSize.height
          // const maxHeight = window.innerHeight - (window.innerHeight * 30) / 100
          // panel.content.style.maxHeight = `${maxHeight}px`
          // panel.content.style.maxWidth = `${window.innerWidth - 20}px`
        },
        onclosed: () => {
          globalPanel = undefined
        },
      })
    }
  }

  render() {
    console.log('control center')
    if (!globalPanel) return null
    const node = document.getElementById(`${globalPanel.id}-node`)
    if (!node) return

    return (
      <Portal rootNode={node}>
        <Controls env={this.props.env} />
      </Portal>
    )
  }
}

export default ControlCenter
