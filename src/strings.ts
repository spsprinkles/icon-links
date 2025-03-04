import { ContextInfo, SPTypes } from "gd-sprest-bs";

// Sets the context information
// This is for SPFx or Teams solutions
export const setContext = (context, envType?: number, sourceUrl?: string) => {
    // Set the context
    ContextInfo.setPageContext(context.pageContext);

    // Update the properties
    Strings.IsClassic = envType == SPTypes.EnvironmentType.ClassicSharePoint;
    Strings.SourceUrl = sourceUrl || ContextInfo.webServerRelativeUrl;
}

/**
 * Global Constants
 */
const Strings = {
    AppElementId: "icon-links",
    GlobalVariable: "IconLinks",
    IsClassic: true,
    Lists: {
        IconLinks: "Icon Links"
    },
    ProjectName: "Icon Links",
    ProjectDescription: "This is similar to Quick links but saves the data in a SharePoint list. You can use the links across multiple pages & sites without having to recreate them.",
    SourceUrl: ContextInfo.webServerRelativeUrl,
    Version: "0.1.2"
};
export default Strings;