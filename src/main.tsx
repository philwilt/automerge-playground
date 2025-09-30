import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "@picocss/pico/css/pico.min.css";
import "./index.css";

import {
  Repo,
  IndexedDBStorageAdapter,
  RepoContext,
  DocHandle,
  BroadcastChannelNetworkAdapter,
  WebSocketClientAdapter,
} from "@automerge/react";
import { getOrCreateRoot, RootDocument } from "./rootDoc.ts";

const repo = new Repo({
  network: [
    new BroadcastChannelNetworkAdapter(),
    new WebSocketClientAdapter("wss://sync.automerge.org"), // Doesn't always work
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

const rootDocUrl = getOrCreateRoot(repo);
window.handle = await repo.find(rootDocUrl);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading a document...</div>}>
      <RepoContext.Provider value={repo}>
        <App docUrl={window.handle.url} />
      </RepoContext.Provider>
    </Suspense>
  </React.StrictMode>,
);
