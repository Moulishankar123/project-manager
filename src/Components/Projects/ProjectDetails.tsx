import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/ProjectStore';
import { Box, Text, Button } from '@mantine/core';
import React from 'react';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === Number(projectId))
  );

  if (!project) {
    return (
      <Box p="md">
        <Text>No project found with ID {projectId}</Text>
        <Button onClick={() => navigate('/')}>Back to List</Button>
      </Box>
    );
  }

  return (
    <Box p="md">
      <Text size="xl" weight={700}>{project.name}</Text>
      <Text mt="sm"><strong>Description:</strong> {project.description}</Text>
      <Text mt="sm"><strong>Status:</strong> {project.status}</Text>
      <Text mt="sm"><strong>Progress:</strong> {project.progress}%</Text>
      <Text mt="sm"><strong>Deadline:</strong> {project.deadline}</Text>
      <Button mt="md" onClick={() => navigate('/')}>Back to List</Button>
    </Box>
  );
};

export default ProjectDetails;
