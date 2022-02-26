//Botonones
const botones = document.getElementsByTagName("button");
const resultado = document.getElementById("resultado");
const cadena = document.getElementById("cadena");

//Variables globales
let numero = 0;
let numeroAnterior = 0;

let numeroMostrar = "";
let numeroAnteriorMostrar = "";

let operador = "";

//Constantes
const BORRAR = "<<";
const SUMAR = "+";
const RESTAR = "-";
const MULTIPLICAR = "X";
const DIVIDIR = "/";
const DECIMAL = ",";
const IGUAL = "=";
const RAIZ = String.fromCharCode(8730) + "x";
const CUADRADO = "x2";
const PORCENTAJE = "%";
const LIMPIAR = "C";
const DENOMINADOR = "1/x";

//Uso de bandera para saber si se ha comenzado una nueva operación y asi formatear la salida
let esNuevaOperacion = false;

//Uso de bandera para cuando salta la excepción al dividir entre 0
let esInfinity = false;

//Se crea un bucle para recorrer todos los botones almacenados en 'botones'
for (const boton of botones) {
  //Para cada boton se le asigna el evento
  boton.addEventListener("click", () => {
    //Se almacena el carácter de cada botón
    const simbolo = boton.textContent;

    //Si el carácter se encuentra en el rango entre 48(0 ASCII) y 57 (9 ASCII)
    if (
      String(simbolo).charCodeAt() >= 48 &&
      String(simbolo).charCodeAt() <= 57 &&
      simbolo != DENOMINADOR
    ) {
      agregarNumero(simbolo);

      // Si el carácter es +, -, x
    } else {
      switch (simbolo) {
        case BORRAR:
          borrarDigito();
          break;

        case DECIMAL:
          agregarDecimal();
          break;

        case SUMAR:
          operacion(SUMAR);
          operador = SUMAR;
          break;

        case RESTAR:
          operacion(RESTAR);
          operador = RESTAR;
          break;

        case MULTIPLICAR:
          operacion(MULTIPLICAR);
          operador = MULTIPLICAR;
          break;

        case DIVIDIR:
          operacion(DIVIDIR);
          operador = DIVIDIR;
          break;

        case CUADRADO:
          operacion2(CUADRADO);
          break;

        case RAIZ:
          operacion2(RAIZ);
          break;

        case PORCENTAJE:
          operacion2(PORCENTAJE);
          break;

        case DENOMINADOR:
          operacion2(DENOMINADOR);
          break;

        case LIMPIAR:
          limpiar();
          break;

        case IGUAL:
          calcular();
          break;
      }
    }
  });
}

// Función para almacenar el número recibido tras el evento e ir concatenándolo
function agregarNumero(simbolo) {
  //Si se comienza una nueva operación se resetea el valor de la varibale
  //numeroMostrar para poder introducir un nuevo número
  if (esNuevaOperacion) {
    numeroMostrar = '';
    esNuevaOperacion = false;
  }

  //Quitar 0 a la izquierda
  if (numeroMostrar.startsWith('0') && !numeroMostrar.startsWith('0.')) {
    numeroMostrar = numeroMostrar.replace('0', '');
  }

  numeroMostrar += simbolo;
  actualizarResultado();
}

//Función encargada de guardar el numeroAnterior cuando se ejecuta una operación
//que incluya a numero y numeroAnterior,
//como la suma, resta...
function operacion(operacion) {
  //Si no es una nueva operación y tenemos valores tanto en numeroAnteriorMostrar
  //y numeroMostrar solo se cambiara el signo de la operación
  if (!esNuevaOperacion && numeroAnteriorMostrar != "" && numeroMostrar != "") {
    cadena.textContent = numeroAnteriorMostrar + " " + operacion;
    actualizarResultado();
    return;
  }

  //Si numeroMostrar esta vacío (resultado no muestra nada) no se altera el valor de
  //numeroAnteriorMostrar (si no quedaría algo del estilo '-' en numeroAnteriorMostrar)
  if (numeroMostrar == " ") {
    numeroAnteriorMostrar = numeroAnteriorMostrar;

    //Si numeroMostrar tiene algún valor se guardará en numeroAnteriorMostrar
  } else if (numeroMostrar != " ") {
    numeroAnteriorMostrar = numeroMostrar;
  }

  //Si numeroAnterior mostrar no tiene nigún valor se le asignará un 0
  if (numeroAnteriorMostrar == "") {
    numeroAnteriorMostrar = "0";
  }

  cadena.textContent = numeroAnteriorMostrar + " " + operacion;
  numeroMostrar = " ";
  actualizarResultado();
}

