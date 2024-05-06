let info = {};

let consultas = [];

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
        const cargarConsulta = (nombre, capital, tasa, tiempo, intereses, total) => {
            info = {nombre: nombre, capital: capital, tasa: tasa, tiempo: tiempo, intereses: intereses, total: total};
        }; 
        cargarConsulta(nombre, capitalValue, tasaValue, tiempoValue, intereses, total);
        consultas.push(info);
        alert("Su consulta fue guardada con exito");
        console.log("Consulta:", info);
    };
});

