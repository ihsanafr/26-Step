import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import JournalsOverview from "../../components/journals/JournalsOverview";
import JournalList from "../../components/journals/JournalList";
import JournalsCalendar from "../../components/journals/JournalsCalendar";
import NotesList from "../../components/journals/NotesList";
import JournalsGuide from "../../components/journals/JournalsGuide";
import JournalCreatePage from "../../components/journals/JournalCreatePage";
import JournalEditPage from "../../components/journals/JournalEditPage";
import JournalViewPage from "../../components/journals/JournalViewPage";
import { useParams } from "react-router";

export default function Journals() {
  const location = useLocation();
  const path = location.pathname;
  const { id } = useParams<{ id: string }>();

  if (path === "/journals" || path === "/journals/") {
    return (
      <>
        <PageMeta title="Journals & Notes - 26-step" description="Reflect and capture quick notes" />
        <JournalsOverview />
      </>
    );
  }

  if (path === "/journals/list") {
    return (
      <>
        <PageMeta title="Journal Entries - 26-step" description="Write and browse journal entries" />
        <JournalList />
      </>
    );
  }

  if (path === "/journals/new") {
    return (
      <>
        <PageMeta title="New Journal Entry - 26-step" description="Create a new journal entry" />
        <JournalCreatePage />
      </>
    );
  }

  if (path === `/journals/edit/${id}`) {
    return (
      <>
        <PageMeta title="Edit Journal Entry - 26-step" description="Edit your journal entry" />
        <JournalEditPage />
      </>
    );
  }

  if (path === `/journals/view/${id}`) {
    return (
      <>
        <PageMeta title="View Journal Entry - 26-step" description="Read your journal entry" />
        <JournalViewPage />
      </>
    );
  }

  if (path === "/journals/calendar") {
    return (
      <>
        <PageMeta title="Journal Calendar - 26-step" description="Browse entries by date" />
        <JournalsCalendar />
      </>
    );
  }

  if (path === "/journals/notes") {
    return (
      <>
        <PageMeta title="Notes - 26-step" description="Quick notes and pinboard" />
        <NotesList />
      </>
    );
  }

  if (path === "/journals/guide") {
    return (
      <>
        <PageMeta title="Journals Guide - 26-step" description="How to use Journals & Notes module" />
        <JournalsGuide />
      </>
    );
  }

  return (
    <>
      <PageMeta title="Journals & Notes - 26-step" description="Reflect and capture quick notes" />
      <JournalsOverview />
    </>
  );
}

