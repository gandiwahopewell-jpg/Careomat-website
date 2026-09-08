import Link from "next/link"
import { ArrowUpRight, Menu } from "lucide-react"

const navigation = [
  ["Services", "/services"],
  ["Work", "/work"],
  ["Resources", "/resources"],
  ["About", "/about"],
]

export function Logo() {
  return <Link href="/" className="font-sans text-xl font-semibold tracking-tight" aria-label="Careomat home">careomat<span className="text-primary">.</span></Link>
}

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="page-shell flex h-18 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navigation.map(([label, href]) => <Link key={href} href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground">{label}</Link>)}
        </nav>
        <Link href="/contact" className="hidden items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:flex">Discuss a project <ArrowUpRight aria-hidden="true" /></Link>
        <details className="relative md:hidden">
          <summary className="flex cursor-pointer list-none items-center rounded-md border p-2" aria-label="Open navigation"><Menu aria-hidden="true" /></summary>
          <nav className="absolute right-0 top-12 flex w-56 flex-col gap-1 rounded-lg border bg-background p-3 shadow-lg" aria-label="Mobile navigation">
            {navigation.map(([label, href]) => <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">{label}</Link>)}
            <Link href="/contact" className="mt-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Discuss a project</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex max-w-md flex-col gap-4"><Logo /><p className="text-sm leading-6 text-secondary-foreground/70">A UK software consultancy helping organisations make sound technical decisions and build dependable digital services.</p></div>
        <div className="flex flex-col gap-3 text-sm"><p className="font-semibold">Explore</p>{navigation.map(([label, href]) => <Link key={href} href={href} className="text-secondary-foreground/70 hover:text-secondary-foreground">{label}</Link>)}</div>
        <div className="flex flex-col gap-3 text-sm"><p className="font-semibold">Start a conversation</p><Link href="mailto:hello@careomat.co.uk" className="text-secondary-foreground/70 hover:text-secondary-foreground">hello@careomat.co.uk</Link><Link href="/contact" className="text-secondary-foreground/70 hover:text-secondary-foreground">Project enquiry</Link><p className="text-secondary-foreground/60">Working with teams across the UK.</p></div>
      </div>
      <div className="page-shell flex flex-col gap-2 border-t border-secondary-foreground/15 py-6 text-xs text-secondary-foreground/60 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Careomat Ltd.</p><p>Thoughtful software. Clear evidence. Responsible delivery.</p></div>
    </footer>
  )
}

export function CTA({ title = "Make the next software decision a better one.", body = "Tell us what you are trying to change. We will help you clarify the problem, the evidence and a practical next step." }: { title?: string; body?: string }) {
  return <section className="bg-primary text-primary-foreground"><div className="page-shell flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between"><div className="flex max-w-2xl flex-col gap-4"><p className="eyebrow text-primary-foreground/75">Start with the problem</p><h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2><p className="max-w-xl leading-7 text-primary-foreground/80">{body}</p></div><Link href="/contact" className="inline-flex w-fit items-center gap-2 rounded-md bg-background px-5 py-3 font-semibold text-foreground hover:bg-background/90">Discuss your project <ArrowUpRight aria-hidden="true" /></Link></div></section>
}
