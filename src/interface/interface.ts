export interface RoutesArray {
  element: JSX.Element;
  path?: string;
  children?: {
    index?: boolean;
    path?: string;
    element?: JSX.Element;
  }[];
}
