import React, { useEffect, useState } from "react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import {
  Box,
  TextInput,
  Group,
  Text,
  ActionIcon,
  NumberInput,
  Button,
  Flex
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useProjectStore } from "../../store/ProjectStore";
import { useNavigate } from "react-router-dom"; 

const PAGE_SIZE = 5;

const columns: MRT_ColumnDef<Project>[] = [
  { accessorKey: "name", header: "Name", size: 200 },
  { accessorKey: "status", header: "Status", size: 150 },
  { accessorKey: "progress", header: "Progress", size: 150 },
  { accessorKey: "date", header: "Date", size: 150 },
];

const ProjectList = () => {
  const { projects, initialize } = useProjectStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); 

  useEffect(() => {
    initialize();
  }, [initialize]);

  const filteredProjects = projects.filter((project) =>
    Object.values(project).some((value) =>
      String(value).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  }, [filteredProjects.length, page]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const paginatedProjects = filteredProjects.slice(startIdx, endIdx);

  const handleCreateButtonClick = () => {
    navigate('/ProjectForm'); 
  };

  return (
    <div>
      <Flex justify="space-between">
      <Box mt="xl" mb="md">
        <TextInput
          placeholder="Search projects..."
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.currentTarget.value);
            setPage(1);
          }}
          style={{ width: 300 }}
        />
      </Box>
      <Button onClick={handleCreateButtonClick} mt="md">
        Create New Project
      </Button>
      </Flex>
      <Box mt="md">
        <MantineReactTable
          columns={columns}
          data={paginatedProjects}
          enableColumnActions={false}
          enablePagination={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          enableRowSelection={false}
          mantineTableProps={{
            striped: true,
            withBorder: true,
            withColumnBorders: true,
          }}
          mantineTableBodyRowProps={{ style: { cursor: "pointer" } }}
        />
      </Box>

      <Group justify="space-between" align="center" mt="md" px="sm" wrap="wrap" gap="sm">
        <Text size="sm" color="dimmed">
          Rows {filteredProjects.length === 0 ? "0-0" : `${startIdx + 1}-${Math.min(endIdx, filteredProjects.length)}`} of {filteredProjects.length}
        </Text>

        <Group spacing="xs" wrap="nowrap">
          <ActionIcon
            variant="subtle"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage <= 1}
          >
            <IconChevronLeft />
          </ActionIcon>

          <NumberInput
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(val) => {
              if (typeof val === "number") setPage(val);
            }}
            styles={{ input: { width: 50, textAlign: "center" } }}
            hideControls
            onWheel={(e) => e.currentTarget.blur()}
          />

          <ActionIcon
            variant="subtle"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages}
          >
            <IconChevronRight />
          </ActionIcon>
        </Group>
      </Group>

      
    </div>
  );
};

export default ProjectList;
