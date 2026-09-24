declare module "*.mdx" {
  import type { ComponentType } from "react"

  const MDXComponent: ComponentType
  export default MDXComponent
}

declare module "virtual:docs-raw" {
  const docsRaw: Record<string, string>
  export default docsRaw
}
