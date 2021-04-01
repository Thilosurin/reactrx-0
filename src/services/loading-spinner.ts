import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";

const isShowLoading$ = new BehaviorSubject<boolean>(true);
export const initLoadingSpinner = async () => ({
  show: () => isShowLoading$.next(true),
  hide: () => isShowLoading$.next(false),
});
export const isShowLoadingObservable$ = isShowLoading$
  .asObservable()
  .pipe(tap((res) => console.log("__IS LOADING__ : ", res)));
