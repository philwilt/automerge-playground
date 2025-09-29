import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "@picocss/pico/css/pico.min.css";
import "./index.css";

import { initTaskList, TaskList } from "./components/TaskList.tsx";
import { Repo,
  IndexedDBStorageAdapter,
  RepoContext,
  isValidAutomergeUrl,
  DocHandle,
  BroadcastChannelNetworkAdapter
} from "@automerge/react";

const repo = new Repo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter()
})

declare global {
  interface Window {
    repo: Repo;
    handle: DocHandle<TaskList>
  }
 }

window.repo = repo;

const locationHash = document.location.hash.substring(1);

if (isValidAutomergeUrl(locationHash)) {
  window.handle = await repo.find(locationHash);
} else {
  window.handle = repo.create<TaskList>(initTaskList());
  document.location.hash = window.handle.url;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      <RepoContext.Provider value={repo}>
        <App docUrl={window.handle.url} />
      </RepoContext.Provider>
    </Suspense>
  </React.StrictMode>,
);
