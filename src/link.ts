import { Components } from "gd-sprest-bs";
import { ILinkItem } from "./ds";

// Blank Icon
const DefaultIcon = `<svg width="16" height="16" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="5" r="2" fill="none" /></svg>`;

/**
 * Link
 */
export class Link {
    // Constructor
    constructor(el: HTMLElement, link: ILinkItem, layout?: string, invertColors?: boolean) {
        // Render the link
        this.render(el, link, layout, invertColors);
    }

    // Generates the base html
    private generateElement(link: ILinkItem, layout: string, invertColors: boolean) {
        let el: HTMLElement = null;

        // Set the icon svg html
        let elIcon = document.createElement("div");
        elIcon.innerHTML = link.LinkIcon || DefaultIcon;

        // Ensure a svg icon exists
        let svgIcon = elIcon.querySelector("svg");
        if (svgIcon) {
            // Clear the container color
            svgIcon.removeAttribute("fill");

            // Clear the height
            svgIcon.removeAttribute("height");

            // Clear the width
            svgIcon.removeAttribute("width");

            // Hide icon from assistive technologies
            svgIcon.setAttribute("aria-hidden", "true");

            // Get the path elements
            svgIcon.querySelectorAll("path").forEach(el => {
                // Clear the color
                el.removeAttribute("fill");
            });

            // Generate the html
            let html = `<div class="col">
                <a href="${link.LinkUrl || "#"}" aria-label="${link.LinkTooltip || link.Title}" target="${link.OpenInNewTab ? "_blank" : "_self"}">
                    ${svgIcon.outerHTML}
                    <div class="icon-text">${link.Title}</div>
                </a>
            </div>`;

            // Create the element
            el = document.createElement("div");
            el.innerHTML = html;

            // Add icon layout class or default to the square icon
            let elIconLink = el.querySelector("a");
            layout ? elIconLink.classList.add(layout) : elIconLink.classList.add("icon-sqre");
            invertColors ? elIconLink.classList.add("icon-light") : null;

            // See if a tooltip exists
            let elCol = el.querySelector(".col") as HTMLElement;
            if (link.LinkTooltip) {
                // Render the tooltip
                Components.Tooltip({
                    content: link.LinkTooltip,
                    target: elCol,
                    options: {
                        offset: [0, 5]
                    }
                })
            }

            // Return the element
            return elCol;
        }
    }

    // Renders the link
    private render(el: HTMLElement, link: ILinkItem, layout: string, invertColors: boolean) {
        // Generate the element
        let elLink = this.generateElement(link, layout, invertColors);
        if (elLink) {
            el.appendChild(elLink);
        }
    }
}