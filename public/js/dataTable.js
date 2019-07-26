export default function getTestInfo(url){
    $("#tests").DataTable({
        ajax: {
            url: url,
            dataSrc: ""
        },        
        pageLength: 25, // show 25 entries
        columns: [
            {
                data: "name"
            },
            {
                data: "manualIds",
                render: function (ids) {
                    return displayIds(ids);                    
                }
            },
            {
                data: "automatedIds",
                render: function (ids) {
                    return displayIds(ids);                    
                }
            },
            {
                data: "description"
            }],
        drawCallback: function(settings){
            let index = url.lastIndexOf("/");                  
            let activeItem = url.substring(index + 1);            
            $("#" + activeItem).addClass("active");
        }
    });    

    function displayIds(ids) {
        let link = "https://cccone.visualstudio.com/CCC%20ONE/_workitems/edit/";
        let values = "";

        for (let i = 0; i < ids.length; i++) {
            if (ids[i] === "") {
                return "MISSING";
            }

            let testLink = link + ids[i];
            values += "<a href='" +  testLink + "' target='_blank'>" + ids[i] + "</a>" + " ";
        }

        return values;
    }
}