import type { MetadataRoute } from "next"
import { articles, projects } from "@/lib/content"

export default function sitemap(): MetadataRoute.Sitemap { const base="https://www.careomat.co.uk"; const routes=["","/services","/work","/resources","/about","/contact"].map((route)=>({url:`${base}${route}`,lastModified:new Date(),changeFrequency:route===""?"weekly" as const:"monthly" as const,priority:route===""?1:0.8})); const work=projects.map(({slug})=>({url:`${base}/work/${slug}`,lastModified:new Date(),changeFrequency:"monthly" as const,priority:0.7})); const resources=articles.map(({slug,date})=>({url:`${base}/resources/${slug}`,lastModified:new Date(date),changeFrequency:"monthly" as const,priority:0.7})); return [...routes,...work,...resources] }
