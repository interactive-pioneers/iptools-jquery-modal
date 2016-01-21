# iptools-jquery-modal [![Build Status](http://img.shields.io/travis/interactive-pioneers/iptools-jquery-modal.svg)](https://travis-ci.org/interactive-pioneers/iptools-jquery-modal) [![Bower version](https://badge.fury.io/bo/iptools-jquery-modal.svg)](http://badge.fury.io/bo/iptools-jquery-modal)

Multifunctional jQuery modal component.

## Features

- Display content inside modal overlay from:
  - static container in DOM by ID
  - AJAX endpoint that delivers markup
  - Rails UJS-driven AJAX that delivers a partial
- CSS3 transitions and animations
- Exit by:
  - `ESC` key
  - Click outside the modal

## Options

See inline comments in [Example](#example). All options are optional.

## Requirements

Component is maintained for both, jQuery 1 and 2:

- `jQuery >=2.1.4` for modal version `>=1.0.0` (master branch)
- `jQuery >=1.11.3 < 2.0.0` for modal version `<1.0.0` (jquery1 branch)

## Example

```html
<h2>Content from DOM-Element</h2>
<a href="#container-id" class="js_trigger-modal" data-modal-effect="scale">trigger modal</a>
<div id="container-id" style="display: none;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>

<h2>Content from AJAX endpoint</h2>
<a href="/ajax/modal" class="js_trigger-modal" data-modal-effect="scale">trigger modal</a>

<h2>Content from Rails UJS AJAX endpoint</h2>
<a href="/ajax/modal" class="js_trigger-modal" data-modal-effect="scale" data-remote="true">trigger modal</a>

<link rel="stylesheet" href="dist/iptools-jquery-modal.css" type="text/css">
<script src="src/iptools-jquery-modal.js"></script>
<script type="text/javascript">
  $(document).ready(function() {
    $('.js_trigger-modal').iptModal({
      animationDuration: 500, // Animation duration in ms
      closeOnESC: true, // Modal closed on ESC key
      closeOnClickOutside: true, // Modal closed if clicked outside / on overlay
      closeButton: true, // Add close button to modal
      height: 'auto', // Modal height
      modalClass: 'modal', // CSS class for modal styling
      modalId: 'modal', // ID assigned to modal
      modalVAlignTopClass: 'modal--vertical-align-top', // CSS rules setting vertical alignment of the modal
      modalVAlignCenterClass: 'modal--vertical-align-center', // CSS rules setting vertical alignment of the modal
      modifiers: '', // Modifier classes e.g. modal--no-padding
      overlayClass: 'overlay'
      showSpinner: true, // Enable/disable loader animation
      spinnerHTML: '', // Loader HTML
      width: '80%', // Modal width
      zIndex: 102 // CSS z-index
    });
  });
</script>

```

## CSS3-Effects

- scale
- slideinbottom
- slideinright

## Contributions

### Bug reports, suggestions

- File all your issues, feature requests [here](https://github.com/interactive-pioneers/iptools-jquery-modal/issues)
- If filing a bug report, follow the convention of _Steps to reproduce_ / _What happens?_ / _What should happen?_
- __If you're a developer, write a failing test instead of a bug report__ and send a Pull Request

### Code

1. Fork it ( https://github.com/[my-github-username]/iptools-jquery-modal/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Develop your feature by concepts of [TDD](http://en.wikipedia.org/wiki/Test-driven_development), see [Tips](#tips)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

### Tips

Following tasks are there to help with development:

- `grunt watch:bdd` listens to tests and source, reruns tests
- `grunt qa` run QA task that includes tests and JSHint
- `grunt build` minify source to dist/

## Licence
Copyright © 2015 Interactive Pioneers GmbH. Licenced under [GPLv3](LICENSE).
