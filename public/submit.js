document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('submitForm');

    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(submitForm);

        fetch('http://localhost:3000/submit-assignment', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert(data.message);
            submitForm.reset();
        })
        .catch(error => console.error('Error:', error));
    });
});