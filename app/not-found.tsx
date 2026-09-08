import Link from "next/link"

export default function NotFound(){ return <section><div className="page-shell flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-6"><p className="eyebrow">404 / Not found</p><h1 className="text-balance text-4xl font-semibold tracking-tight">This page is not part of the plan.</h1><p className="leading-7 text-muted-foreground">The address may have changed, or the resource may no longer be available.</p><Link href="/" className="rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground">Return home</Link></div></section> }
