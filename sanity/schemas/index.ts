import { postSchema } from "./post";
import { categorySchema } from "./category";
import { authorSchema } from "./author";
import { seoSchema } from "./seo";
import { projectSchema } from "./project";
import { stlTableBlock } from "./stlTableBlock";
import { contactSubmissionSchema } from "./contactSubmission";

export const schemaTypes = [
  postSchema,
  categorySchema,
  authorSchema,
  seoSchema,
  projectSchema,
  stlTableBlock,
  contactSubmissionSchema,
];

export { postSchema, categorySchema, authorSchema, seoSchema, projectSchema, stlTableBlock, contactSubmissionSchema };
