
// =====================================
// عِش اللحظة — Prayer Test System
// =====================================

const rakatNumber = document.getElementById("rakatNumber");
const statusText = document.getElementById("status");

// =====================================
// 1. MANUAL RAKAT VIBRATION TEST
// =====================================

window.testRakat = function (number) {
    rakatNumber.textContent = number;
    statusText.textContent = "رکعت نمبر " + number + " کا سگنل";

    if ("vibrate" in navigator) {
        const signals = {
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
};

// =====================================
// 2. SALAM VIBRATION TEST
// =====================================

window.testSalam = function () {
    statusText.textContent = "نماز مکمل ہونے کا سگنل";

    if ("vibrate" in navigator) {
        navigator.vibrate([500, 250, 500]);
    }
};

// =====================================
// 3. PRAYER STAGE TEST PANEL
// =====================================

const prayerStages = [
    "Qiyam — قیام",
    "Ruku — رکوع",
    "Sajdah — سجدہ",
    "Qa'dah — قعدہ",
    "Salam — سلام"
];

const stageBox = document.getElementById("prayerStage");
const stageStatus = document.getElementById("stageStatus");
const stageRakatStatus = document.getElementById("rakatStatus");

if (stageBox) {
    const stageTestPanel = document.createElement("div");
    stageTestPanel.className = "stage-test-panel";

    const stageTitle = document.createElement("h3");
    stageTitle.textContent = "Stage Test";

    stageTestPanel.appendChild(stageTitle);

    prayerStages.forEach((stage, index) => {
        const button = document.createElement("button");

        button.className = "stage-test-button";
        button.textContent = stage;

        button.addEventListener("click", () => {
            window.testPrayerStage(index);
        });

        stageTestPanel.appendChild(button);
    });

    stageBox.appendChild(stageTestPanel);
}

window.testPrayerStage = function (index) {
    const selectedStage = prayerStages[index];

    if (!selectedStage) return;

    if (stageStatus) {
        stageStatus.textContent = "Test stage: " + selectedStage;
    }

    if (stageRakatStatus) {
        stageRakatStatus.textContent =
            "Rak‘at count abhi automatic confirm nahi hota.";
    }

    console.log("Manual prayer stage test:", selectedStage);
};

// =====================================
// 4. MICROPHONE SOUND-LEVEL TEST
// =====================================

let micStream = null;
let micAudioContext = null;
let micAnimationFrame = null;

window.listenToMicrophone = async function () {
    const micStatus = document.getElementById("micStatus");

    // Agar mic already running ho to dobara start na karein
    if (micStream) {
        micStatus.textContent = "Microphone already active.";
        return;
    }

    try {
        micStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        micAudioContext = new AudioContext();

        const microphone =
            micAudioContext.createMediaStreamSource(micStream);

        const analyser = micAudioContext.createAnalyser();
        analyser.fftSize = 256;

        microphone.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        micStatus.textContent = "Microphone active — Sound level: 0";

        function checkSound() {
            if (!micStream) return;

            analyser.getByteFrequencyData(data);

            const volume =
                data.reduce((total, value) => total + value, 0)
                / data.length;

            micStatus.textContent =
                "Microphone active — Sound level: " +
                Math.round(volume);

            micAnimationFrame = requestAnimationFrame(checkSound);
        }

        checkSound();

    } catch (error) {
        micStatus.textContent = "Microphone error: " + error.message;
        console.error(error);
        window.stopMicrophoneTest();
    }
};

// =====================================
// 5. STOP MICROPHONE SOUND-LEVEL TEST
// =====================================

window.stopMicrophoneTest = function () {
    const micStatus = document.getElementById("micStatus");

    if (micAnimationFrame !== null) {
        cancelAnimationFrame(micAnimationFrame);
        micAnimationFrame = null;
    }

    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }

    if (micAudioContext) {
        micAudioContext.close();
        micAudioContext = null;
    }

    if (micStatus) {
        micStatus.textContent = "Microphone test stopped.";
    }
};
