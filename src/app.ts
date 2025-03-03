import { Components, ContextInfo, Helper, SPTypes } from "gd-sprest-bs";
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
            this.updateTheme();
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
    updateTheme(themeInfo?: any) {
        // Log
        Log.Information("Updating the theme.");

        // Get the theme colors
        let neutralDark = (themeInfo || ContextInfo.theme).neutralDark || this._ds.getThemeColor("StrongBodyText");
        let neutralLight = (themeInfo || ContextInfo.theme).neutralLight || this._ds.getThemeColor("DisabledLines");
        let neutralTertiary = (themeInfo || ContextInfo.theme).neutralTertiary || this._ds.getThemeColor("ButtonBorder");
        let primaryButtonText = (themeInfo || ContextInfo.theme).primaryButtonText || this._ds.getThemeColor("TileText");
        let themeDark = (themeInfo || ContextInfo.theme).themeDark || this._ds.getThemeColor("EmphasisBorder");
        let themeDarker = (themeInfo || ContextInfo.theme).themeDarker || this._ds.getThemeColor("EmphasisHoverBorder");
        let themeDarkAlt = (themeInfo || ContextInfo.theme).themeDarkAlt || this._ds.getThemeColor("HoverBackground");
        let themePrimary = (themeInfo || ContextInfo.theme).themePrimary || this._ds.getThemeColor("AccentText");

        // Set the CSS properties to the theme colors
        let root = document.querySelector(':root') as HTMLElement;
        root.style.setProperty('--sp-neutral-dark', neutralDark);
        root.style.setProperty('--sp-neutral-light', neutralLight);
        root.style.setProperty('--sp-neutral-tertiary', neutralTertiary);
        root.style.setProperty('--sp-primary-button-text', primaryButtonText);
        root.style.setProperty('--sp-theme-dark', themeDark);
        root.style.setProperty('--sp-theme-darker', themeDarker);
        root.style.setProperty('--sp-theme-dark-alt', themeDarkAlt);
        root.style.setProperty('--sp-theme-primary', themePrimary);
    }
}