export interface AppRequest<Body = void, Params = void, Query = void>
  extends Express.Request {
  body: Body
  params: Params
  query: Query
}
