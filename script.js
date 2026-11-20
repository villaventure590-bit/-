
const rakatNumber = document.getElementById("rakatNumber");
const statusText = document.getElementById("status");

// ہر رکعت کا الگ وائبریشن سگنل
function testRakat(number) {

    rakatNumber.textContent = number;

    statusText.textContent = "رکعت نمبر " + number + " کا سگنل";

    if ("vibrate" in navigator) {

        let signals = {
            1: [200],
            2: [200, 150, 200],
            3: [200, 150, 200, 150, 200],
            4: [200, 150, 200, 150, 200, 150, 200]
        };

        navigator.vibrate(signals[number]);

    } else {

        statusText.textContent =
            "آپ کا براؤزر وائبریشن سپورٹ نہیں کرتا۔";
    }
}

// نماز مکمل ہونے کا الگ سگنل
function testSalam() {

    statusText.textContent = "نماز مکمل ہونے کا سگنل";

    if ("vibrate" in navigator) {
        navigator.vibrate([500, 250, 500]);
    }
}
// vice strat 

async function startMicTest() {
    const micStatus = document.getElementById("micStatus");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        micStatus.textContent = "مائیک کامیابی سے چل رہا ہے! 🎤";

        stream.getTracks().forEach(track => track.stop());

    } catch (error) {
        micStatus.textContent = "مائیک کی اجازت نہیں ملی۔";
    }
}

async function listenToMicrophone() {
    const micStatus = document.getElementById("micStatus");

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        const audioContext = new AudioContext();
        const microphone = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        microphone.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        function checkSound() {
            analyser.getByteFrequencyData(data);

            const volume = data.reduce((a, b) => a + b, 0) / data.length;

            micStatus.textContent =
                "Microphone active — Sound level: " + Math.round(volume);

            requestAnimationFrame(checkSound);
        }

        checkSound();

    } catch (error) {
        micStatus.textContent = "Microphone error: " + error.message;
    }
}

