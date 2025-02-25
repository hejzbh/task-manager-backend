import { StatusType } from "constants/status.js";

export default class CustomError extends Error {
  status: StatusType;

  constructor(message: string, status: StatusType) {
    super();
    this.message = message;
    this.status = status;

    Object.setPrototypeOf(this, CustomError);
  }
}
