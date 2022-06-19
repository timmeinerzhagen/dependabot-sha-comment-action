export type DiffChange = {
    line: string,
    type: string
}

export type DiffFile = {
    path: string,
    changes: DiffChange[]
}

export type Diff = {
    files: DiffFile[]
}

