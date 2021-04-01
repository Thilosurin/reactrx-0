import { merge, Observable, Subject } from "rxjs";
import {
  distinctUntilChanged,
  filter,
  mapTo,
  pairwise,
  scan,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs/operators";
import { initLoadingSpinner } from "../services/loading-spinner";

/**
 * How do we count?
 *  Start from zero
 *  When an async task starts, increase the count by 1
 *  When a task ends, decrease the count by 1
 */

const taskStarts = new Subject();
const taskCompletions = new Subject();

export function newTaskStarted() {
  taskStarts.next();
}

export function existingTaskCompleted() {
  taskCompletions.next();
}

const loadUp = taskStarts.pipe(mapTo(1));
const loadDown = taskCompletions.pipe(mapTo(-1));

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

const loadVariations = merge(loadUp, loadDown);

const currentLoadCount = loadVariations.pipe(
  startWith(0),
  scan((totalCurrentLoads, changeInLoads) => {
    const newLoadCount = totalCurrentLoads + changeInLoads;
    return newLoadCount < 0 ? 0 : newLoadCount;
  }, 0),
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true })
);
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
/**
 * When does the loader neeed to show?
 * When the count of async tasks goes from 0 to 1
 */

const shouldHideSpinner = currentLoadCount.pipe(filter((count) => count === 0));

const shouldShowSpinner = currentLoadCount.pipe(
  pairwise(),
  filter(([prevCount, currCount]) => prevCount === 0 && currCount === 1)
);
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

const showSpinner = new Observable(() => {
  // I've been subscribed to!!
  const loadingSpinnerPromise = initLoadingSpinner();

  loadingSpinnerPromise.then((spinner) => {
    spinner.show();
  });

  return () => {
    // oh no, I've been unsubscribed from!
    loadingSpinnerPromise.then((spinner) => spinner.hide());
  };
});

/**
 * When the spinner needs to show
 *  -> show the spinner..until it's time to hide it
 */
shouldShowSpinner
  .pipe(switchMap(() => showSpinner.pipe(takeUntil(shouldHideSpinner))))
  .subscribe();

export default {};
