const inputForm = document.getElementById('form');
const resultsDiv = document.getElementById('results');
const autoSaveCheckbox = document.getElementById('autoSave');
const consultaNameInput = document.getElementById('consultaName');
const searchInput = document.getElementById('searchInput');
const monedaSelect = document.getElementById('moneda');

inputForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const capital = document.getElementById('capi');
    const tasa = document.getElementById('tasa');
    const tiempo = document.getElementById('dias');
    const moneda = document.getElementById('moneda');

    const capitalValue = capital.valueAsNumber;
    const tasaValue = tasa.valueAsNumber;
    const tiempoValue = tiempo.valueAsNumber;
    const monedaValue = moneda.value;

    if (capitalValue == 0 || capitalValue < 0) {
        alert("El capital inicial no puede ser 0 ni negativo. Por favor ingrese un valor válido");
        return;
    }

    const calcularIntereses = (capital, tasa, tiempo) => capital * (((tasa / 100) * tiempo) / 365);
    const redondear = numero => numero.toFixed(2);

    const intereses = redondear(calcularIntereses(capitalValue, tasaValue, tiempoValue));
    const total = redondear(capitalValue + calcularIntereses(capitalValue, tasaValue, tiempoValue));

    const resultsMensaje = `Los intereses generados van a ser ${intereses} ${monedaValue}, llevando a un total de ${total} ${monedaValue}`;
    resultsDiv.innerHTML = `<p>${resultsMensaje}</p>`;

    if (autoSaveCheckbox.checked) {
        const nombre = consultaNameInput.value.trim();
        if (!nombre) {
            alert("Debe ingresar un nombre para guardar la consulta");
            return;
        }
        saveConsultation(nombre, capitalValue, tasaValue, tiempoValue, intereses, total, monedaValue);
    }
});

function saveConsultation(nombre, capital, tasa, tiempo, intereses, total, moneda) {
    const consultation = { nombre, capital, tasa, tiempo, intereses, total, moneda };
    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultation),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

const dropdownItems = document.querySelectorAll('.dropdown-item');

dropdownItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const moneda = this.getAttribute('data-moneda');
        console.log(`Selected Moneda: ${moneda}`);
        showConsultasByMoneda(moneda);
    });
});

async function showConsultasByMoneda(moneda) {
    const searchTerm = moneda.toLowerCase();
    try {
        const response = await fetch(`http://localhost:3000/search?keyword=${searchTerm}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        resultsDiv.innerHTML = '';
        data.forEach(consulta => {
            const consultaString = `Nombre: ${consulta.nombre}, Capital: ${consulta.capital}, Tasa: ${consulta.tasa}, Tiempo: ${consulta.tiempo}, Intereses: ${consulta.intereses}, Total: ${consulta.total}, Moneda: ${consulta.moneda}`;
            const consultaElement = document.createElement('p');
            consultaElement.textContent = consultaString;
            resultsDiv.appendChild(consultaElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};









