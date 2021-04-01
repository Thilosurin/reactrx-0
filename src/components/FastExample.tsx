import { Button } from "./presentational";
import {
  existingTaskCompleted,
  newTaskStarted,
} from "../reactive/TaskProgressService";

const doVeryQuickWork = (): void => {
  newTaskStarted();
  new Promise((resolve): void => {
    setTimeout(() => {
      existingTaskCompleted();
      resolve(null);
    }, 300);
  });
};

const doAlmostQuickWork = (): void => {
  newTaskStarted();
  new Promise((resolve): void => {
    setTimeout(() => {
      existingTaskCompleted();
      resolve(null);
    }, 2200);
  });
};

const FastExample = () => {
  return (
    <div className="h-60 flex flex-col justify-center items-center gap-6">
      <Button className="button hover:bg-green-400" onClick={doVeryQuickWork}>
        QUICK task - 300ms
      </Button>
      <Button className="button hover:bg-blue-400" onClick={doAlmostQuickWork}>
        Almost quick task - 2200ms
      </Button>
    </div>
  );
};

export default FastExample;
