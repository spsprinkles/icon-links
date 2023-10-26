import { ListSecurity, ListSecurityDefaultGroups, LoadingDialog } from "dattatable";
import { SPTypes } from "gd-sprest-bs";
import Strings from "./strings";

/**
 * Security
 */
export class Security {
    private static _listSecurity: ListSecurity = null;

    // Constructor
    constructor(onComplete: () => void) {
        // Create the instance if it doesn't exist
        if (Security._listSecurity == null) {
            // Create the instance
            Security._listSecurity = new ListSecurity({
                listItems: [
                    {
                        groupName: ListSecurityDefaultGroups.Owners,
                        listName: Strings.Lists.IconLinks,
                        permission: SPTypes.RoleType.Administrator
                    },
                    {
                        groupName: ListSecurityDefaultGroups.Members,
                        listName: Strings.Lists.IconLinks,
                        permission: SPTypes.RoleType.Reader
                    },
                    {
                        groupName: ListSecurityDefaultGroups.Visitors,
                        listName: Strings.Lists.IconLinks,
                        permission: SPTypes.RoleType.Reader
                    }
                ],
                onGroupsLoaded: () => {
                    // Show the modal
                    Security._listSecurity.show(false, onComplete);
                }
            });
        } else {
            // Show the modal
            Security._listSecurity.show(false, onComplete);
        }
    }
}