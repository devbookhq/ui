import { Component } from 'react'
const { jsPanel } = require('jspanel4/es6module/jspanel')

import Portal from './Portal'
import FileEditor from './FileEditor'
import Controls from './Controls'

let globalPanel: any = undefined

const startingPosition = 'right-center -50 20'
const startingSize = {
  width: '450px',
  height: '600px',
}

class ControlCenter extends Component {
  constructor(props: any) {
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
        contentOverflow: 'auto',
        onwindowresize: false,
        content: (panel: any) => {
          const div = document.createElement('div')
          const newId = `${panel.id}-node`
          div.id = newId
          div.className += 'h-full bg-black-650'
          panel.content.append(div)
        },
        callback: (panel: any) => {
          const maxHeight = window.innerHeight - (window.innerHeight * 30) / 100
          panel.content.style.maxHeight = `${maxHeight}px`
          panel.content.style.maxWidth = `${window.innerWidth - 20}px`
        },
        onclosed: () => {
          globalPanel = undefined
        },
      })
    }
  }

  render() {
    if (!globalPanel) return null
    const node = document.getElementById(`${globalPanel.id}-node`)
    if (!node) return

    return (
      <Portal rootNode={node}>
        <Controls />
      </Portal>
    )
  }
}

export default ControlCenter
