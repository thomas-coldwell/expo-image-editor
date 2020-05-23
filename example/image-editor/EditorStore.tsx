import { useState } from 'react';
import { createContainer } from 'react-tracked';

interface EditorStore {
  imageScaleFactor: number;
  cropBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  accumulatedPan: {
    x: number;
    y: number;
  },
  cropSize: {
    width: number;
    height: number;
  }
}

const initialState: EditorStore = {
  imageScaleFactor: 1,
  cropBounds: {
    x: 0, 
    y: 0,
    width: 0,
    height: 0
  },
  accumulatedPan: {
    x: 0.0,
    y: 0.0
  },
  cropSize: {
    width: 0,
    height: 0
  }
};

const useTrackedState = () => useState(initialState);

export const {
  Provider: EditorStateProvider,
  useTracked: useEditorState,
} = createContainer(useTrackedState);