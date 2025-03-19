// to get current year
function getYear() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    document.querySelector("#displayYear").innerHTML = currentYear;
}

getYear();


// Auth functionality
$(document).ready(function() {
    // Check existing auth state
    function updateAuthState() {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            $('#authText').text('Logout');
            $('#trackPipelineItem').show();
        } else {
            $('#authText').text('Login');
            $('#trackPipelineItem').hide();
            // Redirect to index.html if not logged in
            if (window.location.pathname.endsWith('tracker.html')) {
                window.location.href = 'index.html';
            }
        }
    }

    // Initial check
    updateAuthState();

    // Auth button click handler
    $('#authButton').click(function(e) {
        e.preventDefault();
        const userEmail = localStorage.getItem('userEmail');
        
        if (userEmail) {
            // Logout
            localStorage.removeItem('userEmail');
            updateAuthState();
            // Redirect to index.html after logout
            window.location.href = 'index.html';
        } else {
            // Show login modal
            $('#loginModal').modal('show');
        }
    });

    // Login form submission
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val();
        
        if (email) {
            localStorage.setItem('userEmail', email);
            $('#loginModal').modal('hide');
            updateAuthState();
        }
    });
});


// owl carousel slider js
var owl = $('.portfolio_carousel').owlCarousel({
    loop: true,
    margin: 15,
    dots: false,
    center: true,
    autoplay: true,
    navText: [
        '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
        '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
    ],
    autoplayHoverPause: true,
    responsive: {
        0: {
            center: false,
            items: 1,
            margin: 0
        },
        576: {
            items: 2
        },
        991: {
            center: true,
            items: 3
        }
    }
})


// Initialize Map
function initMap() {
    const defaultLocation = { lat: 40.7128, lng: -74.0060 };
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      center: defaultLocation,
      mapTypeId: 'hybrid',
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true
    });
  
    // Add click listener for map
    map.addListener('click', (mapsMouseEvent) => {
      const selectedLocation = mapsMouseEvent.latLng.toJSON();
      $('#downloadSection').fadeIn();
      $('#coordinates').val(`${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`);
      
      // Add marker
      new google.maps.Marker({
        position: selectedLocation,
        map: map,
        title: 'Selected Location'
      });
    });
  
    // Locate button handler
    $('#locateBtn').click(function(e) {
      e.preventDefault();
      const coords = $('#coordinates').val().split(',').map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        map.setCenter({ lat: coords[0], lng: coords[1] });
        map.setZoom(15);
      }
    });
  
    // Download button handler
    $('#downloadBtn').click(function() {
      const coords = $('#coordinates').val();
      const dummyData = `Location Analysis Report\nCoordinates: ${coords}\nDate: ${new Date().toLocaleDateString()}`;
      const blob = new Blob([dummyData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `location-analysis-${Date.now()}.txt`;
      a.click();
    });
  }
  
  // Load Google Maps API (replace YOUR_API_KEY with actual key)
  function loadMapScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDMBWoq6HvpLL-XQvPiMkNVsI6k2oSU0WU&callback=initMap`;
    script.defer = true;
    document.head.appendChild(script);
  }
  
  // Initialize when page loads
  $(document).ready(function() {
    loadMapScript();
    
    // Show map section when Track Pipeline is clicked
    // $('#trackPipelineItem a').click(function(e) {
    //   e.preventDefault();
    //   $('html, body').animate({
    //     scrollTop: $('.map_section').offset().top
    //   }, 500);
    // });
  });


// owl.owlcarousel2_filter

$('.owl-filter-bar').on('click', '.item', function (e) {
    var $items = $('.owl-filter-bar a')
    var $item = $(this);
    var filter = $item.data('owl-filter')
    $items.removeClass("active");
    $item.addClass("active");
    owl.owlcarousel2_filter(filter);

    e.preventDefault();
})
/** google_map js **/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(40.712775, -74.005973),
        zoom: 18,
    };
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
}

// nice select
$(document).ready(function () {
    $('select').niceSelect();
});

// Contact Form Submission
document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
  
    const submitButton = this.querySelector('.form-button');
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true; // Disable the button to prevent multiple submissions
  
    // Log form data for debugging
    const formData = new FormData(this);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    // Use Formspree's fetch API to submit the form
    fetch(this.action, {
      method: this.method,
      body: formData,
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          submitButton.textContent = 'Sent!';
          setTimeout(() => {
            submitButton.textContent = 'Send Message';
            submitButton.disabled = false; // Re-enable the button after 2 seconds
          }, 2000); // Revert back to "Send Message" after 2 seconds
          this.reset(); // Clear the form fields
        } else {
          // Log the response for debugging
          response.json().then((data) => {
            console.error('Formspree Error:', data);
            throw new Error('Form submission failed');
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false; // Re-enable the button on error
        alert('Message sending failed. Please try again.');
      });
  });