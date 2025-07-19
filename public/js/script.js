
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

  // Rating range input handler
  document.addEventListener('DOMContentLoaded', function() {
    const ratingInput = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');
    
    if (ratingInput && ratingValue) {
      // Update display when range changes
      ratingInput.addEventListener('input', function() {
        ratingValue.textContent = this.value;
      });
      
      // Ensure rating is set on form submission
      ratingInput.addEventListener('change', function() {
        if (!this.value) {
          this.value = 4; // Default value
        }
      });
      
      // Ensure rating is set before form submission
      const form = ratingInput.closest('form');
      if (form) {
        form.addEventListener('submit', function(e) {
          if (!ratingInput.value) {
            ratingInput.value = 4;
          }
          console.log('Form submitting with rating:', ratingInput.value);
        });
      }
    }
  });