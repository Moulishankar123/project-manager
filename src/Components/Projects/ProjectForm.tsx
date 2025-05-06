import React, { useEffect, useState } from "react";
import { Box, Button, Grid, GridCol, Input } from "@mantine/core";
import { DateInput } from '@mantine/dates';
import { useProjectStore } from "../../store/ProjectStore";
import { useNavigate } from "react-router-dom";  

export type ProjectFormData = {
  name: string;
  status: string;
  progress: string;
  date: string;
};

const ProjectForm = () => {
  const { selectedProject, addProject, updateProject, setSelectedProject } = useProjectStore();
  const [formData, setFormData] = useState<ProjectFormData>({ 
    name: '', 
    status: '', 
    progress: '', 
    date: '' 
  });
  
  const navigate = useNavigate();  

  useEffect(() => {
    if (selectedProject) {
      setFormData(selectedProject);
    }
  }, [selectedProject]);

  const handleChange = (field: keyof ProjectFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (value: Date | null) => {
    if (value) {
      const formattedDate = value.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      updateProject(formData);
    } else {
      addProject(formData);
    }
    setFormData({ name: '', status: '', progress: '', date: '' });
    setSelectedProject(null);
    
    navigate(-1);  
  };

  return (
    <Box p={16} component="form" onSubmit={handleSubmit}>
      <Grid gutter={"xl"}>
        <GridCol span={4}>
          <Input.Wrapper label="Name">
            <Input 
              placeholder="Enter the name" 
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
          </Input.Wrapper>
        </GridCol>
        <GridCol span={4}>
          <Input.Wrapper label="Status">
            <Input 
              placeholder="Status of the project" 
              value={formData.status}
              onChange={handleChange('status')}
              required
            />
          </Input.Wrapper>
        </GridCol>
        <GridCol span={4}>
          <Input.Wrapper label="Progress">
            <Input 
              placeholder="Enter the current progress" 
              value={formData.progress}
              onChange={handleChange('progress')}
              required
            />
          </Input.Wrapper>
        </GridCol>
        <GridCol span={4}>
          <DateInput
            value={formData.date ? new Date(formData.date) : null}
            onChange={handleDateChange}
            label="Date"
            placeholder="Select date"
            valueFormat="YYYY-MM-DD"
            required
          />
        </GridCol>
        <GridCol span={12}>
          <Button type="submit" mt="md">
            {selectedProject ? "Update Project" : "Add Project"}
          </Button>
          {selectedProject && (
            <Button 
              variant="outline" 
              ml="sm" 
              onClick={() => {
                setSelectedProject(null);
                setFormData({ name: '', status: '', progress: '', date: '' });
              }}
            >
              Cancel
            </Button>
          )}
        </GridCol>
      </Grid>
    </Box>
  );
};

export default ProjectForm;
