import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "@picocss/pico/css/pico.min.css";
import "./index.css";

import { initTaskList, TaskList } from "./components/TaskList.tsx";
import {
  Repo,
  IndexedDBStorageAdapter,
  RepoContext,
  isValidAutomergeUrl,
  DocHandle,
  BroadcastChannelNetworkAdapter,
  // WebSocketClientAdapter,
} from "@automerge/react";
import { RootDocument } from "./rootDoc.ts";

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    // new WebSocketClientAdapter("wss://sync.automerge.org"),
  ],
  storage: new IndexedDBStorageAdapter()
})

declare global {
  interface Window {
    repo: Repo;
    handle: DocHandle<RootDocument>
  }
 }

window.repo = repo;

const locationHash = document.location.hash.substring(1);

if (isValidAutomergeUrl(locationHash)) {
  const taskList = await repo.find(locationHash);
  window.handle = repo.create({ tasksLists: [taskList.url] });
} else {
  const taskList = repo.create<TaskList>(initTaskList());
  window.handle = repo.create({ tasksLists: [taskList.url] })
  document.location.hash = taskList.url;
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
