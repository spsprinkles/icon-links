import { DisplayMode, Environment, Log, Version } from '@microsoft/sp-core-library';
import { PropertyPaneButton, PropertyPaneChoiceGroup, IPropertyPaneConfiguration, PropertyPaneDropdown, PropertyPaneHorizontalRule, PropertyPaneLabel, PropertyPaneTextField, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme, ISemanticColors } from '@microsoft/sp-component-base';
import * as strings from 'IconLinksWebPartStrings';

export interface IIconLinksWebPartProps {
  invertColors: boolean;
  justify: string;
  layout: string;
  listName: string;
  viewName: string;
  webUrl: string;
}

// App
interface IApp {
  refresh: (displayMode: number, layout: string, justify: string, invertColors: boolean) => void;
  showDatatable: () => void;
  updateTheme: (currentTheme?: Partial<ISemanticColors>) => void;
}

// App Properties
interface IAppProps {
  el: HTMLElement;
  context: WebPartContext;
  envType: number;
  displayMode: DisplayMode;
  invertColors: boolean;
  layout: string;
  log: Log;
  justify: string;
  viewName: string;
  listName: string;
  sourceUrl: string;
}

// Import the solution
import "main-lib";
declare const IconLinks: {
  description: string;
  init: (props: IAppProps) => IApp;
  version: string;
}

export default class IconLinksWebPart extends BaseClientSideWebPart<IIconLinksWebPartProps> {
  private _app: IApp;
  private _currentTheme: IReadonlyTheme;

  public render(): void {
    // Set the default property values
    if (!this.properties.justify) { this.properties.justify = strings.JustifyFieldValue; }
    if (!this.properties.listName) { this.properties.listName = strings.ListNameFieldValue; }
    if (!this.properties.layout) { this.properties.layout = strings.LayoutFieldValue; }
    if (!this.properties.viewName) { this.properties.viewName = strings.ViewNameFieldValue; }
    if (!this.properties.webUrl) { this.properties.webUrl = this.context.pageContext.web.serverRelativeUrl; }

    // Set the app props
    const appProps: IAppProps = {
      context: this.context,
      el: this.domElement,
      envType: Environment.type,
      displayMode: this.displayMode,
      invertColors: this.properties.invertColors,
      justify: this.properties.justify,
      layout: this.properties.layout,
      listName: this.properties.listName,
      log: Log,
      viewName: this.properties.viewName,
      sourceUrl: this.properties.webUrl
    };

    // See if the app has been rendered
    if (this._app) {
      // Refresh the solution
      this._app.refresh(appProps.displayMode, appProps.layout, appProps.justify, appProps.invertColors);
    } else {
      // Initialize the solution
      this._app = IconLinks.init(appProps);

      // See if the current theme exists
      if (this._currentTheme) {
        // Update the theme
        this._app.updateTheme(this._currentTheme.semanticColors);
      }
    }
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    // Set the theme
    this._currentTheme = currentTheme;

    // See if the app exists
    if (this._app) {
      // Update the theme
      this._app.updateTheme(currentTheme.semanticColors);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse(IconLinks.version);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneChoiceGroup('layout', {
                  label: strings.LayoutFieldLabel,
                  options: [
                    {
                      key: 'icon-sqre',
                      text: 'Square',
                      iconProps: { officeFabricIconFontName: 'squareshape' }
                    },
                    {
                      key: 'icon-rect',
                      text: 'Rectangle',
                      imageSize: { height: 32, width: 32 },
                      imageSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBzdHlsZT0ic3Ryb2tlOiAjMjQyNDI0OyIgeD0iMSIgeT0iMSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEyIiByeD0iMiIgc3Ryb2tlLXdpZHRoPSIyIj48L3JlY3Q+PC9zdmc+',
                      selectedImageSrc: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCBzdHlsZT0ic3Ryb2tlOiAjMjQyNDI0OyIgeD0iMSIgeT0iMSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjEyIiByeD0iMiIgc3Ryb2tlLXdpZHRoPSIyIj48L3JlY3Q+PC9zdmc+'
                    }
                  ]
                }),
                PropertyPaneDropdown('justify', {
                  label: strings.JustifyFieldLabel,
                  selectedKey: 'justify-content-start',
                  options: [
                    { key: 'justify-content-start', text: 'Left' },
                    { key: 'justify-content-center', text: 'Center' },
                    { key: 'justify-content-end', text: 'Right' },
                    { key: 'justify-content-around', text: 'Around' },
                    { key: 'justify-content-between', text: 'Between' }
                  ]
                }),
                PropertyPaneToggle('invertColors', {
                  checked: this.properties.invertColors,
                  label: "Invert Colors:",
                  offText: "The background will be darker, and the icon/text will be lighter.",
                  onText: "The background will be lighter, and icon/text will be darker."
                }),
                PropertyPaneTextField('webUrl', {
                  label: strings.WebUrlFieldLabel,
                  description: strings.WebUrlFieldDescription
                }),
                PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel,
                  description: strings.ListNameFieldDescription
                }),
                PropertyPaneTextField('viewName', {
                  label: strings.ViewNameFieldLabel,
                  description: strings.ViewNameFieldDescription
                }),
                PropertyPaneHorizontalRule(),
                PropertyPaneButton('editLinks', {
                  text: "Edit Icon Links",
                  onClick: () => {
                    // Show the list
                    this._app.showDatatable();
                  }
                }),
                PropertyPaneLabel('version', {
                  text: "v" + IconLinks.version
                })
              ]
            }
          ],
          header: {
            description: IconLinks.description
          }
        }
      ]
    };
  }
}
