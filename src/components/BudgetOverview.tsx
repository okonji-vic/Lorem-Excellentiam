"use client"

import type { Project } from "../types"
import { DollarSign } from "lucide-react"
import styles from "./BudgetOverview.module.css"

interface BudgetOverviewProps {
  projects: Project[]
}

export function BudgetOverview({ projects }: BudgetOverviewProps) {
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const remaining = totalBudget - totalSpent
  const utilizationPercentage = Math.round((totalSpent / totalBudget) * 100)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className={styles.container}>
      <div className={styles.overview}>
        <div className={styles.budgetBar}>
          <div className={styles.spentBar} style={{ width: `${utilizationPercentage}%` }} />
        </div>

        <div className={styles.percentage}>{utilizationPercentage}% Utilized</div>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <DollarSign size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Total Budget</span>
            <span className={styles.metricValue}>{formatCurrency(totalBudget)}</span>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <DollarSign size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Spent</span>
            <span className={styles.metricValue}>{formatCurrency(totalSpent)}</span>
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricIcon}>
            <DollarSign size={16} />
          </div>
          <div className={styles.metricContent}>
            <span className={styles.metricLabel}>Remaining</span>
            <span className={`${styles.metricValue} ${remaining < totalBudget * 0.2 ? styles.warning : ""}`}>
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.projectBreakdown}>
        <h4 className={styles.breakdownTitle}>Project Budget Breakdown</h4>
        <div className={styles.projectList}>
          {projects.map((project) => {
            const projectUtilization = Math.round((project.spent / project.budget) * 100)
            return (
              <div key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <span className={styles.projectName}>{project.name}</span>
                  <span className={styles.projectBudget}>
                    {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                  </span>
                </div>
                <div className={styles.projectBar}>
                  <div
                    className={styles.projectProgress}
                    style={{
                      width: `${projectUtilization}%`,
                      backgroundColor:
                        projectUtilization > 90
                          ? "var(--error)"
                          : projectUtilization > 75
                            ? "var(--warning)"
                            : "var(--success)",
                    }}
                  />
                </div>
                <span className={styles.projectPercentage}>{projectUtilization}%</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
