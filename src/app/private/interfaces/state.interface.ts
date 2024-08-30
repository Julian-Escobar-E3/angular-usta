export interface State<T> {
  response: T | null;
  loading: boolean;
  hasMore?: boolean;
}
