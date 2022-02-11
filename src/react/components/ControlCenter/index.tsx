import { Component } from 'react'
const { jsPanel } = require('jspanel4/es6module/jspanel')
import { Env } from '@devbookhq/sdk'

import Portal from './Portal'
import Controls from './Controls'
export { centerControls } from './Controls'

const startingPosition = {
  my: 'right-center',
  at: 'right-center',
  offsetX: -20,
}
const startingSize = {
  width: '700px',
  height: '600px',
}

export interface Props {
  env: Env
}

class ControlCenter extends Component<Props, { panel?: any }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      panel: undefined,
    }
  }

  componentDidMount() {
    const panel = jsPanel.create({
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
      },
    })
    this.setState({ panel })
  }

  componentWillUnmount() {
    this.removePanel()
  }

  private removePanel() {
    this.state.panel?.close()
    this.setState(s => ({ ...s, panel: undefined }))
  }

  render() {
    if (!this.state.panel) return null
    const node = document.getElementById(`${this.state.panel.id}-node`)
    if (!node) return

    return (
      <Portal rootNode={node}>
        <Controls env={this.props.env} />
      </Portal>
    )
  }
}

export default ControlCenter
