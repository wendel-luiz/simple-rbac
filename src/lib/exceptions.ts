export class Exception extends Error {
  public code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, 404)
  }
}
