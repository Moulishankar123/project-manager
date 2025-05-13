import React, { useState } from 'react';
import {
  DndContext,
  useDroppable,
  useDraggable,
  closestCenter,
} from '@dnd-kit/core';
import {
  Button,
  Modal,
  TextInput,
  Textarea,
  Select,
  Group,
  SimpleGrid,
  useMantineTheme,
  Flex,
} from '@mantine/core';
import { useMediaQuery} from '@mantine/hooks';
import { useMantineColorScheme } from '@mantine/core';

import { v4 as uuidv4 } from 'uuid';

const initialTasks = [
  {
    id: '1',
    projectId: 1,
    title: 'Wireframe Design',
    description: 'Create wireframes',
    status: 'Completed',
  },
  {
    id: '2',
    projectId: 1,
    title: 'Frontend Dev',
    description: 'React Implementation',
    status: 'In Progress',
  },
  {
    id: '3',
    projectId: 1,
    title: 'User Testing',
    description: 'Conduct sessions',
    status: 'To Do',
  },
];

const statuses = ['To Do', 'In Progress', 'Completed'];

function DroppableColumn({ status, children, dark, theme }) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: '300px',
        padding: '1rem',
        background: dark ? theme.colors.dark[6] : '#f1f3f5',
        borderRadius: 8,
      }}
    >
      <h3 style={{ color: dark ? theme.white : theme.black }}>{status}</h3>
      {children}
    </div>
  );
}

function DraggableTask({ task, onEdit, onDelete, dark }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: dark
      ? 'rgba(44, 46, 51, 0.6)' 
      : 'rgba(255, 255, 255, 0.6)', 
    color: dark ? 'white' : 'black',
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div {...listeners} {...attributes} style={{ fontWeight: 'bold' }}>
        {task.title}
      </div>
      <p>{task.description}</p>
      <Group mt={4}>
        <Button size="xs" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button size="xs" color="red" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </Group>
    </div>
  );
}

export default function TaskCard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [projectId] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
  });

  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isMediumScreen = useMediaQuery('(max-width: 1024px)');

  const openCreateModal = () => {
    setEditTask(null);
    setFormData({ title: '', description: '', status: 'To Do' });
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editTask.id ? { ...t, ...formData } : t))
      );
    } else {
      setTasks((prev) => [
        ...prev,
        { ...formData, id: uuidv4(), projectId },
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: over.id } : task
      )
    );
  };

  return (
    <>
      <Flex>
      <Button mb="md" onClick={openCreateModal} ml="auto">
        Add Task
      </Button>
      </Flex>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SimpleGrid cols={isSmallScreen ? 1 : isMediumScreen ? 2 : 3} spacing="md">
          {statuses.map((status) => (
            <DroppableColumn key={status} status={status} dark={dark} theme={theme}>
              {tasks
                .filter((task) => task.status === status && task.projectId === projectId)
                .map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                    dark={dark}
                  />
                ))}
            </DroppableColumn>
          ))}
        </SimpleGrid>
      </DndContext>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTask ? 'Edit Task' : 'New Task'}
      >
        <TextInput
          label="Title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          mt="sm"
        />
        <Select
          label="Status"
          data={statuses}
          value={formData.status}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, status: val }))
          }
          mt="sm"
        />
        <Button fullWidth mt="md" onClick={handleSave}>
          {editTask ? 'Update Task' : 'Create Task'}
        </Button>
      </Modal>
    </>
  );
}
