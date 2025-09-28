---
name: floatPage
tags: early-stage, feedback-wanted
description: Handles floats that are positioned at the top or bottom of pages.
---


# Float page elements (paged.js)

This plugin handles floats that are positioned at the top or bottom of pages.
This feature has traditionally been used in print publications in which figures and photos are moved to the top or bottom of columns or pages, along with their captions.

You need to use [csstree.js](https://github.com/csstree/csstree) in order to transform custom properties. 
If you use CSS Page Weaver is inclued by default


## How to install

**With CSS Page Weaver**

Register the `floatPage` plugin in your `manifest.json`:

```json
[
    "floatPage",
    // other plugins

]

```


**Without CSS Page Weaver**

Include both csstree and the fullPage script in your HTML `<head>`:

```html
<script src="js/csstree.min.js"></script>
<script type="module" src="path/to/fullPage/floatPage.js"></script>
```

Don’t forget to update the path to the paged.esm.js module in the import statement before using the script.

```js
import { Handler } from '/path/to/paged.esm.js'
```

## How to use it

In the CSS, add the following custom property to the elements (using IDs or classes) that you want to float to the top or bottom of pages:

```css
elem{
    --pagedjs-float-page: top;
}
```

- `--pagedjs-float-page: top` → The element will be placed at the top of the current page.
- `--pagedjs-float-page: bottom` → The element will be placed at the bottom of the current page.
- `--pagedjs-float-page: next-page` → The element will be placed at the top of the next page.

Notes:
- this script works on any elements, even if the element contains several child elements;
- the element will be reinserted into its original parent if that parent still exists on the page.


## Credits

- [pagedjs.org](https://www.pagedjs.org/)
- [csstree.js](https://github.com/csstree/csstree)

MIT licence, Julie Blanc, 2025


