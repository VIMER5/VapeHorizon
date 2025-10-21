export default class errorService extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
  static badRequest(msg: string) {
    return new errorService(400, msg);
  }
  static Unauthorized(msg: string) {
    return new errorService(401, msg);
  }
  static ServiceUnavailable(msg: string) {
    return new errorService(503, msg);
  }
}