//Función para realizar operaciones que solo involucran a un solo numero (numeroMostrar)
function operacion2(operacion) {
  numero = parseFloat(numeroMostrar);
  let total = numero;
  if (operacion == RAIZ) {
    total = Math.sqrt(numero);
  } else if (operacion == CUADRADO) {
    total = Math.pow(numero, 2);
  } else if (operacion == PORCENTAJE) {
    total = numero / 100;
  } else if (operacion == DENOMINADOR) {
    console.log(numero)
    if (numero == 0) {
      resultado.textContent = 'No se puede dividir por 0';
      numeroMostrar = ' ';
      cadena.textContent = '';
      return;
    } else {
      total = 1 / numero;
    }
  }

  //Si el total no es número, no dejo que se actualice
  if (isNaN(total)) return;

  numeroMostrar = String(redondear(total));
  actualizarResultado();
}

//Cuando se ejecuta un '=' se realizara la operación correspondiente
function calcular() {
  //Realizar calculo
  numero = parseFloat(numeroMostrar);
  numeroAnterior = parseFloat(numeroAnteriorMostrar);
  let total = 0;

  if (operador == SUMAR) {
    total = numero + numeroAnterior;
  }

  if (operador == RESTAR) {
    total = numeroAnterior - numero;
  }

  if (operador == DIVIDIR) {
    if (numero == 0) {
      //Si se intenta dividir por 0 se activa la bandera esInfinity
      esInfinity = true;
    } else {
      total = numeroAnterior / numero;
    }
  }

  if (operador == MULTIPLICAR) {
    total = numero * numeroAnterior;
  }

  //Si el total no es número, no dejo que se actualice
  if (isNaN(total)) return;
  numeroMostrar = String(redondear(total));

  //Si la badnera es true, mostrara un mensaje por pantalla
  if (esInfinity) {
    resultado.textContent = 'No se puede dividir por 0';
    cadena.textContent = '';
    numeroAnteriorMostrar = '';
    esInfinity = false;
  } else {
    actualizarResultado();
  }

  //Una vez calculada la operación, será una nueva operación
  esNuevaOperacion = true;
}

//Función para borrar un dígito del número
function borrarDigito() {
  if (!esNuevaOperacion) {
    numeroMostrar = String(numeroMostrar);
    numeroMostrar = numeroMostrar.slice(0, -1);
  } else {
    numeroMostrar = "0";
  }
  actualizarResultado();
}

//Función para añadir decimal
function agregarDecimal() {
  numeroMostrar = String(numeroMostrar);
  //Si es nueva operación concatenara el . si no el numeroMostrar se resetea a 0.
  if (!esNuevaOperacion) {
    if (!numeroMostrar.includes(".")) {
      numeroMostrar += ".";
    }
  } else {
    numeroMostrar = "0.";
    esNuevaOperacion = false;
  }

  actualizarResultado();
}
//Actualizar resultado
function actualizarResultado() {
  resultado.textContent = numeroMostrar;
}

//Redondear resultado
function redondear(num) {
  var m = Number((Math.abs(num) * 10000).toPrecision(15));
  return (Math.round(m) / 10000) * Math.sign(num);
}

//Resetear calculadora
function limpiar() {
  numero = 0;
  numeroAnterior = 0;
  numeroMostrar = "0";
  numeroAnteriorMostrar = "";
  actualizarResultado();
  cadena.textContent = "";
  numeroMostrar = "";
}
