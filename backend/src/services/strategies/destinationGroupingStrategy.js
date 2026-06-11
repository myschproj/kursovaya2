export class DestinationGroupingStrategy {
  selectElevator(elevators, call) {
    if (!elevators.length) return null;

    const targetDirection = call.toFloor.number > call.fromFloor.number ? 'UP' : 'DOWN';

    return elevators
      .map((elevator) => {
        const distance = Math.abs(elevator.currentFloor.number - call.fromFloor.number);
        const directionPenalty = elevator.direction === targetDirection || elevator.direction === 'STOPPED' ? 0 : 3;
        const movingPenalty = elevator.status === 'MOVING' ? 1 : 0;
        return { elevator, score: distance + directionPenalty + movingPenalty };
      })
      .sort((a, b) => a.score - b.score || a.elevator.id - b.elevator.id)[0].elevator;
  }
}
