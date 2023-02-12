## Variables

## Deploying

`npm run build`
`git add .`
`git commit -m "deploy"`
`git subtree push --prefix dist origin gh-pages`

## TODO

- Focus on newly duplicated field
- Bulk duplicate/delete
- Detect duplicated ids
- Option to add/remove `{% comment %}` from variables
- Liquid variables with or without ".section" must be a global setting
- Scroll to bottom when clicking on "add" new section
- Scroll to section when clicking on "duplicate"
- Toggle open/close all editors

## Future

- Create "settings" store variable
  - Add prefix with option to include {type}
- Create tab to add section's schema settings
  - class
  - name
  - blocks
    - presets
    - max_blocks

## DONE

- Fix page height (should be 100vh)
- Variables order not working after duplicating [x]
- Copy updated code [x]
  - New ezfy schema must replace the imported code's schema [x]
- Copy JS [x]
- Copy CSS [x]
- Copy Liquid [x]
- Show popup when clicking on "clear" [x]
