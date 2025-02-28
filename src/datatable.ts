import { Dashboard, Modal } from "dattatable";
import { Components } from "gd-sprest-bs";
import { infoSquare } from "gd-sprest-bs/build/icons/svgs/infoSquare";
import { pencilSquare } from "gd-sprest-bs/build/icons/svgs/pencilSquare";
import { plusSquare } from "gd-sprest-bs/build/icons/svgs/plusSquare";
import * as jQuery from "jquery";
import { DataSource, ILinkItem } from "./ds";
import { Forms } from "./forms";
import { Security } from "./security";
import Strings from "./strings";

/**
 * Datatable
 */
export class Datatable {
    private _dashboard: Dashboard = null;
    private _ds: DataSource = null;
    private _el: HTMLElement;
    private _onUpdate: () => void = null;

    // Constructor
    constructor(ds: DataSource, onUpdate: () => void) {
        // Save the properties
        this._ds = ds;
        this._onUpdate = onUpdate;

        // Render the datatable
        this.render();
    }

    // Renders the datatable
    private render() {
        // Clear the modal
        Modal.clear();

        // Set the size
        Modal.setType(Components.ModalTypes.Full);

        // Render the dashboard
        this.renderDashboard();

        // Hide the footer
        Modal.FooterElement.classList.add("d-none");
    }

    // Renders the dashboard
    private renderDashboard() {
        // See if it exists
        if (this._dashboard) {
            // Update the modal body
            Modal.BodyElement.appendChild(this._el);
            return;
        }

        // Create the element
        this._el = document.createElement("div");

        // Render the dashboard
        this._dashboard = new Dashboard({
            el: this._el,
            hideHeader: true,
            useModal: false,
            navigation: {
                searchPlaceholder: "Find an Icon",
                showFilter: false,
                onRendering: props => {
                    // Set the class names
                    props.className = "bg-sharepoint navbar-expand rounded";

                    // Set the brand
                    let brand = document.createElement("div");
                    brand.className = "align-items-center d-flex";
                    brand.appendChild(infoSquare());
                    brand.append(Strings.ProjectName);
                    brand.querySelector("svg").classList.add("me-75");
                    props.brand = brand;
                },
                // Adjust the brand alignment
                onRendered: (el) => {
                    el.querySelector("nav div.container-fluid").classList.add("ps-3");
                    el.querySelector("nav div.container-fluid .navbar-brand").classList.add("pe-none");
                    el.querySelectorAll(".mb-2, .mb-lg-0").forEach(el => {
                        el.classList.remove("mb-2");
                        el.classList.remove("mb-lg-0");
                    });
                },
                itemsEnd: [
                    {
                        text: "List Security",
                        isButton: true,
                        onClick: () => {
                            // Show the security modal
                            new Security(() => {
                                // Refresh the page
                                window.location.reload();
                            });
                        }
                    },
                    {
                        text: "Add a new icon link",
                        onRender: (el, item) => {
                            // Clear the existing button
                            while (el.firstChild) { el.removeChild(el.firstChild); }

                            // Create a span to wrap the icon in
                            let span = document.createElement("span");
                            span.className = "bg-white d-inline-flex me-2 rounded";
                            el.appendChild(span);

                            // Render a tooltip
                            let btn = Components.Tooltip({
                                el: span,
                                content: item.text,
                                placement: Components.TooltipPlacements.Left,
                                type: Components.TooltipTypes.LightBorder,
                                btnProps: {
                                    // Render the icon button
                                    className: "align-items-center d-flex mw-0 p-1 pe-2",
                                    iconClassName: "me-1",
                                    iconType: plusSquare,
                                    iconSize: 24,
                                    isSmall: true,
                                    text: "New",
                                    type: Components.ButtonTypes.Light,
                                    onClick: () => {
                                        // Show the new form
                                        Forms.new(this._ds, () => {
                                            // Refresh the dashboard
                                            this._dashboard.refresh(this._ds.LinksList.Items);

                                            // Call the update event
                                            this._onUpdate();
                                        });
                                    }
                                },
                            });
                            btn.el.classList.remove("btn-icon");
                        }
                    }
                ]
            },
            footer: {
                itemsEnd: [
                    {
                        className: "pe-none text-dark",
                        text: "v" + Strings.Version,
                    }
                ]
            },
            table: {
                rows: this._ds.LinksList.Items,
                onRendering: dtProps => {
                    // Set the column defs
                    dtProps.columnDefs = [
                        {
                            "targets": [0, 6],
                            "orderable": false,
                            "searchable": false
                        }
                    ];

                    // Set the order
                    dtProps.order = [[1, "asc"]];

                    // Return the properties
                    return dtProps;
                },
                columns: [
                    {
                        name: "LinkIcon",
                        title: "Icon",
                        onRenderCell: (el, col, item: ILinkItem) => {
                            let svgIcon = el.querySelector("svg");
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
                        }
                    },
                    {
                        name: "LinkOrder",
                        title: "Order"
                    },
                    {
                        name: "Title",
                        title: "Title"
                    },
                    {
                        name: "LinkTooltip",
                        title: "Tooltip"
                    },
                    {
                        name: "LinkUrl",
                        title: "URL"
                    },
                    {
                        name: "OpenInNewTab",
                        title: "Open In New Tab?",
                        onRenderHeader: (el) => {
                            el.classList.add("text-nowrap");
                        },
                        onRenderCell: (el, col, item: ILinkItem) => {
                            el.innerHTML = item.OpenInNewTab ? "Yes" : "No";
                        }
                    },
                    {
                        className: "text-end",
                        isHidden: true,
                        name: "Edit",
                        onRenderCell: (el, col, item: ILinkItem) => {
                            // Create a span to wrap the icons in
                            let span = document.createElement("span");
                            span.className = "bg-white d-inline-flex ms-2 rounded text-nowrap";
                            el.appendChild(span);

                            // Render a tooltip
                            let btn = Components.Tooltip({
                                el: span,
                                content: col.name + " icon link",
                                placement: Components.TooltipPlacements.Left,
                                type: Components.TooltipTypes.LightBorder,
                                btnProps: {
                                    // Render the icon button
                                    className: "align-items-center d-flex mw-0 p-1",
                                    iconClassName: "me-1",
                                    iconType: pencilSquare,
                                    iconSize: 24,
                                    isSmall: true,
                                    text: col.name,
                                    type: Components.ButtonTypes.OutlineSecondary,
                                    onClick: () => {
                                        // Show the edit form
                                        Forms.edit(item.Id, this._ds, () => {
                                            // Refresh the dashboard
                                            this._dashboard.refresh(this._ds.LinksList.Items);

                                            // Call the update event
                                            this._onUpdate();
                                        });
                                    }
                                }
                            });
                            btn.el.classList.remove("btn-icon");
                        }
                    }
                ]
            }
        });

        // Update the modal body
        Modal.BodyElement.appendChild(this._el);
    }

    // Shows the datatable
    show() {
        // Render the datatable
        this.render();

        // Show the datatable
        Modal.show();
    }
}