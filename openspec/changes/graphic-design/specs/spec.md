# Specification: Graphic Design Section

## Functional Requirements

- Gallery for each category: logotypes, stationery, posters, multimedia, illustration, packaging, others
- Each category is a separate JSON file (e.g., branding.json, stationery.json, etc.)
- Each entry includes:
  - id (with category prefix, e.g., branding-001)
  - title
  - date (month and year)
  - client
  - description
  - type
  - links (array)
  - visible (boolean)
- Detail page for each project (not modal): `/graphic-design/branding/:id`
- Gallery page for each category: `/graphic-design/branding/`
- All-projects view: `/graphic-design/all` (shows all projects, grouped by year)
- Sorting by date (asc/desc) within each category
- Filtering in "all" view by year, client (dropdown), type (multi-select), and search box (title, client, description)
- Lightbox for viewing images in large size
- Responsive and accessible

## Visual Requirements

- Consistent with portfolio style
- Optimized, high-quality images
- Brand-aligned typography and colors

## Data Structure Example

```json
{
  "id": "branding-001",
  "title": "Proyecto Ejemplo",
  "date": "2024-03",
  "client": "Cliente S.A.",
  "description": "Descripción del proyecto...",
  "type": "logotipo",
  "links": ["https://..."],
  "visible": true,
  "images": ["branding-001-1.jpg", "branding-001-2.jpg"]
}
```

## Navigation

- Main menu link: "Graphic Design"
- Category galleries: `/graphic-design/{category}/`
- Project detail: `/graphic-design/{category}/{id}`
- All projects: `/graphic-design/all`

## Edge Cases

- Projects with multiple types (store as array in `type`)
- Projects without long description
- Projects not visible (visible: false)

---
