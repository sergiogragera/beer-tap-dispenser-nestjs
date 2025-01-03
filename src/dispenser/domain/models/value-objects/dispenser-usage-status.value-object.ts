export class DispenserUsageStatus {
  private constructor(
    readonly openedAtDate: Date,
    readonly closedAtDate: Date,
  ) {
    if (closedAtDate.getTime() < openedAtDate.getTime()) {
      throw new Error(
        'closed datetime must be greater or equal than open datetime',
      );
    }
  }

  static create(openedAt: Date, closedAt: Date): DispenserUsageStatus {
    return new DispenserUsageStatus(openedAt, closedAt);
  }

  get openedAt(): string {
    return this.openedAtDate.toLocaleString();
  }

  get closedAt(): string {
    return this.closedAtDate.toLocaleString();
  }
}
