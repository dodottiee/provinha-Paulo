const API_THINGSPEAK = 'SJTQVQB96B47V7LB'; // Substitua pela sua chave real
let ultimoDado;

const temperaturas = [];
const umidades = [];
const labels = [];

const ctxTemp = document.getElementById('graficoTemperatura').getContext('2d');
const chartTemp = new Chart(ctxTemp, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Temperatura (°C)',
            data: temperaturas,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMin: 10,
                suggestedMax: 50
            }
        }
    }
});

const ctxUmidade = document.getElementById('graficoUmidade').getContext('2d');
const chartUmidade = new Chart(ctxUmidade, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Umidade (%)',
            data: umidades,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    }
});

// Atualiza a interface a cada 5 segundos
async function atualizarInterface() {
    try {
        const response = await fetch('http://localhost:5000/sensores');
        const data = await response.json();
        ultimoDado = data;

        console.log(data)

        document.getElementById('temperatura').innerText = `${data.temperatura} °C`;
        document.getElementById('umidade').innerText = `${data.umidade} %`;

        const presencaEl = document.getElementById('presenca');
        if (data.presenca) {
            presencaEl.innerText = "Presença detectada";
            presencaEl.className = "valor status-presenca presenca-true";
        } else {
            presencaEl.innerText = "Sem presença";
            presencaEl.className = "valor status-presenca presenca-false";
        }
            // Atualiza gráficos
            const hora = new Date().toLocaleTimeString();
            labels.push(hora);
            temperaturas.push(data.temperatura);
            umidades.push(data.umidade);

            // Mantém últimos 10 pontos
            if (labels.length > 10) {
                labels.shift();
                temperaturas.shift();
                umidades.shift();
            }
            chartTemp.update();
            chartUmidade.update();

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Envia dados para ThingSpeak a cada 15 segundos
async function enviarParaThingSpeak() {
    if (!ultimoDado) return;

    const url = `https://api.thingspeak.com/update?api_key=${API_THINGSPEAK}` +
        `&field1=${ultimoDado.temperatura}` +
        `&field2=${ultimoDado.umidade}` +
        `&field3=${ultimoDado.presenca ? 1 : 0}`;

    try {
        await fetch(url);
        console.log("Dados enviados ao ThingSpeak");
    } catch (error) {
        console.error("Erro ao enviar para ThingSpeak:", error);
    }
}

// Começa os ciclos
setInterval(atualizarInterface, 5000);  // atualiza página a cada 5s
setInterval(enviarParaThingSpeak, 15000); // envia para ThingSpeak a cada 15s

// Chamada inicial imediata
atualizarInterface();
