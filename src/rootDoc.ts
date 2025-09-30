import { AutomergeUrl, Repo } from "@automerge/react";

const ROOT_DOC_URL_KEY = "root-doc-url";

export type RootDocument = {
  taskLists: AutomergeUrl[],
}

export const setRootDocUrl = (url: AutomergeUrl): void => {
  localStorage.setItem(ROOT_DOC_URL_KEY, url);
}

export const getOrCreateRoot = (repo: Repo): AutomergeUrl => {
  const existingUrl = localStorage.getItem(ROOT_DOC_URL_KEY)

  if (existingUrl) {
    return existingUrl as AutomergeUrl;
  }

  const root = repo.create<RootDocument>({ taskLists: [] });
  localStorage.setItem(ROOT_DOC_URL_KEY, root.url);

  return root.url;
}
