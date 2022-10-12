


## Usage

```tsx

function App() {
  return (
    <BuilderProvider>
      <Board />
      <Sidebar />
    </BuilderProvider>
  )
}

function Board() {
  return (
    <div>
      <Container app={app} />
      <DragLayer />
    </div>
  )
}

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

function DragLayer() {
  const draggedChildren = useBoardDrag()

  if (!draggedChildren) return null

  return <div style={layerStyles}>{draggedChildren}</div>
}

function Container() {
  const [children, ref] = useBoard()

  return (
    <div ref={ref}>
      {children}
    </div>
  )
}


```