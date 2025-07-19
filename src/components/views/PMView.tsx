// "use client"

// import { useState } from "react"
// import { useProject } from "../../contexts/ProjectContext"
// import { ProjectCard } from "../ProjectCard"
// import { MilestoneCard } from "../MilestoneCard"
// import { ProjectForm } from "../ProjectForm"
// import { Users, TrendingUp, AlertTriangle, Calendar } from "lucide-react"
// import styles from "./PMView.module.css"

// export function PMView() {
//   const { projects, milestones, tasks } = useProject()
//   const [showProjectForm, setShowProjectForm] = useState(false)
//   const [activeTab, setActiveTab] = useState<"projects" | "milestones">("projects")

//   const activeProjects = projects.filter((p) => p.status === "active")
//   const atRiskMilestones = milestones.filter((m) => m.status === "at-risk")
//   const upcomingDeadlines = milestones
//     .filter((m) => {
//       const endDate = new Date(m.endDate)
//       const now = new Date()
//       const daysUntilDeadline = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
//       return daysUntilDeadline <= 7 && daysUntilDeadline >= 0 && m.status !== "completed"
//     })
//     .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

//   const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
//   const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
//   const budgetUtilization = Math.round((totalSpent / totalBudget) * 100)

//   return (
//     <div className={styles.container}>
//       <div className={styles.header}>
//         <div className={styles.titleSection}>
//           <Users className={styles.icon} />
//           <div>
//             <h1 className={styles.title}>Project Manager Dashboard</h1>
//             <p className={styles.subtitle}>Project oversight and team coordination</p>
//           </div>
//         </div>

//         <button onClick={() => setShowProjectForm(true)} className={styles.addButton}>
//           + New Project
//         </button>
//       </div>

//       <div className={styles.stats}>
//         <div className={styles.statCard}>
//           <div className={styles.statIcon}>
//             <TrendingUp />
//           </div>
//           <div className={styles.statContent}>
//             <span className={styles.statValue}>{activeProjects.length}</span>
//             <span className={styles.statLabel}>Active Projects</span>
//           </div>
//         </div>

//         <div className={styles.statCard}>
//           <div className={styles.statIcon}>
//             <AlertTriangle />
//           </div>
//           <div className={styles.statContent}>
//             <span className={styles.statValue}>{atRiskMilestones.length}</span>
//             <span className={styles.statLabel}>At Risk Milestones</span>
//           </div>
//         </div>

//         <div className={styles.statCard}>
//           <div className={styles.statIcon}>
//             <Calendar />
//           </div>
//           <div className={styles.statContent}>
//             <span className={styles.statValue}>{upcomingDeadlines.length}</span>
//             <span className={styles.statLabel}>Upcoming Deadlines</span>
//           </div>
//         </div>

//         <div className={styles.statCard}>
//           <div className={styles.statIcon}>
//             <TrendingUp />
//           </div>
//           <div className={styles.statContent}>
//             <span className={styles.statValue}>{budgetUtilization}%</span>
//             <span className={styles.statLabel}>Budget Utilization</span>
//           </div>
//         </div>
//       </div>

//       {upcomingDeadlines.length > 0 && (
//         <div className={styles.alertSection}>
//           <h2 className={styles.alertTitle}>
//             <AlertTriangle className={styles.alertIcon} />
//             Upcoming Deadlines (Next 7 Days)
//           </h2>
//           <div className={styles.deadlineList}>
//             {upcomingDeadlines.map((milestone) => (
//               <div key={milestone.id} className={styles.deadlineItem}>
//                 <div className={styles.deadlineInfo}>
//                   <span className={styles.deadlineName}>{milestone.title}</span>
//                   <span className={styles.deadlineDate}>Due: {new Date(milestone.endDate).toLocaleDateString()}</span>
//                 </div>
//                 <div className={styles.deadlineProgress}>
//                   <div className={styles.progressBar} style={{ width: `${milestone.progress}%` }} />
//                   <span className={styles.progressText}>{milestone.progress}%</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className={styles.tabs}>
//         <button
//           onClick={() => setActiveTab("projects")}
//           className={`${styles.tab} ${activeTab === "projects" ? styles.activeTab : ""}`}
//         >
//           Projects ({projects.length})
//         </button>
//         <button
//           onClick={() => setActiveTab("milestones")}
//           className={`${styles.tab} ${activeTab === "milestones" ? styles.activeTab : ""}`}
//         >
//           Milestones ({milestones.length})
//         </button>
//       </div>

//       <div className={styles.content}>
//         {activeTab === "projects" ? (
//           <div className={styles.projectGrid}>
//             {projects.map((project) => (
//               <ProjectCard key={project.id} project={project} />
//             ))}
//           </div>
//         ) : (
//           <div className={styles.milestoneGrid}>
//             {milestones.map((milestone) => (
//               <MilestoneCard key={milestone.id} milestone={milestone} />
//             ))}
//           </div>
//         )}
//       </div>

