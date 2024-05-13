const inputForm = document.getElementById('form');
const resultsDiv = document.getElementById('results');

inputForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const capital = document.getElementById('capi');
    const tasa = document.getElementById('tasa');
    const tiempo = document.getElementById('dias');

    const capitalValue = capital.valueAsNumber;
    const tasaValue = tasa.valueAsNumber;
    const tiempoValue = tiempo.valueAsNumber;

    if (capitalValue == 0 || capitalValue < 0) {
        alert("El capital inicial no puede ser 0 ni negativo. Por favor ingrese un valor válido");
        return;
    };
    const calcularIntereses = (capital, tasa, tiempo) => capital * (((tasa/100) * tiempo)/365);

    const redondear = numero => numero.toFixed(2);

    const intereses = redondear(calcularIntereses(capitalValue, tasaValue, tiempoValue));

    const total = redondear(capitalValue + calcularIntereses(capitalValue, tasaValue, tiempoValue));

    const resultsMensaje = "Los intereses generados van a ser " + intereses + " pesos, llevando a un total de " + total + " pesos";

    resultsDiv.innerHTML = `<p>${resultsMensaje}</p>`;

    const guardar = confirm("¿Quiere guardar esta consulta?");
    if (guardar) {
        const nombre = prompt("Ingrese un nombre para esta consulta");
        if (nombre) {
            const consulta = {nombre: nombre, capital: capitalValue, tasa: tasaValue, tiempo: tiempoValue, intereses: intereses, total: total};
            localStorage.setItem(nombre, JSON.stringify(consulta));
            alert("Su consulta fue guardada con éxito en el almacenamiento local");
        } else {
            alert("Debe ingresar un nombre para guardar la consulta");
        }
    };
});

function searchConsultationByName(keyword) {
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const consulta = JSON.parse(localStorage.getItem(key));

        if (key.includes(keyword)) {
            const consultaString = `Nombre: ${consulta.nombre}, Capital: ${consulta.capital}, Tasa: ${consulta.tasa}, Tiempo: ${consulta.tiempo}, Intereses: ${consulta.intereses}, Total: ${consulta.total}`;
            const consultaElement = document.createElement('p');
            consultaElement.textContent = consultaString;
            resultsDiv.appendChild(consultaElement);
        }
    }
}

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.trim();
    searchConsultationByName(searchTerm);
});

