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
            }]
    });

    function displayIds(ids) {
        var link = "https://cccone.visualstudio.com/CCC%20ONE/_workitems/edit/";
        var values = "";

        for (var i = 0; i < ids.length; i++) {
            if (ids[i] === "") {
                return "MISSING";
            }

            var testLink = link + ids[i];
            values += "<a href='" +  testLink + "' target='_blank'>" + ids[i] + "</a>" + " ";
        }
        console.log("concat: " + values);
        return values;
    }
}