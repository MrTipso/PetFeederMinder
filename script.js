document.addEventListener("DOMContentLoaded", function () {
    const countdownElement = document.getElementById('countdown');
    const setButton = document.getElementById('set-reminder');
    const stopButton = document.getElementById('stop-sound');
    const ownerNameInput = document.getElementById('owner-name');
    const petNameInput = document.getElementById('pet-name');
    const petTypeInput = document.getElementById('pet-type');
    const customPetTypeContainer = document.getElementById('custom-pet-type-container');
    const customPetTypeInput = document.getElementById('custom-pet-type');
    const daysInput = document.getElementById('days-input');
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    const timerSoundSelect = document.getElementById('timer-sound');
    const audio = new Audio();

    let countdown;
    let soundInterval;

    function startCountdown(timeInMillis) {
        const now = Date.now();
        const targetTime = now + timeInMillis;

        countdown = setInterval(() => {
            const currentTime = Date.now();
            const timeRemaining = targetTime - currentTime;

            if (timeRemaining <= 0) {
                clearInterval(countdown);
                countdownElement.textContent = `Time to feed ${petNameInput.value}!`;

                if (timerSoundSelect.value !== 'none') {
                    audio.pause();
                    audio.currentTime = 0;

                    audio.src = `sounds/${timerSoundSelect.value}.mp3`;
                    audio.loop = true;
                    audio.play();

                    soundInterval = setInterval(() => {
                        if (!audio.paused) {
                            audio.play();
                        }
                    }, audio.duration * 1000);
                }

                // Store the reminder in the database
                const reminder = {
                    ownerName: ownerNameInput.value,
                    petName: petNameInput.value,
                    petType: petTypeInput.value,
                    customPetType: customPetTypeInput.value,
                    days: parseInt(daysInput.value) || 0,
                    hours: parseInt(hoursInput.value) || 0,
                    minutes: parseInt(minutesInput.value) || 0,
                    seconds: parseInt(secondsInput.value) || 0,
                    timerSound: timerSoundSelect.value
                };
                saveReminder(reminder);
            } else {
                const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
                const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
                const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

                let countdownText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                countdownElement.textContent = countdownText;
            }
        }, 1000);
    }

    function stopTimerSound() {
        clearInterval(soundInterval);
        audio.pause();
        audio.currentTime = 0;
        stopButton.style.display = 'none';
    }

    function showCountdown() {
        countdownElement.textContent = '';
        countdownElement.style.display = 'block';
        stopButton.style.display = 'block';
    }

    function showSetButton() {
        countdownElement.textContent = 'No reminder set';
        countdownElement.style.display = 'none';
        stopButton.style.display = 'none';
        setButton.style.display = 'block';
        ownerNameInput.style.display = 'block';
        petNameInput.style.display = 'block';
        petTypeInput.style.display = 'block';
        customPetTypeContainer.style.display = 'block';
        daysInput.style.display = 'block';
        hoursInput.style.display = 'block';
        minutesInput.style.display = 'block';
        secondsInput.style.display = 'block';
        timerSoundSelect.style.display = 'block';
    }

    function saveReminder(reminder) {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.push(reminder);
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    function loadReminders() {
        let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        for (let i = 0; i < reminders.length; i++) {
            console.log(reminders[i]);
        }
    }

    petTypeInput.addEventListener('change', () => {
        const petType = petTypeInput.value;
        if (petType === 'Custom') {
            customPetTypeContainer.style.display = 'block';
        } else {
            customPetTypeContainer.style.display = 'none';
        }
    });

    setButton.addEventListener('click', () => {
        const timeInMillis = (parseInt(daysInput.value) || 0) * 24 * 60 * 60 * 1000 +
                             (parseInt(hoursInput.value) || 0) * 60 * 60 * 1000 +
                             (parseInt(minutesInput.value) || 0) * 60 * 1000 +
                             (parseInt(secondsInput.value) || 0) * 1000;

        if (timeInMillis > 0) {
            showCountdown();
            startCountdown(timeInMillis);
        }
    });

    stopButton.addEventListener('click', () => {
        stopTimerSound();
        showSetButton();
    });

    // Load reminders when the page loads
    loadReminders();
});
