const deg = 6;
const hr = document.querySelector('#hr');
const mn = document.querySelector('#mn');
const sc = document.querySelector('#sc');

function setupWebSocket() {
    const socket = new WebSocket("ws://" + document.location.hostname + ":" + document.location.port + "/ws");

    socket.onopen = function () {
        console.log("Connection established");
    };

    socket.onmessage = event => {
        const currentTime = new Date(event.data);
        let browserOffset = currentTime.getTimezoneOffset() * 60 * 1000; // Получаем смещение в миллисекундах
        if (browserOffset < 0) {
            browserOffset *= -1;
        }

        let localTime = new Date(currentTime.getTime() + browserOffset);
        let hh = localTime.getHours() * 30;
        let mm = localTime.getMinutes() * deg;
        let ss = localTime.getSeconds() * deg;

        hr.style.transform = `rotateZ(${(hh) + (mm / 12)}deg)`;
        mn.style.transform = `rotateZ(${mm}deg)`;
        sc.style.transform = `rotateZ(${ss}deg)`;
    };

    socket.onclose = event => {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.log('Connection died');
        }
        // Переподключаемся каждые 2 секунды
        setTimeout(setupWebSocket, 2000);
    };
}

setupWebSocket();  // Инициализация WebSocket при загрузке страницы
