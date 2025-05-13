import React, { useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import {
  AppShell,
  Burger,
  Text,
  useMantineTheme,
  ScrollArea,
  Flex,
  Box,
  Group,
  Avatar,
  Divider,
  NavLink,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconFolder,
  IconChecklist,
  IconHelpCircle,
  IconLogout,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';

import Projects from '../Projects/ProjectList';
import Create from '../Projects/ProjectForm'; 
import View from '../Projects/ProjectDetails'; 
import TaskCard from '../Tasks/Taskdnd';
import '../../App.css';

function HomePage() {
  return <Text>Welcome to the Home Page!</Text>;
}

function HelpCenter() {
  return <Text>Help Center Content</Text>;
}

const App_Shell = () => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const isSmallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Router>
      <AppShell
        padding="md"
        header={{ height: 70 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '100%',
              padding: '0 1rem',
            }}
          >
            {isSmallScreen && (
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
              />
            )}
            <Box w="100%">
              <Flex justify="space-between" align="center" px="md" py="sm">
                <Flex align="center" gap="sm">
                  <img
                    src="https://png.pngtree.com/png-clipart/20240804/original/pngtree-human-resource-manager-logo-and-icon-design-template-vector-png-image_15704050.png"
                    alt="Logo"
                    style={{ height: 55 }}
                  />
                  <Text size="lg" fw={700} className="animated-text">
                    Management Info
                  </Text>
                </Flex>

                <ActionIcon
                  variant="outline"
                  color={dark ? 'yellow' : 'blue'}
                  onClick={toggleColorScheme}
                  title="Toggle color scheme"
                >
                  {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
              </Flex>
            </Box>
          </div>
        </AppShell.Header>

        <AppShell.Navbar
          p="md"
          component={Box}
          style={{
            backgroundColor: dark ? theme.colors.dark[7] : '#f7fbfa',
            color: dark ? theme.colors.gray[3] : theme.colors.dark[6],
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
         <ScrollArea
    type="auto"
    style={{
      flex: 1,
      WebkitOverflowScrolling: 'touch', 
    }}
  >
            <Box style={{ display: 'grid', rowGap: '35px', marginTop: 20 }}>
              {[
                {
                  icon: <IconLayoutDashboard size={20} style={{ marginRight: 8 }} />,
                  label: 'Dashboard',
                  to: '/',
                },
                {
                  icon: <IconFolder size={20} style={{ marginRight: 8 }} />,
                  label: 'Project Page',
                  to: '/projects',
                },
                {
                  icon: <IconChecklist size={20} style={{ marginRight: 8 }} />,
                  label: 'Task Page',
                  to: '/tasks',
                },
                {
                  icon: <IconHelpCircle size={20} style={{ marginRight: 8 }} />,
                  label: 'Help Center',
                  to: '/help',
                },
                 
              ].map(({ icon, label, to }) => (
                <NavLink
                  key={to}
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {icon}
                      {label}
                    </div>
                  }
                  component={Link}
                  to={to}
                  onClick={() => setOpened(false)}
                  style={{
                    borderRadius: 8,
                    padding: '12px 12px',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                    color: dark ? theme.colors.gray[2] : theme.black,
                  }}
                  onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = dark
                    ? theme.colors.dark[5]
                    : '#E6F7F9')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                />
              ))}
            </Box>
          </ScrollArea>

          <Box
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: dark ? theme.colors.dark[7] : '#f7fbfa',
              paddingTop: theme.spacing.lg,
              paddingBottom: theme.spacing.md,
              borderTop: `1px solid ${dark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
            }}
          >
            <Group position="apart" align="center" noWrap>
              <Group spacing="sm">
                <Avatar radius="xl">R</Avatar>
                <Box>
                  <Text size="sm" fw={500} c={dark ? 'gray.3' : 'dark'}>
                    Mouli
                  </Text>
                  <Text size="xs" c={dark ? 'gray.5' : 'dimmed'}>
                    +201094828532
                  </Text>
                </Box>
              </Group>
              <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
                <IconLogout
                  size={20}
                  style={{ cursor: 'pointer' }}
                  onClick={() => alert('Logout action triggered')}
                />
              </div>
            </Group>
          </Box>
        </AppShell.Navbar>


        <AppShell.Main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/ProjectForm" element={<Create />} />
            <Route path="/projectdetails/:projectId" element={<View />} />
            <Route path="/tasks" element={<TaskCard dark={dark} theme={theme} />} />
            <Route path="/help" element={<HelpCenter />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </Router>
  );
};

export default App_Shell;