//       {showProjectForm && <ProjectForm onClose={() => setShowProjectForm(false)} />}
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useCallback } from "react"
import { useProject } from "../../contexts/ProjectContext"
import { ProjectCard } from "../ProjectCard"
import { MilestoneCard } from "../MilestoneCard"
import { ProjectForm } from "../ProjectForm"
import { Users, TrendingUp, AlertTriangle, Calendar } from "lucide-react"
import { TabList, Tab, Button, Spinner, MessageBar } from "@fluentui/react-components"
import { Add24Regular } from "@fluentui/react-icons"
import styles from "./PMView.module.css"

type TabValue = "projects" | "milestones"

export function PMView() {
  const { projects, milestones, tasks, loading, error, refreshData } = useProject()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [activeTab, setActiveTab] = useState<TabValue>("projects")
  const [refreshKey, setRefreshKey] = useState(0)

  // Force re-render when tab changes
  const handleTabChange = useCallback(
    (tabValue: TabValue) => {
      setActiveTab(tabValue)
      setRefreshKey((prev) => prev + 1)
      // Refresh data to ensure fresh content
      refreshData()
    },
    [refreshData],
  )

  // Auto-refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [refreshData])

  const activeProjects = projects.filter((p) => p.status === "active")
  const atRiskMilestones = milestones.filter((m) => m.status === "at-risk")
  const upcomingDeadlines = milestones
    .filter((m) => {
      const endDate = new Date(m.endDate)
      const now = new Date()
      const daysUntilDeadline = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilDeadline <= 7 && daysUntilDeadline >= 0 && m.status !== "completed"
    })
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const budgetUtilization = Math.round((totalSpent / totalBudget) * 100)

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" label="Loading project data..." />
      </div>
    )
  }

  return (
    <div className={styles.container} key={refreshKey}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Users className={styles.icon} />
          <div>
            <h1 className={styles.title}>Project Manager Dashboard</h1>
            <p className={styles.subtitle}>Project oversight and team coordination</p>
          </div>
        </div>

        <Button appearance="primary" icon={<Add24Regular />} onClick={() => setShowProjectForm(true)}>
          New Project
        </Button>
      </div>

      {error && (
        <MessageBar intent="error" className={styles.errorMessage}>
          {error}
        </MessageBar>
      )}

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{activeProjects.length}</span>
            <span className={styles.statLabel}>Active Projects</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AlertTriangle />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{atRiskMilestones.length}</span>
            <span className={styles.statLabel}>At Risk Milestones</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{upcomingDeadlines.length}</span>
            <span className={styles.statLabel}>Upcoming Deadlines</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{budgetUtilization}%</span>
            <span className={styles.statLabel}>Budget Utilization</span>
          </div>
        </div>
      </div>

      {upcomingDeadlines.length > 0 && (
        <div className={styles.alertSection}>
          <h2 className={styles.alertTitle}>
            <AlertTriangle className={styles.alertIcon} />
            Upcoming Deadlines (Next 7 Days)
          </h2>
          <div className={styles.deadlineList}>
            {upcomingDeadlines.map((milestone) => (
              <div key={milestone.id} className={styles.deadlineItem}>
                <div className={styles.deadlineInfo}>
                  <span className={styles.deadlineName}>{milestone.title}</span>
                  <span className={styles.deadlineDate}>Due: {new Date(milestone.endDate).toLocaleDateString()}</span>
                </div>
                <div className={styles.deadlineProgress}>
                  <div className={styles.progressBar} style={{ width: `${milestone.progress}%` }} />
                  <span className={styles.progressText}>{milestone.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.tabContainer}>
        <TabList
          selectedValue={activeTab}
          onTabSelect={(_, data) => handleTabChange(data.value as TabValue)}
          className={styles.tabList}
        >
          <Tab value="projects" className={styles.tab}>
            Projects ({projects.length})
          </Tab>
          <Tab value="milestones" className={styles.tab}>
            Milestones ({milestones.length})
          </Tab>
        </TabList>

        <div className={styles.tabContent}>
          {/* <TabPanel value="projects" className={styles.tabPanel}>
            <div className={styles.projectGrid}>
              {projects.map((project) => (
                <ProjectCard key={`${project.id}-${refreshKey}`} project={project} />
              ))}
            </div>
          </TabPanel>

          <TabPanel value="milestones" className={styles.tabPanel}>
            <div className={styles.milestoneGrid}>
              {milestones.map((milestone) => (
                <MilestoneCard key={`${milestone.id}-${refreshKey}`} milestone={milestone} />
              ))}
            </div>
          </TabPanel> */}
            {activeTab === "projects" ? (
                <div className={styles.projectGrid}>
                {projects.map((project) => (
                    <ProjectCard key={`${project.id}-${refreshKey}`} project={project} />
                ))}
                </div>
            ) : (
                <div className={styles.milestoneGrid}>
                {milestones.map((milestone) => (
                    <MilestoneCard key={`${milestone.id}-${refreshKey}`} milestone={milestone} />
                ))}
                </div>
            )}
        </div>
      </div>

      {showProjectForm && <ProjectForm onClose={() => setShowProjectForm(false)} />}
    </div>
  )
}
