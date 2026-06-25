type ProjectCardProps = {
  id: string
  name: string
  description: string
  themeColor: string
  tags: readonly string[]
  href: string
}

export function ProjectCard({ id, name, description, themeColor, tags, href }: ProjectCardProps) {
  return (
    <article className="flex flex-col rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="h-1.5 w-full" style={{ backgroundColor: themeColor }} />
      <div className="flex flex-col flex-1 p-6 gap-4">
        <header className="flex items-start gap-3">
          <span className="text-xs font-mono font-semibold text-slate-400 mt-1">#{id}</span>
          <h2 className="text-lg font-semibold text-white leading-snug">{name}</h2>
        </header>
        <p className="text-sm text-slate-400 leading-relaxed flex-1">{description}</p>
        <ul className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <li
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300"
            >
              {tag}
            </li>
          ))}
        </ul>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: themeColor }}
        >
          Launch app
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
            <path fillRule="evenodd" d="M4.22 11.78a.75.75 0 0 1 0-1.06L9.44 5.5H5.75a.75.75 0 0 1 0-1.5h5.5a.75.75 0 0 1 .75.75v5.5a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </article>
  )
}
