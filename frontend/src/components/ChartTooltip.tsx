import React from 'react'

export interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number | string
    color?: string
    dataKey?: string | number
    payload?: Record<string, any>
  }>
  label?: string | number
  labelFormatter?: (label: any) => React.ReactNode
  valueFormatter?: (value: any, name?: string) => string
}

export function ChartTooltip({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const formattedLabel = labelFormatter
    ? labelFormatter(label)
    : label !== undefined && label !== null && label !== ''
      ? String(label)
      : null

  return (
    <div className="min-w-[140px] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-xs shadow-xl shadow-black/40 backdrop-blur-md">
      {formattedLabel && (
        <div className="mb-2 border-b border-[var(--color-border)] pb-1.5 text-[11px] font-medium tracking-wide text-[var(--color-text-muted)]">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => {
          const rawName = entry.name || entry.dataKey || 'Value'
          const displayName = String(rawName).charAt(0).toUpperCase() + String(rawName).slice(1)
          const color =
            entry.color || entry.payload?.fill || entry.payload?.color || 'var(--color-accent)'
          const formattedValue = valueFormatter
            ? valueFormatter(entry.value, String(rawName))
            : String(entry.value ?? '')

          return (
            <div className="flex items-center justify-between gap-4" key={index}>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[var(--color-text-secondary)]">{displayName}</span>
              </div>
              <span className="font-semibold tabular-nums text-[var(--color-text)]">
                {formattedValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
