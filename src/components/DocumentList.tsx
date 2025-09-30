import React from "react";
import { useDocument, AutomergeUrl } from "@automerge/react";
import { TaskList } from './TaskList';

export interface DocumentList {
  tasksLists: AutomergeUrl[],
}

export const DocumentList: React.FC<{
  docUrl: AutomergeUrl,
}> = ({ docUrl }) => {
  const [doc, changeDoc] = useDocument<DocumentList>(docUrl, {
    suspense: true
  });

  return (
    <div className="document-list">
      <div className="documents">
        {doc.tasksLists.map((docUrl) => (
          <div key={docUrl} className={`document-item`}>
            <DocumentTitle docUrl={docUrl} />
          </div>
        ))}
      </div>
    </div>
  )
}

const DocumentTitle: React.FC<{ docUrl: AutomergeUrl }> = ({ docUrl }) => {
  const [doc] = useDocument<TaskList>(docUrl, { suspense: true });

  const title = doc.title || "Untitled Task List";
  return <div>{title}</div>;
}