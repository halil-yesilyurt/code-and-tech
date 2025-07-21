# [FEATURE] Accessibility Features (#11)

## Summary
This document outlines the plan and checklist for implementing accessibility (a11y) improvements in the Code & Tech project.

## Goals
- Ensure the website is usable by everyone, including people using assistive technologies.
- Meet WCAG 2.1 AA standards where possible.

## Planned Improvements

- [ ] Ensure all interactive elements (buttons, links, custom controls) are keyboard accessible
- [ ] Add or improve ARIA labels and roles for custom components
- [ ] Use semantic HTML elements for structure and navigation
- [ ] Ensure sufficient color contrast for text and UI elements
- [ ] Provide visible focus indicators for all focusable elements
- [ ] Add meaningful `alt` text to all images; use `alt=""` for decorative images
- [ ] Add a "Skip to main content" link for keyboard users
- [ ] Ensure all form fields have associated `<label>` elements
- [ ] Use `aria-live` regions for dynamic content updates (e.g., search suggestions, notifications)
- [ ] Review and improve accessibility of navigation, breadcrumbs, and sidebar
- [ ] Test with keyboard and screen reader (NVDA, VoiceOver, etc.)

## How to Test
- Navigate the site using only the keyboard (Tab, Shift+Tab, Enter, Space, Esc)
- Use a screen reader to verify all content and controls are announced correctly
- Check color contrast using [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Use browser accessibility tools (Lighthouse, axe, etc.)

## Related Files
- `src/app/components/`
- `src/app/layout.tsx`, `src/app/components/Layout.tsx`, `src/app/components/Header.tsx`, etc.

---

**Related Issue:** [#11](https://github.com/your-repo/issues/11) 