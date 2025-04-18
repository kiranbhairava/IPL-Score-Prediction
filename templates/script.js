// Add this to a file named 'script.js' in your static folder
// Then include it in your HTML with: <script src="{{ url_for('static', filename='script.js') }}"></script>

document.addEventListener('DOMContentLoaded', function() {
    // If we're on the results page and have the prediction values
    if (document.querySelector('.results') && 
        document.getElementById('visualize-prediction')) {
        
        // Get the prediction values from data attributes
        const scoreLower = parseInt(document.getElementById('visualize-prediction').dataset.lower);
        const scoreUpper = parseInt(document.getElementById('visualize-prediction').dataset.upper);
        const canvas = document.getElementById('prediction-chart');
        
        if (canvas && canvas.getContext) {
            visualizePrediction(canvas, scoreLower, scoreUpper);
        }
    }
    
    // Form validation
    const predictionForm = document.getElementById('prediction-form');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(event) {
            const battingTeam = document.getElementById('batting-team').value;
            const bowlingTeam = document.getElementById('bowling-team').value;
            
            if (battingTeam === bowlingTeam) {
                event.preventDefault();
                alert('Batting and bowling teams cannot be the same!');
            }
        });
    }
    
    // Team selection visual feedback
    const teamSelects = document.querySelectorAll('select[name="batting-team"], select[name="bowling-team"]');
    teamSelects.forEach(select => {
        select.addEventListener('change', function() {
            // Highlight selected team logos
            const teamLogos = document.querySelectorAll('.team-logo');
            teamLogos.forEach(logo => {
                logo.classList.remove('selected-team');
                if (logo.alt === this.value) {
                    logo.classList.add('selected-team');
                }
            });
        });
    });
});

// Function to visualize the prediction range as a gauge chart
function visualizePrediction(canvas, lower, upper) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Define the score ranges and colors
    const maxScore = 250; // Maximum possible IPL score
    const ranges = [
        { min: 0, max: 140, color: '#FF6B6B' },   // Low score
        { min: 140, max: 180, color: '#FFD166' }, // Average score
        { min: 180, max: 250, color: '#06D6A0' }  // High score
    ];
    
    // Draw the gauge background
    const gaugeWidth = width * 0.8;
    const gaugeHeight = height * 0.2;
    const startX = (width - gaugeWidth) / 2;
    const startY = height * 0.6;
    
    // Draw the gauge segments
    ranges.forEach(range => {
        const rangeWidth = (range.max - range.min) / maxScore * gaugeWidth;
        const rangeStartX = startX + (range.min / maxScore * gaugeWidth);
        
        ctx.fillStyle = range.color;
        ctx.fillRect(rangeStartX, startY, rangeWidth, gaugeHeight);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(rangeStartX, startY, rangeWidth, gaugeHeight);
    });
    
    // Draw the prediction range indicator
    const lowerX = startX + (lower / maxScore * gaugeWidth);
    const upperX = startX + (upper / maxScore * gaugeWidth);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(lowerX, startY - 10, upperX - lowerX, gaugeHeight + 20);
    
    // Draw labels
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Open Sans';
    ctx.textAlign = 'center';
    ctx.fillText(`${lower} - ${upper} runs`, (lowerX + upperX) / 2, startY + gaugeHeight / 2 + 5);
    
    // Draw min and max values
    ctx.fillStyle = '#333';
    ctx.font = '12px Open Sans';
    ctx.textAlign = 'left';
    ctx.fillText('0', startX, startY + gaugeHeight + 20);
    ctx.textAlign = 'right';
    ctx.fillText('250', startX + gaugeWidth, startY + gaugeHeight + 20);
}