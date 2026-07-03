export const projectsQuery = `*[_type == "project"] | order(sortOrder asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  mainImage,
  description,
  sortOrder
}`
