import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/ProjectStore';
import {
  Box,
  Text,
  Button,
  Container,
  Grid,
  GridCol,
  Input,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === Number(projectId))
  );

  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const [formData, setFormData] = useState({
    name: '',
    status: '',
    progress: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        status: project.status || '',
        progress: String(project.progress) || '',
        description: project.description || '',
        deadline: project.deadline || '',
      });
    }
  }, [project]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      deadline: date?.toISOString().split('T')[0] || '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!project) return;

    const updatedProject = {
      ...project,
      ...formData,
      progress: Number(formData.progress),
    };

    updateProject(updatedProject);
    navigate(-1);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(project.id);
      navigate('/projects');
    }
  };

  if (!project) {
    return (
      <Box p="md">
        <Text>No project found with ID {projectId}</Text>
        <Button onClick={() => navigate('/projects')}>Back to List</Button>
      </Box>
    );
  }

  return (
    <Container size="lg" p="md">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid gutter="lg">
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Input.Wrapper label="Name" required>
              <Input
                placeholder="Enter the project name"
                value={formData.name}
                onChange={handleChange('name')}
              />
            </Input.Wrapper>
          </GridCol>

          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Input.Wrapper label="Status" required>
              <Input
                placeholder="Status of the project"
                value={formData.status}
                onChange={handleChange('status')}
              />
            </Input.Wrapper>
          </GridCol>

          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Input.Wrapper label="Progress (%)" required>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="Enter the current progress"
                value={formData.progress}
                onChange={handleChange('progress')}
              />
            </Input.Wrapper>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Input.Wrapper label="Description" required>
              <Textarea
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Input.Wrapper>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <DateInput
              label="Deadline"
              placeholder="Select deadline"
              valueFormat="YYYY-MM-DD"
              value={formData.deadline ? new Date(formData.deadline) : null}
              onChange={handleDateChange}
              required
              fullWidth
            />
          </GridCol>
        </Grid>

        <Box mt="lg" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Button type="submit">Update</Button>

      <Box style={{ display: 'flex', gap: '10px' }}>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </Box>
      </Box>
    </Container>
  );
};

export default ProjectDetails;
