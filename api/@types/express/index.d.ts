namespace Express {
  export interface Request {
    user?: any

    isAuthenticated(): boolean
  }
}
