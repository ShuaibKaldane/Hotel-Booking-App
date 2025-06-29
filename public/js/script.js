
  // Bootstrap custom form validation
  (function () {
    'use strict'

    // Fetch all the forms we want to apply custom validation to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission if invalid
    Array.from(forms).forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
  })();