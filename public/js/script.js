
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

  // Auto-suggestion functionality
  class AutoSuggestion {
    constructor(inputElement, dropdownElement) {
      this.input = inputElement;
      this.dropdown = dropdownElement;
      this.suggestions = [];
      this.currentIndex = -1;
      this.debounceTimer = null;
      this.isLoading = false;
      
      this.init();
    }
    
    init() {
      this.input.addEventListener('input', this.handleInput.bind(this));
      this.input.addEventListener('keydown', this.handleKeydown.bind(this));
      this.input.addEventListener('focus', this.handleFocus.bind(this));
      document.addEventListener('click', this.handleDocumentClick.bind(this));
    }
    
    handleInput(e) {
      const query = e.target.value.trim();
      
      // Clear previous timer
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      // Debounce the API call
      this.debounceTimer = setTimeout(() => {
        if (query.length >= 2) {
          this.fetchSuggestions(query);
        } else {
          this.hideSuggestions();
        }
      }, 300);
    }
    
    async fetchSuggestions(query) {
      try {
        this.isLoading = true;
        this.showLoading();
        
        const response = await fetch(`/api/suggestions?query=${encodeURIComponent(query)}`);
        const suggestions = await response.json();
        
        this.suggestions = suggestions;
        this.currentIndex = -1;
        
        if (suggestions.length > 0) {
          this.showSuggestions(suggestions);
        } else {
          this.showEmpty();
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        this.hideSuggestions();
      } finally {
        this.isLoading = false;
      }
    }
    
    showSuggestions(suggestions) {
      this.dropdown.innerHTML = '';
      
      suggestions.forEach((suggestion, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
          <span class="suggestion-text">${this.highlightMatch(suggestion.text, this.input.value)}</span>
          <span class="suggestion-type ${suggestion.type}">${suggestion.type}</span>
        `;
        
        item.addEventListener('click', () => {
          this.selectSuggestion(suggestion.text);
        });
        
        this.dropdown.appendChild(item);
      });
      
      this.dropdown.classList.add('show');
    }
    
    showLoading() {
      this.dropdown.innerHTML = '<div class="suggestions-loading">Searching...</div>';
      this.dropdown.classList.add('show');
    }
    
    showEmpty() {
      this.dropdown.innerHTML = '<div class="suggestions-empty">No suggestions found</div>';
      this.dropdown.classList.add('show');
    }
    
    hideSuggestions() {
      this.dropdown.classList.remove('show');
      this.currentIndex = -1;
    }
    
    highlightMatch(text, query) {
      if (!query) return text;
      
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<strong>$1</strong>');
    }
    
    selectSuggestion(text) {
      this.input.value = text;
      this.hideSuggestions();
      
      // Find the parent form and submit it automatically
      const form = this.input.closest('form');
      if (form) {
        form.submit();
      } else {
        // Fallback: focus the input if form not found
        this.input.focus();
      }
    }
    
    handleKeydown(e) {
      if (!this.dropdown.classList.contains('show')) return;
      
      const items = this.dropdown.querySelectorAll('.suggestion-item');
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this.currentIndex = Math.min(this.currentIndex + 1, items.length - 1);
          this.updateHighlight(items);
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          this.currentIndex = Math.max(this.currentIndex - 1, -1);
          this.updateHighlight(items);
          break;
          
        case 'Enter':
          e.preventDefault();
          if (this.currentIndex >= 0 && items[this.currentIndex]) {
            const text = items[this.currentIndex].querySelector('.suggestion-text').textContent;
            this.selectSuggestion(text);
          } else {
            // If no suggestion is highlighted, submit the form with current input value
            const form = this.input.closest('form');
            if (form && this.input.value.trim()) {
              form.submit();
            }
          }
          break;
          
        case 'Escape':
          this.hideSuggestions();
          break;
      }
    }
    
    updateHighlight(items) {
      items.forEach((item, index) => {
        item.classList.toggle('highlighted', index === this.currentIndex);
      });
    }
    
    handleFocus() {
      if (this.input.value.trim().length >= 2 && this.suggestions.length > 0) {
        this.dropdown.classList.add('show');
      }
    }
    
    handleDocumentClick(e) {
      if (!this.input.contains(e.target) && !this.dropdown.contains(e.target)) {
        this.hideSuggestions();
      }
    }
  }
  
  // Initialize auto-suggestion when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[name="query"]');
    const suggestionsDropdown = document.getElementById('suggestions-dropdown');
    
    if (searchInput && suggestionsDropdown) {
      new AutoSuggestion(searchInput, suggestionsDropdown);
    }
  });