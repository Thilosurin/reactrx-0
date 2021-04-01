import { useEffect, useState } from "react";
import { FastExample } from "./components";
import { Spinner } from "./components/presentational";
import { isShowLoadingObservable$ } from "./services/loading-spinner";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const sub = isShowLoadingObservable$.subscribe(setIsLoading);
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className="bg-black min-h-screen p-8">
      <h1 className="text-heading-5xl text-white text-center">
        Welcome to React
      </h1>
      <FastExample />
      <Spinner isLoading={isLoading} />
    </div>
  );
}

export default App;
