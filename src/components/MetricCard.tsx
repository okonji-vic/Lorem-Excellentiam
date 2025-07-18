"use client"

import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import styles from "./MetricCard.module.css"

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  color: "primary" | "success" | "warning" | "error"
}

const colorClasses = {
  primary: styles.primary,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
}

export function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const isPositive = change > 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className={`${styles.card} ${colorClasses[color]}`}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={24} />
        </div>
        <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
          <TrendIcon size={16} />
          <span className={styles.changeValue}>{Math.abs(change)}%</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  )
}
