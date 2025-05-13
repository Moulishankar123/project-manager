import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  deadline: string;
};

type ProjectStore = {
  projects: Project[];
  selectedProject: Project | null;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  setSelectedProject: (project: Project | null) => void;
  initialize: () => void;
  getNextId: () => number;
  deleteProject: (projectId: number) => void;
};

const initialData: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    status: "In Progress",
    progress: 65,
    deadline: "2023-06-30",
  }
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
          projects: state.projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          ),
        })),
      setSelectedProject: (project) => set({ selectedProject: project }),
      getNextId: () => {
        const projects = get().projects;
        return projects.length > 0
          ? Math.max(...projects.map((p) => p.id)) + 1
          : 1;
      },
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== projectId),
        })),
    }),
    {
      name: "project-storage",
    }
  )
);
