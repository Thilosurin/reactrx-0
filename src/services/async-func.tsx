import { Observable, Subscribable, Unsubscribable } from "rxjs";

interface SubscriptionStrategy {
  createSubscription(
    async: Subscribable<any> | Promise<any>,
    updateLatestValue: any
  ): Unsubscribable | Promise<any>;
  dispose(subscription: Unsubscribable | Promise<any>): void;
  onDestroy(subscription: Unsubscribable | Promise<any>): void;
}

const subscribableStrategy = (): SubscriptionStrategy => ({
  createSubscription: (
    async: Subscribable<any>,
    updateLatestValue: any
  ): Unsubscribable =>
    async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      },
    }),
  dispose: (subscription: Unsubscribable): void => subscription.unsubscribe(),
  onDestroy: (subscription: Unsubscribable): void => subscription.unsubscribe(),
});

const promiseStrategy = (): SubscriptionStrategy => ({
  createSubscription: (
    async: Promise<any>,
    updateLatestValue: (v: any) => any
  ): Promise<any> =>
    async.then(updateLatestValue, (e) => {
      throw e;
    }),
  dispose: (subscription: Promise<any>): void => {},
  onDestroy: (subscription: Promise<any>): void => {},
});
const _promiseStrategy = promiseStrategy();
const _subscribableStrategy = subscribableStrategy();

export default function AsyncFn(
  obj: Subscribable<any> | Promise<any> | null | undefined
): any | null {
  let _latestValue: any = null;
  let _subscription: Unsubscribable | Promise<any> | null = null;
  let _obj: Subscribable<any> | Promise<any> | null = null;
  let _strategy: SubscriptionStrategy = null!;

  if (_subscription) {
    _dispose();
  }

  if (!_obj) {
    if (obj) {
      _subscribe(obj);
    }
    return _latestValue;
  }

  if (obj !== _obj) {
    _dispose();
    return obj;
  }

  return _latestValue;

  function _subscribe(obj: Subscribable<any> | Promise<any>): void {
    _obj = obj;
    _strategy = _selectStrategy(obj);
    _subscription = _strategy.createSubscription(obj, (value: Object) =>
      _updateLatestValue(obj, value)
    );
  }

  function _selectStrategy(obj: Subscribable<any> | Promise<any>): any {
    if (isPromise(obj)) return _promiseStrategy;
    if (isSubscribable(obj)) return _subscribableStrategy;
  }

  function _dispose(): void {
    _strategy.dispose(_subscription!);
    _latestValue = null;
    _subscription = null;
    _obj = null;
  }

  function _updateLatestValue(async: any, value: Object): void {
    if (async === _obj) {
      _latestValue = value;
    }
  }
}

export function isPromise<T = any>(obj: any): obj is Promise<T> {
  return !!obj && typeof obj.then === "function";
}

export function isSubscribable(
  obj: any | Subscribable<any>
): obj is Subscribable<any> {
  return !!obj && typeof obj.subscribe === "function";
}

export const isObservable = isSubscribable as (
  obj: any | Observable<any>
) => obj is Observable<any>;
