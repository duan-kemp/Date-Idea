// Make showWarningModal globally available
window.showWarningModal = function(type) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'warning-modal';
    
    if (type === 'museum') {
        modal.innerHTML = `
            <h2>Nahhhhh </h2>
            <button onclick="this.parentElement.remove(); document.querySelector('.modal-overlay').remove();">
                Kies iets anders bruh
            </button>
        `;
    } else {
        modal.innerHTML = `
            <h2>Is jy mal?😱</h2>
            <p>Ons is op budget hier! </p>
            <button onclick="this.parentElement.remove(); document.querySelector('.modal-overlay').remove();">
                Kies iets anders bruh 😂
            </button>
        `;
    }
    
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded', () => {
    // Questions array - needs to be defined before it's used
    const questions = [
        {
            question: "What do you want to eat?",
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
                { text: "A fancy restaurant", image: "images/fancyrestaurant.jpg" },
                { text: "Stay at home", image: "images/stayhome.jpg" },
                { text: "A picnic in the park", image: "images/park.jpg" }
            ]
        },
        {
            question: "What's Your Ideal Activity for Our Date?",
            options: [
                { text: "Watching a movie", image: "images/movie.jpg" },
                { text: "Going for a walk", image: "images/walking.jpg" },
                { text: "Visiting a museum", image: "images/museum.jpg" },
                { text: "Attending a live concert", image: "images/liveconcert.jpg" }
            ]
        },
        {
            question: "What do you want for Dessert?",
            options: [
                { text: "Ice cream", image: "images/icecream.jpg" },
                { text: "Chocolate cake", image: "images/chocolatecake.jpg" },
                { text: "Cheesecake", image: "images/cheesecake.jpg" },
                { text: "Fruit salad", image: "images/fruitsalad.jpg" }
            ]
        },
        {
            question: "Which Time Works Best for You?",
            options: [
                { text: "Morning", image: "images/morning.jpg" },
                { text: "Afternoon", image: "images/afternoon.jpg" },
                { text: "Evening", image: "images/evening.jpg" },
                { text: "Night", image: "images/night.jpg" }
            ]
        },
        {
            question: "What Type of Flowers Would You Like?",
            options: [
                { text: "Roses", image: "images/roses.jpg" },
                { text: "Tulips", image: "images/tulips.jpg" },
                { text: "Sunflowers", image: "images/sunflowers.jpg" },
                { text: "Lilies", image: "images/lilies.jpg" }
            ]
        }
    ];

    // Cache DOM elements and create fragment
    const questionsList = document.getElementById('questionsList');
    const fragment = document.createDocumentFragment();
    
    // Optimize image loading
    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Preload images
    function preloadImages() {
        const imagePromises = questions.flatMap(q => 
            q.options.map(opt => loadImage(opt.image))
        );
        return Promise.all(imagePromises).catch(() => console.log('Some images failed to load'));
    }

    // Create question card more efficiently
    function createQuestionCard(q, index) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card';
        
        const optionsHTML = q.options.map((option, optIndex) => {
            const isFancyRestaurant = option.text === "A fancy restaurant";
            const isLiveConcert = option.text === "Attending a live concert";
            const isMuseum = option.text === "Visiting a museum";
            const isFlowerQuestion = q.question.includes("Flowers");
            const isDisabled = isFancyRestaurant;
            
            const labelClickHandler = isFancyRestaurant ? 
                'onclick="showWarningModal(\'restaurant\'); event.preventDefault(); return false;"' : 
                isMuseum ?
                'onclick="showWarningModal(\'museum\'); event.preventDefault(); return false;"' : '';
            
            return `
                <div class="option-card ${isDisabled ? 'disabled' : ''} ${isLiveConcert ? 'concert-option' : ''}">
                    <input type="radio" 
                        id="q${index}o${optIndex}" 
                        name="question${index}" 
                        value="${option.text}"
                        ${isDisabled ? 'disabled' : ''}
                        ${isLiveConcert ? 'onchange="updateConcertText(this)"' : ''}
                        ${isFlowerQuestion ? 'onchange="showFlowerSurprise(this)"' : ''}
                        ${isMuseum ? 'disabled' : ''}
                    >
                    <label for="q${index}o${optIndex}" ${labelClickHandler}>
                        <img src="${option.image}" 
                             class="option-image" 
                             alt="${option.text}"
                             loading="lazy">
                        <div class="option-content">
                            <span class="option-letter">${String.fromCharCode(97 + optIndex)}.</span>
                            <span class="option-text">${option.text}</span>
                            ${isLiveConcert ? '<span class="without-me-text">...without me lol</span>' : ''}
                        </div>
                    </label>
                </div>
            `;
        }).join('');

        questionDiv.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p class="question-text">${q.question}</p>
            <div class="options-grid">
                ${optionsHTML}
            </div>
        `;
        
        return questionDiv;
    }

    // Optimized showQuestions function
    async function showQuestions() {
        // Clear existing content
        questionsList.innerHTML = '';
        
        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.textContent = 'Loading questions...';
        questionsList.appendChild(loadingDiv);

        // Preload images
        await preloadImages();

        // Remove loading indicator
        loadingDiv.remove();

        // Create and append all questions
        questions.forEach((q, index) => {
            fragment.appendChild(createQuestionCard(q, index));
        });

        // Add note about email
        const emailNote = document.createElement('p');
        emailNote.className = 'email-note';
        emailNote.innerHTML = 'When you click submit, please select Gmail or Outlook to email your answers ❤️ anders gaan ons nie op n date nie.';
        fragment.appendChild(emailNote);

        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Submit Answers';
        submitBtn.className = 'submit-btn';
        submitBtn.addEventListener('click', handleSubmit);
        fragment.appendChild(submitBtn);

        // Append everything at once
        questionsList.appendChild(fragment);
    }

    // Optimized submit handler
    function handleSubmit() {
        // Only check first 5 questions (excluding flowers)
        const answers = questions.slice(0, 5).map((_, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            return {
                question: questions[index].question,
                answer: selectedOption ? selectedOption.value : 'No answer'
            };
        });
        
        if (answers.some(a => a.answer === 'No answer')) {
            alert('Please answer all questions! ❤️');
            return;
        }

        // Format email content
        const emailBody = answers.map(a => 
            `${a.question}: ${a.answer}`
        ).join('%0D%0A%0D%0A'); // Add line breaks for email

        // Create email link
        const emailSubject = "Date Answers 💕";
        const mailtoLink = `mailto:duan.kemp2004777@gmail.com?subject=${emailSubject}&body=${emailBody}`;

        // Open email client
        window.location.href = mailtoLink;
        
        // Show confirmation modal after small delay
        setTimeout(() => {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            
            const confirmationModal = document.createElement('div');
            confirmationModal.className = 'confirmation-modal';
            confirmationModal.innerHTML = `
                <div class="confirmation-content">
                    <h2>Thank you for your answers! ❤️</h2>
                    <p>I will plan the perfect date based on your choices!</p>
                    <button onclick="this.parentElement.parentElement.remove(); document.querySelector('.modal-overlay').remove();">
                        Can't Wait! 😊
                    </button>
                </div>
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(confirmationModal);
        }, 500);
    }

    // Add this to the global scope
    window.updateConcertText = function(radio) {
        const concertOptions = document.querySelectorAll('.concert-option');
        concertOptions.forEach(option => {
            option.classList.toggle('selected', option.contains(radio) && radio.checked);
        });
    }

    // Add this to the global scope
    window.showFlowerSurprise = function(radio) {
        const questionCard = radio.closest('.question-card');
        const optionsGrid = questionCard.querySelector('.options-grid');
        
        // Create surprise message
        const surpriseDiv = document.createElement('div');
        surpriseDiv.className = 'flower-surprise';
        surpriseDiv.innerHTML = `
            <div class="surprise-content">
                <h2>Sike! 😂</h2>
                <p>Lol het jy actually gedink daar is opsies<br>Jy sal maar kry wat in the shop is</p>
            </div>
        `;
        
        // Replace options with surprise message
        optionsGrid.style.animation = 'fadeOut 0.5s forwards';
        setTimeout(() => {
            optionsGrid.innerHTML = '';
            optionsGrid.appendChild(surpriseDiv);
            optionsGrid.style.animation = 'fadeIn 0.5s forwards';
        }, 500);
    };

    // Start showing questions
    showQuestions();
}); 
