import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import ProjectList from "@/components/ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Pickup Games, HandsOnExams, Tourvista, Pickup For Good and Fine and Rare: what Eason Gan built and what happened next.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Projects"
        title="Projects"
        intro={site.pages.projects}
      />
      <ProjectList />
    </>
  );
}
