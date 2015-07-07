# iptools-jquery-modal [![Build Status](http://img.shields.io/travis/interactive-pioneers/iptools-jquery-modal.svg)](https://travis-ci.org/interactive-pioneers/iptools-jquery-modal)

Simple jQuery Modal

## Features
Display static and ajax-loaded content inside an overlay, fully stylable with CSS, using CSS3 tranisitions and animations. Modal closes on keydown ESC and click outside.

## Requirements

- jQuery 1.11.3 or greater

## Example

```html
<h2>Open DOM-Element</h2>
<a class="js_trigger-modal" data-modal-content="#test" data-modal-effect="scale">trigger modal</a>
<div id="test" style="display: none;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>

<h2>Load content with AJAX</h2>
<a class="js_trigger-modal" data-modal-content="/pagecontroller/buttons" data-modal-effect="scale">trigger modal</a>

<link rel="stylesheet" href="dist/iptools-jquery-modal.css" type="text/css">
<script src="src/iptools-jquery-modal.js"></script>
<script type="text/javascript">
   $(document).ready(function() {
      $('.js_trigger-modal').iptModal({
         // options
      });
   });
</script>

```

## CSS3-Effects

- scale - slideinbottom - slideinright

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
