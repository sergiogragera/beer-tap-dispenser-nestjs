export class DispenserStatus {
  private constructor(
    readonly openedAtDate?: Date,
    readonly closedAtDate?: Date,
  ) {
    if (closedAtDate?.getTime() < openedAtDate?.getTime()) {
      throw new Error(
        'closed datetime must be greater or equal than open datetime',
      );
    }
  }

  get openedAt(): string | undefined {
    return this.openedAtDate?.toLocaleString();
  }

  get closedAt(): string | undefined {
    return this.closedAtDate?.toLocaleString();
  }

  get secondsOpened(): number {
    return this.openedAtDate && this.closedAtDate
      ? (this.closedAtDate.getTime() - this.openedAtDate.getTime()) / 1000
      : 0;
  }

  static create(openedAt?: Date, closedAt?: Date): DispenserStatus {
    return new DispenserStatus(openedAt, closedAt);
  }

  isOpened(): boolean {
    return this.openedAt && !this.closedAt;
  }

  isClosedAfter(date: Date): boolean {
    return this.closedAtDate?.getTime() > date.getTime();
  }

  isOpenedAfter(date: Date): boolean {
    return this.openedAtDate?.getTime() > date.getTime();
  }
}
