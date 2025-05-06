import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/ProjectStore";
import {
  Box,
  TextInput,
  Button,
  Textarea,
  Select,
  NumberInput,
  Stack,
} from "@mantine/core";

type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
};

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, updateProject } = useProjectStore();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (projectId) {
      const decodedName = decodeURIComponent(projectId);
      const currentProject = projects.find((p) => p.name === decodedName);
      if (currentProject) {
        setProject(currentProject);
      }
    }
  }, [projectId, projects]);

  const handleSave = () => {
    if (project) {
      updateProject(project);
      navigate("/ProjectList");
    }
  };

  if (!project) return <div>Loading...</div>;

  return (
    <Box mt="xl" mx="auto" style={{ maxWidth: 600 }}>
      <Stack spacing="md">
        <TextInput
          label="Project Name"
          value={project.name}
          onChange={(e) => setProject({ ...project, name: e.currentTarget.value })}
        />
        <Textarea
          label="Project Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.currentTarget.value })
          }
        />
        <Select
          label="Status"
          value={project.status}
          onChange={(value) =>
            setProject({ ...project, status: value || "" })
          }
          data={["Not Started", "In Progress", "Completed"]}
        />
        <NumberInput
          label="Progress (%)"
          value={project.progress}
          onChange={(value) =>
            setProject({ ...project, progress: value || 0 })
          }
        />
        <Button onClick={handleSave}>Save</Button>
      </Stack>
    </Box>
  );
};

export default ProjectDetails;
