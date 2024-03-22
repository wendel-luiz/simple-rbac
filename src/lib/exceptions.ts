export class Exception extends Error {
  public code: number

  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

export class InvalidEnvFileException extends Exception {
  constructor() {
    super('Invalid env file', 500)
  }
}

export class NotFoundException extends Exception {
  constructor(message: string) {
    super(message, 404)
  }
}

export class ConflictException extends Exception {
  constructor(message: string) {
    super(message, 409)
  }
}
