"use client"

import { useProject } from "../../contexts/ProjectContext"
import { MetricCard } from "../MetricCard"
import { ProjectStatusChart } from "../ProjectStatusChart"
import { BudgetOverview } from "../BudgetOverview"
import { Crown, TrendingUp, DollarSign, Users, Calendar } from "lucide-react"
import styles from "./ExecutiveView.module.css"

export function ExecutiveView() {
  const { projects, tasks, milestones, teamMembers } = useProject()

  // Calculate key metrics
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const budgetUtilization = Math.round((totalSpent / totalBudget) * 100)

  const completedProjects = projects.filter((p) => p.status === "completed").length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const projectCompletionRate = Math.round((completedProjects / projects.length) * 100)

  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const taskCompletionRate = Math.round((completedTasks / tasks.length) * 100)

  const onTimeDelivery = milestones.filter((m) => {
    if (m.status !== "completed") return false
    // Simplified on-time calculation
    return true
  }).length
  const onTimeDeliveryRate =
    Math.round((onTimeDelivery / milestones.filter((m) => m.status === "completed").length) * 100) || 0

  const averageProjectProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)

  const atRiskProjects = projects.filter((p) => {
    const endDate = new Date(p.endDate)
    const now = new Date()
    const daysUntilDeadline = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilDeadline <= 30 && p.progress < 70 && p.status === "active"
  }).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Crown className={styles.icon} />
          <div>
            <h1 className={styles.title}>Executive Dashboard</h1>
            <p className={styles.subtitle}>Strategic overview and key performance indicators</p>
          </div>
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <MetricCard
          title="Total Portfolio Value"
          value={`$${(totalBudget / 1000).toFixed(0)}K`}
          change={+12.5}
          icon={DollarSign}
          color="primary"
        />

        <MetricCard
          title="Budget Utilization"
          value={`${budgetUtilization}%`}
          change={budgetUtilization > 80 ? -5.2 : +3.1}
          icon={TrendingUp}
          color={budgetUtilization > 90 ? "warning" : "success"}
        />

        <MetricCard
          title="Project Completion Rate"
          value={`${projectCompletionRate}%`}
          change={+8.3}
          icon={Calendar}
          color="success"
        />

        <MetricCard
          title="Team Utilization"
          value={`${Math.round(((activeProjects * 3) / teamMembers.length) * 100)}%`}
          change={+2.1}
          icon={Users}
          color="primary"
        />
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Project Status Distribution</h3>
          <ProjectStatusChart projects={projects} />
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Budget Overview</h3>
          <BudgetOverview projects={projects} />
        </div>
      </div>

      <div className={styles.insightsGrid}>
        <div className={styles.insightCard}>
          <h3 className={styles.insightTitle}>Performance Summary</h3>
          <div className={styles.insightMetrics}>
            <div className={styles.insightMetric}>
              <span className={styles.metricLabel}>Average Project Progress</span>
              <span className={styles.metricValue}>{averageProjectProgress}%</span>
            </div>
            <div className={styles.insightMetric}>
              <span className={styles.metricLabel}>Task Completion Rate</span>
              <span className={styles.metricValue}>{taskCompletionRate}%</span>
            </div>
            <div className={styles.insightMetric}>
              <span className={styles.metricLabel}>On-Time Delivery</span>
              <span className={styles.metricValue}>{onTimeDeliveryRate}%</span>
            </div>
          </div>
        </div>

        <div className={styles.insightCard}>
          <h3 className={styles.insightTitle}>Risk Assessment</h3>
          <div className={styles.riskMetrics}>
            <div className={styles.riskItem}>
              <span className={styles.riskLabel}>Projects at Risk</span>
              <span className={`${styles.riskValue} ${atRiskProjects > 0 ? styles.riskHigh : styles.riskLow}`}>
                {atRiskProjects}
              </span>
            </div>
            <div className={styles.riskItem}>
              <span className={styles.riskLabel}>Budget Overrun Risk</span>
              <span className={`${styles.riskValue} ${budgetUtilization > 85 ? styles.riskHigh : styles.riskLow}`}>
                {budgetUtilization > 85 ? "High" : "Low"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.insightCard}>
          <h3 className={styles.insightTitle}>Resource Allocation</h3>
          <div className={styles.resourceMetrics}>
            <div className={styles.resourceItem}>
              <span className={styles.resourceLabel}>Active Projects</span>
              <span className={styles.resourceValue}>{activeProjects}</span>
            </div>
            <div className={styles.resourceItem}>
              <span className={styles.resourceLabel}>Team Members</span>
              <span className={styles.resourceValue}>{teamMembers.length}</span>
            </div>
            <div className={styles.resourceItem}>
              <span className={styles.resourceLabel}>Avg. Team Size</span>
              <span className={styles.resourceValue}>
                {Math.round(projects.reduce((sum, p) => sum + p.teamMembers.length, 0) / projects.length)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
