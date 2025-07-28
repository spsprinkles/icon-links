import { Components, ContextInfo, Helper, SPTypes, ThemeManager } from "gd-sprest-bs";
import { infoSquare } from "gd-sprest-bs/build/icons/svgs/infoSquare";
import { Datatable } from "./datatable";
import { DataSource } from "./ds";
import { Link } from "./link";
import { Log } from "./log";
import Strings from "./strings";

/**
 * Main Application
 */
export class App {
    private _ds: DataSource = null;
    private _dt: Datatable = null;
    private _el: HTMLElement = null;

    // Constructor
    constructor(el: HTMLElement, ds: DataSource) {
        // Save the properties
        this._ds = ds;
        this._el = el;

        // Set the class name
        this._el.classList.add("icon-links");
    }

    // Returns true if the page is in edit mode
    private isInEditMode(displayMode: number) {
        // See if the display mode is set
        if (typeof (displayMode) === "number") {
            // See if the page is being edited
            return displayMode == SPTypes.DisplayMode.Edit;
        } else {
            // See if this classic page is in edit mode
            return Helper.WebPart.isEditMode();
        }
    }

    // Refreshes the application
    refresh(displayMode: number, layout: string, justify: string, invertColors: boolean) {
        // Render the component
        this.render(displayMode, layout, justify, invertColors);
    }

    // Renders the component
    render(displayMode: number, layout: string, justify: string, invertColors: boolean) {
        // Log
        Log.Information("Loading the data for this application.");

        // Clear the element
        while (this._el.firstChild) { this._el.removeChild(this._el.firstChild); }

        // Create the datatable if it doesn't exist
        this._dt = this._dt || new Datatable(this._ds, () => {
            // Log
            Log.Information("Data loaded for the application.");

            // Render the component
            this.render(displayMode, layout, justify, invertColors);
        });

        // See if we are editing the page & in classic mode
        if (this.isInEditMode(displayMode) && (Strings.IsClassic)) {
            // Log
            Log.Information("Page in edit mode or is a classic page type.");

            // Render the edit button
            this.renderEdit();
        }

        // Ensure links exist
        if (this._ds.LinksList.Items.length > 0) {
            // Log
            Log.Information(`${this._ds.LinksList.Items.length} items returned from the query.`);

            // Create the main element
            let elWP = document.createElement("div");
            elWP.classList.add("d-flex");
            elWP.classList.add("flex-wrap");
            justify ? elWP.classList.add(justify) : null;
            elWP.classList.add("row");
            this._el.appendChild(elWP);

            // Render the dashboard
            this.renderIcons(elWP, layout, invertColors);

            // Update the theme
            this.updateTheme(null, invertColors);
        } else {
            // See if we are not in classic mode
            if (!Strings.IsClassic) {
                // Render the edit button
                this.renderEdit();
            }
        }
    }

    // Renders the icons
    private renderIcons(el: HTMLElement, layout: string, invertColors: boolean) {
        // Parse the links
        for (let i = 0; i < this._ds.LinksList.Items.length; i++) {
            // Render the link
            new Link(el, this._ds.LinksList.Items[i], layout, invertColors);
        }
    }

    // Render the edit information
    private renderEdit() {
        // Render a button to Edit Icon Links
        let btn = Components.Button({
            el: this._el,
            className: "ms-1 my-1",
            iconClassName: "btn-img",
            iconSize: 22,
            iconType: infoSquare,
            isSmall: true,
            text: "Edit Icon Links",
            type: Components.ButtonTypes.OutlinePrimary,
            onClick: () => {
                // Show the datatable
                this._dt.show();
            }
        });
        btn.el.classList.remove("btn-icon");
    }

    // Shows the datatable
    showDatatable() {
        // Show the datatable
        this._dt.show();
    }

    // Updates the styling, based on the theme
    private _currTheme = null;
    updateTheme(themeInfo?: any, invertColors?: boolean) {
        // Set the current theme
        this._currTheme = themeInfo || this._currTheme;
        if (this._currTheme) {
            // Log
            Log.Information("Updating the theme.");

            // Get the style element
            let elStyle = this._el.querySelector("style");
            if (elStyle == null) {
                elStyle = document.createElement("style");
                this._el.appendChild(elStyle);
            }

            // Get the id of the webpart
            let wpid = this._el.getAttribute("data-sp-feature-instance-id");

            // Set the custom styling
            elStyle.innerHTML = `
                .icon-links[data-sp-feature-instance-id='${wpid}'] {
                    background-color: ${this._currTheme[invertColors ? "bodyBackground" : "bodyBackground"]};
                }
                .icon-links[data-sp-feature-instance-id='${wpid}'] .col > a,
                .icon-links[data-sp-feature-instance-id='${wpid}'] .col > a .icon-text,
                .icon-links[data-sp-feature-instance-id='${wpid}'] .col > a:visited,
                .icon-links[data-sp-feature-instance-id='${wpid}'] .col > a:visited .icon-text {
                    background-color: ${this._currTheme[invertColors ? "primaryButtonText" : "primaryButtonBackground"]};
                    color: ${this._currTheme[invertColors ? "primaryButtonBackground" : "primaryButtonText"]};
                }
                .icon-links[data-sp-feature-instance-id='${wpid}'] .col > a:hover,
                .icon-links[data-sp-feature-instance-id='${wpid}'] .col > a:hover .icon-text {
                    background-color: ${this._currTheme[invertColors ? "primaryButtonTextHovered" : "primaryButtonBackgroundHovered"]};
                    color: ${this._currTheme[invertColors ? "primaryButtonBackgroundHovered" : "primaryButtonTextHovered"]};
                }
                .icon-links[data-sp-feature-instance-id='${wpid}'] .icon-rect svg path,
                .icon-links[data-sp-feature-instance-id='${wpid}'] .icon-sqre svg path {
                    fill: ${this._currTheme[invertColors ? "primaryButtonBackground" : "primaryButtonText"]};
                }
            `;
        }
    }
}