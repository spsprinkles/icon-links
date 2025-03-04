import { LoadingDialog } from "dattatable";
import { Components, Helper, SPTypes } from "gd-sprest-bs";
import { DataSource, ILinkItem } from "./ds";

// Acceptable image file types
const ImageExtensions = [
    ".svg"
];

/**
 * Forms
 */
export class Forms {
    // Configures the form
    private static configureForm(props: Components.IListFormEditProps): Components.IListFormEditProps {
        // Set the control rendering event
        props.onControlRendering = (ctrl, fld) => {
            // See if this is a boolean field
            if (fld.FieldTypeKind == SPTypes.FieldType.Boolean) {
                // Set the option to display as a switch
                (ctrl as Components.IFormControlPropsCheckbox).type = Components.FormControlTypes.Switch;
            }
        }
        // Set the control rendered event
        props.onControlRendered = (ctrl, fld) => {
            // See if this is a url field
            if (fld.InternalName == "LinkIcon") {
                // Set a tooltip
                Components.Tooltip({
                    content: "Click to upload an SVG icon file",
                    placement: Components.TooltipPlacements.Left,
                    target: ctrl.textbox.elTextbox,
                    type: Components.TooltipTypes.LightBorder
                });

                // Make this textbox read-only
                ctrl.textbox.elTextbox.readOnly = true;

                // Set a click event
                ctrl.textbox.elTextbox.addEventListener("click", () => {
                    // Display a file upload dialog
                    Helper.ListForm.showFileDialog(ImageExtensions).then(file => {
                        // Clear the value
                        ctrl.textbox.setValue("");

                        // Get the file name
                        let fileName = file.name.toLowerCase();

                        // Validate the file type
                        if (this.isImageFile(fileName)) {
                            // Show a loading dialog
                            LoadingDialog.setHeader("Reading the file");
                            LoadingDialog.setBody("This will close after the file is converted...");
                            LoadingDialog.show();

                            // Convert the file
                            let reader = new FileReader();
                            reader.onloadend = () => {
                                // Set the value
                                ctrl.textbox.setValue(reader.result as string);

                                // Close the dialog
                                LoadingDialog.hide();
                            }
                            reader.readAsText(file.src);
                        } else {
                            // Display an error message
                            ctrl.updateValidation(ctrl.el, {
                                isValid: false,
                                invalidMessage: "The file uploaded must be a valid SVG image."
                            });
                        }
                    });
                });
            }
        }

        // Set the form rendered event to insert the clear link
        props.onFormRendered = (form) => {
            // Get the icon component
            let ctrl = form.getControl("LinkIcon");

            // Create a link to clear the icon
            let elClear = document.createElement("a");
            elClear.href = "#";
            elClear.innerHTML = "Click here to clear the icon";
            elClear.style.display = "block";
            elClear.addEventListener("click", () => {
                // Clear the textbox
                ctrl.textbox.setValue("");
            });
            ctrl.el.parentElement.insertBefore(elClear, ctrl.el.nextElementSibling);
        }

        // Return the properties
        return props;
    }

    // Displays the edit form
    static edit(itemId: number, ds: DataSource, onUpdate: () => void) {
        ds.LinksList.editForm({
            itemId,
            onCreateEditForm: props => { return this.configureForm(props); },
            onSetFooter: (el) => {
                let btn = el.querySelector("button") as HTMLButtonElement;
                if (btn) { btn.innerText = "Save" }
            },
            onSetHeader: (el) => {
                let h5 = el.querySelector("h5") as HTMLElement;
                if (h5) { h5.prepend("Edit: "); }
            },
            onUpdate: (item: ILinkItem) => {
                // Refresh the item
                ds.LinksList.refreshItem(item.Id).then(() => {
                    // Call the update event
                    onUpdate();
                });
            }
        });
    }

    // Determines if the image extension is valid
    private static isImageFile(fileName: string): boolean {
        let isValid = false;

        // Parse the valid file extensions
        for (let i = 0; i < ImageExtensions.length; i++) {
            // See if this is a valid file extension
            if (fileName.endsWith(ImageExtensions[i])) {
                // Set the flag and break from the loop
                isValid = true;
                break;
            }
        }

        // Return the flag
        return isValid;
    }

    // Displays the new form
    static new(ds: DataSource, onUpdate: () => void) {
        ds.LinksList.newForm({
            onCreateEditForm: props => { return this.configureForm(props); },
            onSetHeader: (el) => {
                let h5 = el.querySelector("h5") as HTMLElement;
                if (h5) { h5.innerText = "New Icon Link"; }
            },
            onUpdate: (item: ILinkItem) => {
                // Refresh the data
                ds.LinksList.refreshItem(item.Id).then(() => {
                    // Call the update event
                    onUpdate();
                });
            }
        });
    }

    // Displays the view form
    static view(item: ILinkItem, ds: DataSource) {
        ds.LinksList.viewForm({
            itemId: item.Id,
            onCreateViewForm: props => {
                // Customize the screenshots to display the image
                props.onControlRendered = (ctrl, fld) => {
                    // See if this is a url field
                    if (fld.InternalName == "LinkIcon") {
                        // Clear the element
                        while (ctrl.el.firstChild) { ctrl.el.removeChild(ctrl.el.firstChild); }

                        // Ensure a value exists
                        if (item[fld.InternalName]) {
                            // Read the icon
                            let elIcon = document.createElement("div");
                            elIcon.innerHTML = item[fld.InternalName];

                            // Ensure a svg icon exists
                            let svgIcon = elIcon.querySelector("svg");
                            if (svgIcon) {
                                // Add icon datatable class
                                svgIcon.classList.add("icon-dt");
                                // Clear the container color
                                svgIcon.removeAttribute("fill");
                                // Clear the height
                                svgIcon.removeAttribute("height");
                                // Clear the width
                                svgIcon.removeAttribute("width");
                                // Get the path elements
                                svgIcon.querySelectorAll("path").forEach(el => {
                                    // Clear the color
                                    el.removeAttribute("fill");
                                });
                            }
                            ctrl.el.appendChild(elIcon);
                        }
                    }
                }

                // Return the properties
                return props;
            }
        });
    }
}