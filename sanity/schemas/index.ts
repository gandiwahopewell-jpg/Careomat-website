import { postSchema } from "./post";
import { categorySchema } from "./category";
import { authorSchema } from "./author";
import { seoSchema } from "./seo";
import { projectSchema } from "./project";
import { stlTableBlock } from "./stlTableBlock";

export const schemaTypes = [
  postSchema,
  categorySchema,
  authorSchema,
  seoSchema,
  projectSchema,
  stlTableBlock,
];

export { postSchema, categorySchema, authorSchema, seoSchema, projectSchema, stlTableBlock };
