# aurelia-mdl-dialog
Aurelia wrapper for Material Design Lite's [Dialog](https://getmdl.io/components/#dialog-section) component.

It can be used to:

* show a modal or non-modal dialog (the dialog is notified via `Promise` when it is shown)
* pass values to the dialog
* return a [string](https://html.spec.whatwg.org/multipage/forms.html#the-dialog-element) value from the dialog
* close the dialog (the caller is notified via `Promise` when the dialog is closed)


## <a name="live-demo"></a>Live demo
It demonstrates showing a dialog from another one, passing values to and returning values from a dialog, positioning
a dialog.

The live demo is [here](https://suhaig.github.io/aurelia-mdl-dialog/).

## Install

```bash
npm install aurelia-mdl-dialog --save
```

### Dependencies

The *Aurelia Framework* and [*Google's Dialog Polyfill*](https://github.com/GoogleChrome/dialog-polyfill) for browsers 
without native `<dialog>` support.

## Usage

This component exports the [`MdlDialogService`](#mdl-dialog-service) object which can be used to programmatically show 
a modal or non-modal dialog. The ViewModel of the dialog must be passed to the `show` method of the 
[`MdlDialogService`](#mdl-dialog-service) object. When the dialog is shown it receives a 
[`DialogController`](#dialog-controller) object which can be used to close the dialog and return a value. 
The `show` method returns a `Promise` which is fulfilled when the dialog is closed, the fulfillment value is the return
value of the dialog or an empty string if the dialog was canceled.

### Example

In this example a dialog with a text input field is shown. The initial value of the input field is passed to the
dialog and the value entered into the input field is returned to the caller.

For a more complex example please check the [live demo](#live-demo).

#### <a name="dialog-viewmodel"></a>Dialog ViewModel

A plain Aurelia ViewModel class. The `activate` method handles the initial value of the input field. 
The injected `Promise` is fulfilled when the dialog is shown. The fulfillment value of the `Promise`
is a [`DialogController`](#dialog-controller) object, which can be used to close the dialog and return a value. 

```javascript
export class Dialog {

    static inject() {
        return [Promise];
    }

    constructor(dialogControllerPromise) {
        this._dialogControllerPromise = dialogControllerPromise;
    }

    activate(model) {
        this.text = model.text;
    }

    close() {
        this._dialogControllerPromise
            .then(dialogController => {
                dialogController.close(this.text);
            });
    }
}
```

#### Dialog template

```html
<template>
    <h4 class="mdl-dialog__title">Dialog</h4>
    <div class="mdl-dialog__content">
        <p>Add some text. The text will be returned to the caller.</p>
        <div mdl="textfield" class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="text" value.bind="text">
            <label class="mdl-textfield__label" for="text">Some text</label>
        </div>
    </div>
    <div class="mdl-dialog__actions">
        <button type="button" class="mdl-button mdl-button--colored" click.delegate="close()">Close</button>
    </div>
</template>
```

#### Showing the dialog

The [`MdlDialogService`](#mdl-dialog-service) object's `show` method is used to actually show the dialog. The `show` 
method returns a `Promise` which will be fulfilled when the dialog is closed. The fulfillment value of this `Promise`
is the return value of the dialog or an empty string if the dialog was canceled.

```javascript
import MdlDialogService from 'aurelia-mdl-dialog';
import {Dialog} from './dialog/dialog';

export class App {

    static inject() {
        return [MdlDialogService];
    }

    constructor(mdlDialogService) {
        this._mdlDialogService = mdlDialogService;
        this.textFromDialog = '';
    }

    showDialog() {
         this._mdlDialogService.show({
                    viewModel: Dialog,
                    model: {
                        text: this.textFromDialog
                    }
                })
                .then(text => {
                    if (text==='') { // dialog was canceled
                        return;
                    }
                    this.textFromDialog = text;
                });
    }
}
```

#### Closing the dialog

The dialog cannot be closed from the caller, only from the dialog itself. As shown [earlier](#dialog-viewmodel) 
a [`DialogController`](#dialog-controller) object is available in the dialog and this object can be used to close the 
dialog and return a value. 

#### <a name="canceling-the-dialog"></a>Canceling the dialog

By specification browsers may provide a user interface to [cancel](https://html.spec.whatwg.org/multipage/forms.html#canceling-dialogs)
the dialog. If the dialog is canceled the return value will be an empty string (actually the browser will not set a
return value, so it remains the default empty string).

## API

### <a name="mdl-dialog-service"></a>MdlDialogService

The `MdlDialogService` is responsible for showing the dialog, providing the `DialogController` and handling the return
value. The `MdlDialogService` is exported by this component.

#### `show`

Shows a dialog and returns a `Promise` which is fulfilled when the dialog is closed. The fulfillment value is the 
return value of the dialog or an empty string if the dialog was canceled.

The parameter of the `show` method is a configuration object with the following keys:

##### `viewModel`

The ViewModel class of the dialog. Must be a string or a function. Mandatory parameter.

##### `nonModal`

When set to `true` the dialog will be non-modal. Optional parameter, the default value is `false`, which means 
the dialog will be modal by default.

##### `model`

The model object of the dialog. Can be used to pass values to the dialog. The `activate` method of the dialog's 
ViewModel class will be called with this object. Optional parameter.

##### `cssClass`

The CSS class that will be assigned to the `<dialog>` HTML tag. Optional parameter.

```javascript
 this._mdlDialogService.show({
            viewModel: Dialog,
            nonModal: true,
            model: {
                text: this.textFromDialog
            },
            cssClass: 'myDialog'
        })
        .then(text => {
            this.textFromDialog = text;
        });
```

### <a name="dialog-controller"></a>DialogController

The `DialogController` is responsible for closing the dialog and returning a value. It is obtained through a `Promise` 
which is injected automatically into the Dialog's ViewModel class. The `Promise` is fulfilled when the dialog is shown 
and the fulfillment value is the `DialogController` object.

#### `close`

Closes the dialog and optionally returns a [string](https://html.spec.whatwg.org/multipage/forms.html#the-dialog-element) 
value as the return value of the dialog. **Returning an empty string is ambigous, because empty string is also the 
representation of dialog [cancelation](#canceling-the-dialog).** 

```javascript
dialogController.close('returnValue');
```

## Testing

Unfortunately there are no automated tests. It's a shame, try to fix in the near future.

### Browsers

Manually tested on **Chrome 55** (native `<dialog>` support) and **Firefox 50** (`<dialog>` support with polyfill).

## License

[MIT](LICENSE)
