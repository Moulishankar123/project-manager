import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Project = {
  name: string;
  status: string;
  progress: string;
  date: string;
};

type ProjectStore = {
  projects: Project[];
  selectedProject: Project | null;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  setSelectedProject: (project: Project | null) => void;
  initialize: () => void;
};

const initialData: Project[] = [
  { name: "Project A", status: "In Progress", progress: "40%", date: "2025-05-05" },
  { name: "Project B", status: "Completed", progress: "100%", date: "2025-04-28" },
];

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      selectedProject: null,
      initialize: () => {
        if (get().projects.length === 0) {
          set({ projects: initialData });
        }
      },
      addProject: (project) => 
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (updatedProject) =>
        set((state) => ({
          projects: state.projects.map(project =>
            project.name === updatedProject.name ? updatedProject : project
          )
        })),
      setSelectedProject: (project) => set({ selectedProject: project }),
    }),
    {
      name: "project-storage",
    }
  )
);