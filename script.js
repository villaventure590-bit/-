
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


function listenToMicrophone() {
    const micStatus = document.getElementById("micStatus");

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        micStatus.textContent =
            "Aapka browser speech recognition support nahi karta.";
        return;
    }

    const recognition = new SpeechRecognition();
recognition.lang = "ar-SA";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        micStatus.textContent = "عربی آواز سن رہا ہے...";
    };

 
recognition.onresult = function (event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {

        if (!event.results[i].isFinal) continue;

        let text = event.results[i][0].transcript;

        // Arabic ke mukhtalif likhne ke tareeqon ko normalize karein
        text = text
            .replace(/[\u064B-\u065F\u0670]/g, "")
            .replace(/ـ/g, "")
            .replace(/[أإآٱ]/g, "ا")
            .replace(/ى/g, "ي")
            .replace(/ک/g, "ك")
            .trim();

        if (/الله\s*اكبر/.test(text)) {
            micStatus.textContent = "الله أكبر پہچان لیا گیا!";
        }
    }
};


    recognition.onerror = function (event) {
        micStatus.textContent = "Recognition error: " + event.error;
    };

    recognition.start();
}


