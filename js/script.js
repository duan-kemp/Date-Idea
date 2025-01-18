document.addEventListener('DOMContentLoaded', () => {
    const initialMessage = document.getElementById('initial-message');
    const revealBtn = document.getElementById('revealBtn');
    const questionContent = document.getElementById('question-content');
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const response = document.getElementById('response');
    
    // Add check before creating hearts
    const heartsContainer = document.createElement('div');
    heartsContainer.classList.add('hearts-container');
    document.body.appendChild(heartsContainer);
    
    // Create floating hearts
    function createHeart() {
        const heart = document.createElement('i');
        heart.classList.add('fas', 'fa-heart', 'heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 6000);
    }
    
    setInterval(createHeart, 300);

    // Reveal button functionality
    revealBtn.addEventListener('click', () => {
        initialMessage.style.display = 'none';
        questionContent.classList.remove('hidden');
        questionContent.classList.add('show');
    });

    // No button interaction - moves away from cursor
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
        
        noBtn.style.position = 'absolute';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
    });

    // Yes button interaction
    yesBtn.addEventListener('click', () => {
        // Hide the question and buttons
        questionContent.querySelector('h1').style.display = 'none';
        questionContent.querySelector('.buttons').style.display = 'none';
        
        // Show the response with questions prompt
        response.classList.remove('hidden');
        response.classList.add('show');
    });

    // Add countdown element
    const countdownElement = document.createElement('p');
    countdownElement.id = 'finalCountdown';
    response.appendChild(countdownElement);

    // Countdown timer function
    function startCountdown() {
        const dateTime = new Date();
        dateTime.setDate(dateTime.getDate() + 2); // Set to 2 days from now
        dateTime.setHours(19, 0, 0); // Set to 7 PM

        function updateCountdown() {
            const now = new Date().getTime();
            const distance = dateTime - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = 
                `${days}d ${hours}h ${minutes}m ${seconds}s`;

            if (distance < 0) {
                clearInterval(x);
                countdownElement.innerHTML = "It's date time! ❤️";
            }
        }

        updateCountdown();
        const x = setInterval(updateCountdown, 1000);
    }

    const questionsYesBtn = document.getElementById('questionsYesBtn');
    const questionsNoBtn = document.getElementById('questionsNoBtn');
    const tryAgainDiv = document.getElementById('tryAgain');
    const questionsContainer = document.getElementById('questionsContainer');
    const proceedBtn = document.getElementById('proceedBtn');

    // Questions array
    const questions = [
        {
            question: "What's Your Favorite Cuisine?",
            options: [
                { text: "Sushi", image: "images/sushi.jpg" },
                { text: "Pizza", image: "images/pizza.jpg" },
                { text: "Burgers", image: "images/burger.jpg" },
                { text: "Pasta", image: "images/pasta.jpg" }
            ]
        },
        {
            question: "Where Would You Prefer to Go?",
            options: [
                { text: "A cozy café", image: "images/cafe.jpg" },
                { text: "A fancy restaurant", image: "images/restaurant.jpg" },
                { text: "An adventurous food truck", image: "images/foodtruck.jpg" },
                { text: "A picnic in the park", image: "images/picnic.jpg" }
            ]
        },
        {
            question: "What's Your Ideal Activity for Our Date?",
            options: ["Watching a movie", "Going for a walk", "Visiting a museum", "Attending a live concert"]
        },
        {
            question: "What's Your Favorite Dessert?",
            options: ["Ice cream", "Chocolate cake", "Cheesecake", "Fruit salad"]
        },
        {
            question: "Which Time Works Best for You?",
            options: ["Morning", "Afternoon", "Evening", "Night"]
        },
        {
            question: "What's Your Preferred Dress Code?",
            options: ["Casual", "Semi-formal", "Formal", "Sporty"]
        }
    ];

    // Handle questions yes button
    questionsYesBtn.addEventListener('click', () => {
        window.location.href = 'questions.html';
    });

    // Handle questions no button
    questionsNoBtn.addEventListener('click', () => {
        response.classList.add('hidden');
        tryAgainDiv.classList.remove('hidden');
        tryAgainDiv.classList.add('show');
    });

    // Handle proceed button in try again section
    proceedBtn.addEventListener('click', () => {
        window.location.href = 'questions.html';
    });

    function showQuestions() {
        questionsContainer.classList.remove('hidden');
        questionsContainer.classList.add('show');
        
        const questionsList = document.getElementById('questionsList');
        questionsList.innerHTML = ''; // Clear existing questions
        
        questions.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-card');
            
            let optionsHTML = q.options.map((option, optIndex) => `
                <div class="option-card">
                    <input type="radio" id="q${index}o${optIndex}" name="question${index}" value="${option.text}">
                    <label for="q${index}o${optIndex}">
                        ${option.image ? `<img src="${option.image}" class="option-image" alt="${option.text}">` : ''}
                        <div class="option-content">
                            <span class="option-letter">${String.fromCharCode(97 + optIndex)}.</span>
                            ${option.text}
                        </div>
                    </label>
                </div>
            `).join('');

            questionDiv.innerHTML = `
                <h3>Question ${index + 1}</h3>
                <p class="question-text">${q.question}</p>
                <div class="options-grid">
                    ${optionsHTML}
                </div>
            `;
            questionsList.appendChild(questionDiv);
        });

        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Answers';
        submitBtn.classList.add('submit-btn');
        submitBtn.addEventListener('click', handleSubmit);
        questionsList.appendChild(submitBtn);
    }

    function handleSubmit() {
        const answers = [];
        questions.forEach((_, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            answers.push(selectedOption ? selectedOption.value : 'No answer');
        });
        
        if (answers.includes('No answer')) {
            alert('Please answer all questions! ❤️');
            return;
        }
        
        alert('Thank you for your answers! ❤️\nI will plan the perfect date based on your choices!');
    }
}); 
