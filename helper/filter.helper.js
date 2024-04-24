module.exports.buttonStatus = (query) => {
    const buttonFilterStatus = [
        {
            title: "Tất cả",
            status: "",
            class: ""
        },
        {
            title: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            title: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    if(query.status){
        const index = buttonFilterStatus.findIndex(button => {
            return button.status === query.status;
        });

        buttonFilterStatus[index].class = "btn--active";
    }
    else{
        const index = 0;
        buttonFilterStatus[0].class = "btn--active";
    }
    
    return buttonFilterStatus;
}