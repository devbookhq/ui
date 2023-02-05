export interface OpenedFile {
  path: string
  content: string
  canBeClosed: boolean
}

export interface State {
  selectedIdx: number
  openedFiles: OpenedFile[]
}

export interface SelectFileAction {
  type: 'SelectFile'
  payload: {
    idx: number
    content: string
  }
}
export interface OpenFileAction {
  type: 'OpenFile'
  payload: OpenedFile
}

export interface CloseFileAction {
  type: 'CloseFile'
  payload: {
    idx: number
  }
}

export interface SetOpenedFilesAction {
  type: 'SetOpenedFiles',
  payload: {
    openedFiles: OpenedFile[]
  }
}

type Action =
  SelectFileAction
  | OpenFileAction
  | SetOpenedFilesAction
  | CloseFileAction

export function reducer(state: State, action: Action): State {
  switch (action.type) {
  case 'SelectFile': {
    const {
      idx,
      content,
    } = action.payload

    state.openedFiles[idx].content = content
    return {
      ...state,
      selectedIdx: idx,
      openedFiles: [...state.openedFiles],
    }
  }

  case 'OpenFile': {
    const {
      path,
      content,
      canBeClosed,
    } = action.payload
    const idx = state.openedFiles.findIndex(el => el.path === path)
    if (idx !== -1) {
      return {
        ...state,
        openedFiles: [...state.openedFiles],
        selectedIdx: idx,
      }
    }

    return {
      ...state,
      openedFiles: [
        ...state.openedFiles,
        {
          path,
          content,
          canBeClosed,
        },
      ],
      // Select the file we just added
      selectedIdx: state.openedFiles.length,
    }
  }

  case 'CloseFile': {
    const { idx } = action.payload
    let newSelectedIdx = state.selectedIdx

    // If closing a file that's before the selected file
    // in the opened files array, we must update the selected
    // index because the whole array get shifted to left.
    if (idx < state.selectedIdx) {
      newSelectedIdx -= 1
    }
    // If closing a file that's currently selected
    // try to select a file that's its left neighbor if there's any.
    // Otherwise, try to select its right neighbor if there's any.
    else if (idx === state.selectedIdx) {
      if (state.selectedIdx > 0) newSelectedIdx -= 1
    }

    return {
      ...state,
      selectedIdx: newSelectedIdx,
      openedFiles: [...state.openedFiles.filter((_, elIdx) => elIdx !== idx)],
    }
  }

  case 'SetOpenedFiles': {
    const { openedFiles } = action.payload

    // If there are any already opened files, merge those two arrays
    // and move the files from the payload at the beginning.
    const newOpenedFiles = openedFiles
    for (const of of state.openedFiles) {
      if (!newOpenedFiles.find(el => el.path === of.path)) {
        newOpenedFiles.push(of)
      }
    }

    return {
      ...state,
      selectedIdx: 0,
      openedFiles: [...newOpenedFiles],
    }
  }

  default:
    return state
  }
}


export function init(initialOpenedFiles: OpenedFile[]): State {
  return {
    selectedIdx: 0,
    openedFiles: initialOpenedFiles,
  }
}
