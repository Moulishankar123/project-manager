import React, { useEffect, useState } from "react";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; 
import 'mantine-react-table/styles.css';
import { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
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
import { IconChevronLeft, IconChevronRight, IconSearch } from "@tabler/icons-react";
import { useProjectStore } from "../../store/ProjectStore";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

const ProjectList = () => {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Progress',
      },
      {
        accessorKey: 'deadline',
        header: 'Deadline',
      },
    ],
    [],
  );

 //const ProjectList = () => {
  const { projects, initialize } = useProjectStore();
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleRowClick = (projectId: string) => {
    if (projectId) {
      navigate(`/projectdetails/${projectId}`);
    }
  };

  return (
    <div>
      <Flex
        direction={isMobile ? "column-reverse" : "row"}
        justify="space-between"
        align={isMobile ? "flex-start" : "center"}
        gap={isMobile ? "sm" : "md"}
      >
        <Box mt="xl" mb="md" style={{ flex: 1, width: "100%" }}>
          <TextInput
            placeholder="Search projects..."
            value={globalFilter}
            onChange={(e) => {
              setGlobalFilter(e.currentTarget.value);
              setPage(1);
            }}
            style={{
              width: "100%",
              maxWidth: "500px",
            }}
            leftSection={<IconSearch size={16} />}
            leftSectionWidth={40}
          />
        </Box>
        <Button
          onClick={handleCreateButtonClick}
          mt={isMobile ? "sm" : "md"}
          style={{ minWidth: isMobile ? "100%" : "auto" }}
        >
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
          layoutMode="grid" 
          mantineTableProps={{
            striped: true,
            withBorder: true,
            withColumnBorders: false,
          }}
          mantineTableContainerProps={{
            style: { overflowX: "auto" }, 
          }}
          mantineTableBodyRowProps={({ row }) => ({
            style: { cursor: "pointer" },
            onClick: () => {
              const projectId = row.original.id;
              if (projectId) {
                handleRowClick(projectId);
              }
            },
          })}
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
