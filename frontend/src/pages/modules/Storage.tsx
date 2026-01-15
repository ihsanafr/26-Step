import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import StorageOverview from "../../components/storage/StorageOverview";
import FilesList from "../../components/storage/FilesList";
import LinksList from "../../components/storage/LinksList";
import NotesList from "../../components/journals/NotesList";

export default function Storage() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/storage" || path === "/storage/") {
    return (
      <>
        <PageMeta title="Storage - Lifesync" description="Manage your files, notes, and links" />
        <StorageOverview />
      </>
    );
  }

  if (path === "/storage/files") {
    return (
      <>
        <PageMeta title="Files - Lifesync" description="Manage and organize your files" />
        <FilesList />
      </>
    );
  }

  if (path === "/storage/links") {
    return (
      <>
        <PageMeta title="Links - Lifesync" description="Save and organize important links" />
        <LinksList />
      </>
    );
  }

  if (path === "/storage/notes") {
    return (
      <>
        <PageMeta title="Notes - Lifesync" description="Quick notes and pinboard" />
        <NotesList />
      </>
    );
  }

  return (
    <>
      <PageMeta title="Storage - Lifesync" description="Manage your files, notes, and links" />
      <StorageOverview />
    </>
  );
}

