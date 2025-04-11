// Variável de controle para pausar/iniciar a leitura
let isPaused = false;

// Adiciona o evento de clique ao botão existente
const toggleButton = document.getElementById('toggleButton');
if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    isPaused = !isPaused;
    toggleButton.innerText = isPaused ? 'Iniciar' : 'Pausar';
  });
}

const ctx = document.getElementById('sensorChart').getContext('2d');

// Inicializa o gráfico
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Temperatura (°C)', data: [], borderColor: 'red', fill: false },
      { label: 'Umidade (%)', data: [], borderColor: 'blue', fill: false },
      { label: 'Pressão (hPa)', data: [], borderColor: 'green', fill: false },
      { label: 'Água (L)', data: [], borderColor: 'orange', fill: false },
      { label: 'Gás (ppm)', data: [], borderColor: 'purple', fill: false }
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Tempo' } },
      y: { title: { display: true, text: 'Valor' } }
    },
  },
});

// Função para verificar valores críticos
function verificarValoresCriticos(data) {
  if (data.temperatura > 149) alert('⚠️ Temperatura crítica: ' + data.temperatura + '°C');
  if (data.umidade > 189) alert('⚠️ Umidade fora do intervalo seguro: ' + data.umidade + '%');
  if (data.pressao > 1099) alert('⚠️ Pressão anormal: ' + data.pressao + ' hPa');
  if (data.agua > 499) alert('⚠️ Nível de água muito alto: ' + data.agua + ' L');
  if (data.gas > 899) alert('⚠️ Concentração de gás perigosa: ' + data.gas + ' ppm');
}

// Função para atualizar os sensores
async function atualizarSensores() {
  if (isPaused) return; // Verifica se a leitura está pausada

  try {
    const response = await fetch('http://127.0.0.1:5000/sensores');
    const data = await response.json();

    document.getElementById('temp').innerText = data.temperatura;
    document.getElementById('hum').innerText = data.umidade;
    document.getElementById('pres').innerText = data.pressao;
    document.getElementById('agua').innerText = data.agua;
    document.getElementById('gas').innerText = data.gas;

    verificarValoresCriticos(data); // Verifica se há valores críticos

    const now = new Date().toLocaleTimeString();

    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(data.temperatura);
    chart.data.datasets[1].data.push(data.umidade);
    chart.data.datasets[2].data.push(data.pressao);
    chart.data.datasets[3].data.push(data.agua);
    chart.data.datasets[4].data.push(data.gas);

    if (chart.data.labels.length > 20) {
      chart.data.labels.shift();
      chart.data.datasets.forEach((dataset) => dataset.data.shift());
    }

    chart.update();
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

// Atualiza os sensores a cada 2 segundos
setInterval(atualizarSensores, 2000);