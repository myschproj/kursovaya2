export class ElevatorStatusNotifier {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  async notify(event) {
    for (const observer of this.observers) {
      await observer.update(event);
    }
  }
}

export const elevatorStatusNotifier = new ElevatorStatusNotifier();
