## Variables

## Deploying

`npm run build`
`git add .`
`git commit -m "deploy"`
`git subtree push --prefix dist origin gh-pages`

## TODO

- ***

- Trigger error when range step is not number
- Trigger error when color "default" is not hex
- Add collection list
- Inject CSS selector in "range" (helpful for font sizes)

- detect duplicated ids

---

- Copy product before/after currently active (hovered) item
- can't add negative number to "select" min field
- bulk delete
- Detect duplicated ids
- Option to add/remove `{% comment %}` from variables
- Liquid variables with or without ".section" must be a global setting
- Scroll to bottom when clicking on "add" new section
- Scroll to section when clicking on "duplicate"
- Toggle open/close all editors
- "range" unit is blank

## Future

- Create "settings" store variable
  - Add prefix with option to include {type}
- Create tab to edit section's schema settings
  - class
  - name
  - blocks
    - presets
    - max_blocks

## DONE

- Bulk duplicate [x]
- Focus on newly duplicated field [x]
- "range" default is not working [x]
- Fix page height (should be 100vh)
- Variables order not working after duplicating [x]
- Copy updated code [x]
  - New ezfy schema must replace the imported code's schema [x]
- Copy JS [x]
- Copy CSS [x]
- Copy Liquid [x]
- Show popup when clicking on "clear" [x]

## Usage

1. The parent div must have the data attribute "data-ezfy-editable" to be editable.
2. HTML elements must have the data attribute "data-ezfy-injected-variable='.element'". This happens automatically when a liquid variable is injected and will be editable next time the user makes changes to it.
