$(function(){
    window.setTimeout(function(){
        $(".alert").fadeOut("slow");
    }, 5000);
      
    //Get the forms we want to add validation styles to
    let forms = document.getElementsByClassName("needs-validation");

    // validate data on register and login form
    let validation = Array.prototype.filter.call(forms, form => {
        form.addEventListener("submit", event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    }, false);
});