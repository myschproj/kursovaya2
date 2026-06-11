export class NearestElevatorStrategy {
  selectElevator(elevators, call) {
    if (!elevators.length) return null;

    return elevators
      .map((elevator) => ({
        elevator,
        score: Math.abs(elevator.currentFloor.number - call.fromFloor.number)
      }))
      .sort((a, b) => a.score - b.score || a.elevator.id - b.elevator.id)[0].elevator;
  }
}
