import { PrismaElevatorRepository } from '../repositories/elevatorRepository.js';
import { PrismaCallRepository } from '../repositories/callRepository.js';
import { NearestElevatorStrategy } from './strategies/nearestElevatorStrategy.js';
import { DestinationGroupingStrategy } from './strategies/destinationGroupingStrategy.js';
import { elevatorStatusNotifier } from '../observers/elevatorStatusNotifier.js';

const strategies = {
  nearest: new NearestElevatorStrategy(),
  destination: new DestinationGroupingStrategy()
};

export class DispatchService {
  constructor(strategyName = 'nearest') {
    this.elevatorRepository = new PrismaElevatorRepository();
    this.callRepository = new PrismaCallRepository();
    this.strategy = strategies[strategyName] || strategies.nearest;
  }

  setStrategy(strategyName) {
    this.strategy = strategies[strategyName] || strategies.nearest;
  }

  async dispatch(call) {
    const elevators = await this.elevatorRepository.findActive();
    const elevator = this.strategy.selectElevator(elevators, call);

    if (!elevator) {
      const updatedCall = await this.callRepository.update(call.id, {
        status: 'ERROR',
        errorText: 'Нет доступных лифтов'
      });
      await elevatorStatusNotifier.notify({
        userId: call.userId,
        eventType: 'CALL_ERROR',
        message: `Вызов ${call.id}: нет доступных лифтов`
      });
      return updatedCall;
    }

    const direction = call.toFloor.number > call.fromFloor.number ? 'UP' : 'DOWN';
    await this.elevatorRepository.update(elevator.id, {
      status: 'MOVING',
      direction
    });

    const updatedCall = await this.callRepository.update(call.id, {
      elevatorId: elevator.id,
      status: 'ASSIGNED'
    });

    await elevatorStatusNotifier.notify({
      userId: call.userId,
      elevatorId: elevator.id,
      eventType: 'CALL_ASSIGNED',
      message: `Вызов ${call.id}: назначен ${elevator.name}`
    });

    return updatedCall;
  }
}
