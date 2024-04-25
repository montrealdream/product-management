// PERMISSIONS
const tablePermissions = document.querySelector("[table-permission]");
// hiển thị các quyền đã được tick
const dataRecords = document.querySelector("[data-records]");
if(dataRecords){
    // convert from JSON to JS
    const roles = JSON.parse(dataRecords.getAttribute("data-records"));
    
    roles.forEach((role, index) => {
        const permissions = role.permissions;
        for(const permission of permissions){
            const tr = tablePermissions.querySelector(`[data-name='${permission}']`);
            const input = tr.querySelectorAll("input")[index];
            input.checked = true;
        }
    });
}

if(tablePermissions){
    const rows = tablePermissions.querySelectorAll("[data-name]");
    
    // button change permissions
    const buttonPermission = document.querySelector("[button-permission]");
    buttonPermission.addEventListener("click", (event) => {
        // permissions array, contain id & array permissions
        let permissions = [];

        // iterate rows
        rows.forEach(row => {
            const name = row.getAttribute("data-name");
            
            if(name == "id"){
                const inputs = row.querySelectorAll("input");
                
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                });
            }
            else{
                const inputs = row.querySelectorAll("input");
                inputs.forEach((input, index) => {
                    const checked = input.checked;
                    if(checked){
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        
        if(permissions.length > 0){
            const formChangePermissions = document.querySelector("#form-change-permission");
            const input = formChangePermissions.querySelector("input");
            
            // convert form JS to JSON
            input.value = JSON.stringify(permissions);
            // submit
            formChangePermissions.submit();
        }
    });
}

