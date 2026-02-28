# FM-Lead Post Image Workflow

## 1) Post structure (now enabled)
Each post is a Hugo **leaf bundle**:

- `content/muser/reviews/my-post/index.md`
- `content/focus/articles/my-post/index.md`

Put post images in the same folder, ideally in `images/`:

- `content/muser/reviews/my-post/images/hero.jpg`
- `content/muser/reviews/my-post/images/detail-1.jpg`

## 2) Feature image (cards/list views)
In front matter, set only the filename (or `images/<file>`):

```yaml
featureimage: "hero.jpg"
# or
featureimage: "images/hero.jpg"
```

If `featureimage` is omitted, FM-Lead auto-picks the first matching image named like:

- `feature*`
- `cover*`
- `thumbnail*`

## 3) Review side-panel images
Use filenames for `reviewPanelImages`:

```yaml
reviewPanelImages:
  - src: "detail-1.jpg"
    alt: "Front angle"
  - src: "images/detail-2.jpg"
    alt: "Back angle"
```

## 4) In-article markdown images
Use local paths from the post folder:

```md
![Alt text](images/detail-1.jpg)
```

## 5) Swap images quickly
- Drop new image file into the post folder.
- Change only filename(s) in front matter / markdown.
- Rebuild site.

## 6) Web optimization
Images from post bundles are automatically optimized at render time in templates:

- Muser card images resized for cards.
- Review panel images resized for panel display.
- Markdown images already use Blowfish responsive image rendering.
