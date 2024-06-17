document.addEventListener('DOMContentLoaded', function() {
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercentage = document.getElementById('volume-percentage');

    volumeSlider.addEventListener('input', function() {
        volumePercentage.textContent = `${volumeSlider.value}%`;
    });
});
