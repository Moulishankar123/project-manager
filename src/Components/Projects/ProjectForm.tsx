import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  GridCol,
  Input,
  Textarea,
  Container,
  Stack,
  Flex,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useProjectStore } from "../../store/ProjectStore";
import { useNavigate } from "react-router-dom";

export type ProjectFormData = {
  id: number;
  name: string;
  status: string;
  description: string;
  progress: string;
  deadline: string;
};

const ProjectForm = () => {
  const {
    selectedProject,
    addProject,
    updateProject,
    setSelectedProject,
    getNextId,
  } = useProjectStore();

  const [formData, setFormData] = useState<ProjectFormData>({
    id: 0,
    name: "",
    status: "",
    description: "",
    progress: "",
    deadline: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProject) {
      setFormData(selectedProject);
    } else {
      setFormData({
        id: getNextId(),
        name: "",
        status: "",
        description: "",
        progress: "",
        deadline: "",
      });
    }
  }, [selectedProject, getNextId]);

  const handleChange = (field: keyof ProjectFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (value: Date | null) => {
    if (value) {
      const formattedDate = value.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, deadline: formattedDate }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProject) {
      updateProject(formData);
    } else {
      addProject(formData);
    }

    setFormData({
      id: getNextId(),
      name: "",
      status: "",
      description: "",
      progress: "",
      deadline: "",
    });
    setSelectedProject(null);
    navigate(-1);
  };

  return (
    <Container size="lg" p="md">
      <Box component="form" onSubmit={handleSubmit}>
        <Grid gutter="lg">
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Input.Wrapper label="Name" required>
              <Input
                placeholder="Enter the project name"
                value={formData.name}
                onChange={handleChange("name")}
              />
            </Input.Wrapper>
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Input.Wrapper label="Status" required>
              <Input
                placeholder="Status of the project"
                value={formData.status}
                onChange={handleChange("status")}
              />
            </Input.Wrapper>
          </GridCol>
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Input.Wrapper label="Progress" required>
              <Input
                placeholder="Enter the current progress"
                value={formData.progress}
                onChange={handleChange("progress")}
              />
            </Input.Wrapper>
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Input.Wrapper label="Description" required>
              <Textarea
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange("description")}
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
          <GridCol>
            <Flex justify={"space-between"} className="lg:mt={200}" mt={50}>
              <Button onClick={()=>navigate(-1)}>
                Back
              </Button>
               <Button type="submit">
                Add Project
              </Button>
              </Flex>
          </GridCol>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProjectForm;
