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

        const petType = petTypeInput.value === 'Custom' ? customPetTypeInput.value : petTypeInput.value;
        const ownerName = ownerNameInput.value;
        const petName = petNameInput.value;

        if (timeInMillis > 0) {
            startCountdown(timeInMillis);
            countdownElement.textContent = `Reminder set for ${ownerName}'s ${petType} "${petName}"`;
            stopButton.style.display = 'block';
        }
    });

    stopButton.addEventListener('click', stopTimerSound);
});
