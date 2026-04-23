# Design: Graphic Design Section

## Visual Structure

- Grid gallery for each category
- Project cards with hover preview
- Dedicated detail page for each project (not modal)
- Lightbox for images
- All-projects view: grouped by year, with filters and search

## Key Components

- GalleryGrid: shows projects per category
- ProjectCard: visual summary for each project
- ProjectDetail: full page with images and details
- FiltersBar: for year, client, type (multi-select)
- SearchBox: for title, client, description
- Lightbox: for image enlargement

## Navigation

- Main menu: "Graphic Design"
- `/graphic-design/{category}/` for galleries
- `/graphic-design/{category}/{id}` for details
- `/graphic-design/all` for all projects

## Accessibility

- Keyboard navigation
- Alt text for images
- Sufficient color contrast

## Visual Inspiration

- Behance, Dribbble, top designer portfolios

---
