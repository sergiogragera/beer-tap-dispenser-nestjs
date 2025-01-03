export class DispenserStatus {
  private constructor(
    readonly openedAtDate?: Date,
    readonly closedAtDate?: Date,
  ) {
    if (
      closedAtDate &&
      openedAtDate &&
      closedAtDate.getTime() < openedAtDate.getTime()
    ) {
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
    if (!this.openedAtDate) {
      return 0;
    }

    const closeDate = this.closedAtDate ?? new Date();
    return (closeDate.getTime() - this.openedAtDate.getTime()) / 1000;
  }

  static create(openedAt?: Date, closedAt?: Date): DispenserStatus {
    return new DispenserStatus(openedAt, closedAt);
  }

  isOpened(): boolean {
    return this.openedAtDate !== undefined && !this.closedAtDate;
  }

  isClosedAfter(date: Date): boolean {
    return this.closedAtDate
      ? this.closedAtDate.getTime() > date.getTime()
      : false;
  }

  isOpenedAfter(date: Date): boolean {
    return this.openedAtDate
      ? this.openedAtDate.getTime() > date.getTime()
      : false;
  }
}
