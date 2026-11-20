
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
