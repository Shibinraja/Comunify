export type ProgressProviderProps = {
    valueStart: number, valueEnd: number, children: (value: number) => JSX.Element
}