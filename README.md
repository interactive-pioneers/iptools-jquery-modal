# iptools-jquery-modal [![Build Status](http://img.shields.io/travis/interactive-pioneers/iptools-jquery-modal.svg)](https://travis-ci.org/interactive-pioneers/iptools-jquery-modal)

Simple jQuery Modal

## Features
Display static and ajax-loaded content inside an overlay, fully stylable with CSS, using CSS3 tranisitions and animations. Modal closes on keydown ESC and click outside.

## Requirements

- jQuery (version TBD)

## Example

```html
<h2>simple HTML content</h2>
<a class="js_trigger-modal" data-modal-content="#test" data-modal-effect="scale">trigger modal</a>
<div id="test" style="display: none;">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</div>

<h2>content via ajax</h2>
<a class="js_trigger-modal" data-modal-content="/pagecontroller/buttons" data-modal-effect="scale">trigger modal</a>

<script src="src/iptools-jquery-modal.js"></script>
<script type="text/javascript">
   $(document).ready(function() {
      $('.js_trigger-modal').iptoolsModal({
         // options
      });
   });
</script>

```

```scss
$timing-function: ease-in-out;
$animation-speed: 0.25s;

.modal {
  z-index: 102;

  display: none;
  max-width: 90%;
  max-height: 90%;
  padding: 45px;
  border: 1px solid $black;
  overflow: auto;

  background: $white;
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.8);
  opacity: 0;
  transition: opacity $animation-speed $timing-function, transform $animation-speed $timing-function;

  &--active {
    display: block;
    
    opacity: 1;
  }

  &__button-close {
    position: absolute;
    top: 15px;
    right: 15px;

    display: block;
    width: 17px;
    height: 17px;

    cursor: pointer;

    &:before, &:after {
      position: absolute;
      left: 8px;
      content: '';
      height: 17px;
      width: 1px;
      background-color: $black;
    }

    &:before {
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }
  }

  &__spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 101;

    display: none;
    width: 64px;
    height: 64px;
    margin-right: -32px;
    margin-top: -32px;

    background-color: $black; 
  }

}

.modal--effect-scale {
  transform: scale(0.7);
  opacity: 0;
}

.modal--active.modal--effect-scale {
  transform: scale(1);
  opacity: 1;
}

.modal--effect-slideinright {
  transform: translateX(20%);
  opacity: 0;
}

.modal--active.modal--effect-slideinright {
  transform: translateX(0);
  opacity: 1;
}

.modal--effect-slideinbottom {
  transform: translateY(20%);
  opacity: 0;
}

.modal--active.modal--effect-slideinbottom {
  transform: translateY(0);
  opacity: 1;
}

```

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