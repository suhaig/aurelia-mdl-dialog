import MdlDialogService from 'aurelia-mdl-dialog';
import {InnerDialog} from 'app/all-in-one/inner-dialog/inner-dialog';

export class DialogCustomElement {

    static inject() {
        return [MdlDialogService, Promise];
    }

    constructor(mdlDialogService, controllerPromise) {
        this._mdlDialogService = mdlDialogService;
        this._controllerPromise = controllerPromise;
        this.title = "Dialog title";
    }

    activate(model) {
        this.title = model.title;
    }

    openInnerDialog() {
        this._mdlDialogService.open({viewModel: InnerDialog, cssClass: 'inner-dialog'})
            .then(dialogResult => {
                // TODO:
            })
            .catch(reason => {
                // TODO:
            });
    }

    close() {
        this._controllerPromise
            .then(controller => {
                controller.close('dialog1 result');
            });
    }
}