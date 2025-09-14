import { ReactNode } from 'react'

type ExternalLinkProps = {
  href: string
  children: ReactNode
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <a className="button" href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}


