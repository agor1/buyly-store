"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, SpinnerIcon } from "@phosphor-icons/react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      icons={{
        success: (
          <CheckCircleIcon className="size-4 text-green" />
        ),
        info: (
          <InfoIcon className="size-4 text-cyan" />
        ),
        warning: (
          <WarningIcon className="size-4 text-amber" />
        ),
        error: (
          <XCircleIcon className="size-4 text-red-400" />
        ),
        loading: (
          <SpinnerIcon className="size-4 animate-spin text-cyan" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--surface)",
          "--normal-text": "var(--text-bright)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--surface)",
          "--success-text": "var(--text-bright)",
          "--success-border": "var(--green)",
          "--error-bg": "var(--surface)",
          "--error-text": "var(--text-bright)",
          "--error-border": "rgb(239 68 68)",
          "--warning-bg": "var(--surface)",
          "--warning-text": "var(--text-bright)",
          "--warning-border": "var(--amber)",
          "--info-bg": "var(--surface)",
          "--info-text": "var(--text-bright)",
          "--info-border": "var(--cyan)",
          "--border-radius": "0px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border-hairline bg-surface font-mono text-caption text-text-bright shadow-cyan [--toast-accent:var(--cyan)] [border-left:4px_solid_var(--toast-accent)]",
          title: "font-display text-sm font-bold text-text-bright",
          description: "text-xs text-muted-foreground",
          closeButton:
            "border-border bg-base text-text-bright hover:border-cyan hover:text-cyan",
          success: "[--toast-accent:var(--green)]",
          error: "[--toast-accent:rgb(248_113_113)]",
          warning: "[--toast-accent:var(--amber)]",
          info: "[--toast-accent:var(--cyan)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
