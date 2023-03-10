import type { EventBridgeEvent } from 'aws-lambda';

import type {
  EventStoreEventsDetails,
  EventStoreAggregate,
  NotificationMessageBus,
  StateCarryingMessageBus,
  NotificationMessage,
  StateCarryingMessage,
  MessageBusSourceEventStoresIds,
  MessageBusSourceEventStoreIdTypes,
  MessageBusSourceEventStores,
} from '@castore/core';

type Prettify<T extends Record<string, unknown>> = T extends infer U
  ? {
      [K in keyof U]: U[K];
    }
  : never;

export type EventBridgeMessageBusMessage<
  M extends NotificationMessageBus | StateCarryingMessageBus,
  S extends MessageBusSourceEventStoresIds<M> = MessageBusSourceEventStoresIds<M>,
  T extends MessageBusSourceEventStoreIdTypes<
    M,
    S
  > = MessageBusSourceEventStoreIdTypes<M, S>,
> = Prettify<
  S extends infer I
    ? I extends string
      ? T extends infer U
        ? U extends MessageBusSourceEventStoreIdTypes<M, I>
          ? EventBridgeEvent<
              U,
              M extends NotificationMessageBus
                ? NotificationMessage<
                    I,
                    Extract<
                      EventStoreEventsDetails<
                        Extract<
                          MessageBusSourceEventStores<M>,
                          { eventStoreId: S }
                        >
                      >,
                      { type: U }
                    >
                  >
                : M extends StateCarryingMessageBus
                ? StateCarryingMessage<
                    I,
                    Extract<
                      EventStoreEventsDetails<
                        Extract<
                          MessageBusSourceEventStores<M>,
                          { eventStoreId: S }
                        >
                      >,
                      { type: U }
                    >,
                    EventStoreAggregate<
                      Extract<
                        MessageBusSourceEventStores<M>,
                        { eventStoreId: S }
                      >
                    >
                  >
                : never
            > & { source: I }
          : never
        : never
      : never
    : never
>;
