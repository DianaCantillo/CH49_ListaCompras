/* Primero ubique mi boton de "Agregar". Le quiero agregar una funcionalidad
de validar información. Pongo un listener, que me escuche una acción
*/

//Estas variables son globales NO locales, por eso se definen hasta arriba
const btnAgregar = document.getElementById("btnAgregar");
const btnClear = document.getElementById("btnClear")
const txtName = document.getElementById("Name");
const txtNumber = document.getElementById("Number");

const contadorProductos = document.getElementById("contadorProductos");
const productosTotal = document.getElementById("productosTotal");
const precioTotal = document.getElementById("precioTotal");

const alertValidaciones = document.getElementById("alertValidaciones")
const alertValidacionesTexto = document.getElementById("alertValidacionesTexto")
const tablaListaCompras = document.getElementById("tablaListaCompras");
const cuerpoTabla = tablaListaCompras.getElementsByTagName("tbody").item(0); //Con esta linea estoy definiendo
//el cuerpor de la tabla, que esta dentro de la tablaListaCompras (por eso no estoy poniendo document)
//agrego el metodo getElementsByTagName, que me buscará la etiqueta tbody, y como es plura, solo le estoy
//pidiendo el item 0
let cont = 0;
let costoTotal=0;
let totalEnProductos = 0;
//Esta parte corresponde a los JSON
// Esta variable datos recibirá y guardará mis datos
let datos = []

function validarCantidad(){
    if (txtNumber.value.length<=0) { //
        return false;
    }//length <=0
    if(isNaN(txtNumber.value)){ //Uso el isNaN para decir "Si no es un número"
        return false;
    }//isNaN
    if(Number(txtNumber.value)<=0){ //Convierto el string en número
        return false;
    }//validar >0

    return true;
    //2. Número
    //3. >0
}//Validar cantidad

function getPrecio(){
    return Math.round(Math.random()*10000)/100;
}

btnAgregar.addEventListener("click", function(event){
    event.preventDefault();
    let isValid = true; //Esta es una bandera, al ser true permite agregar los datos a la tabla
    txtName.value = txtName.value.trim(); /* Estas dos lineas es para quitarle espacios 
    a las entradas */
    txtNumber.value = txtNumber.value.trim(); 

//Con el siguiente parrafo quito el borde rojo y la alerta. 
//cada vez que se aprieta el botón, se limpian las alertas
    txtName.style.border = "";
    txtNumber.style.border = "";
    alertValidacionesTexto.innerHTML = "";
    alertValidaciones.style.display = "none";

    if (txtName.value.length <3){
        //1. Mostrar la alerta con el error
        //2. Borde de color rojo
        txtName.style.border = "solid red medium"
        alertValidacionesTexto.innerHTML = 
            "<strong>El nombre del producto no es correcto. </strong>";
        alertValidaciones.style.display = "block";
        isValid = false;
    }//If lenght<3

    if(!validarCantidad()){ //es decir, si regresa false
        txtNumber.style.border = "solid red medium";
        alertValidacionesTexto.innerHTML += 
            "<br/><strong>La cantidad del producto no es correcto. </strong>";
        alertValidaciones.style.display = "block";
        isValid = false;
    }//ValidarCantidad


        //Para cantidad vamos a validar tres condiciones
            //1. length>0
            //2. Número
            //3. mayor a >0

    if (isValid){
        cont++;
        let precio = getPrecio();
//Esta es mi tabla
        let row = `<tr>
                    <td>${cont}</td>
                    <td>${txtName.value}</td>
                    <td>${txtNumber.value}</td>
                    <td>${precio}</td>
                </tr>`;
//Este es un objeto en donde estoy guardando los datos. Lo definí cuando 
//empezamos con JSON
        let elemento = {"cont": cont, 
                        "nombre": txtName.value,
                        "cantidad": txtNumber.value,
                        "precio": precio
        };
//con esta linea estoy agregando los elementos del objeto anterior al arreglo que 
//definí arriba
        datos.push(elemento)
//Lo siguiente es guardarel arreglo en el almacenamiento local. Pero antes necesito
//transformar los datos en un string, por eso ocupo el stringify
        localStorage.setItem("datos", JSON.stringify(datos));
        
        cuerpoTabla.insertAdjacentHTML("beforeend", row);
//con las dos lineas de abajo hago que se actualice la tabla de resumen de 
//compra. Previamente definí las variables
        costoTotal += precio * Number(txtNumber.value);
        precioTotal.innerText = "$ " + costoTotal.toFixed(2);
        contadorProductos.innerText = cont;
//Para mostrar los productos total primero defini una variable en donde se
//guardaran los productos y se convertirá a número. Y finalmente mostrarlo
//en la casilla de productos total en la tabla
        totalEnProductos += Number(txtNumber.value);
        productosTotal.innerText = totalEnProductos;
        
        localStorage.setItem("costoTotal", costoTotal);
        localStorage.setItem("totalEnProductos", totalEnProductos);
        localStorage.setItem("cont", cont);

        txtName.value = "";
        txtNumber.value = "";
        txtName.focus();
    }// si isValid es true, es decir, no se corre ningun error, entra esta condicion que
    //nos permite agregar los elementos a la tabla


}); // btnAgregar click

btnClear.addEventListener("click", function(event){
    event.preventDefault();

    txtName.value = "";
    txtNumber.value = "";
    txtName.style.border = "";
    txtNumber.style.border = "";

    alertValidacionesTexto.innerHTML = "";
    alertValidaciones.style.display = "none";

//con las dos lineas de abajo limpio la tabla de resumen
    cont = 0;
    costoTotal=0;
    totalEnProductos = 0;

    precioTotal.innerText = "$ " + costoTotal;
    contadorProductos.innerText = cont;
    productosTotal.innerText = totalEnProductos;

    cuerpoTabla.innerText = "";

}) //btnClear click

//Con el siguiente comando hago que los datos se guarden en el localStorage
//en el window.addEventListener("load") estoy diciendo que el evento que tiene
//que escuchar es cargar la ventana
window.addEventListener("load", function(event){
    if(this.localStorage.getItem("costoTotal")!=null){
        costoTotal = Number(this.localStorage.getItem("costoTotal"));
    }//!null
    
    if(this.localStorage.getItem("totalEnProductos")!=null){
        totalEnProductos = Number(this.localStorage.getItem("totalEnProductos"));
    }//!null

    if(this.localStorage.getItem("cont")!=null){
        cont = Number(this.localStorage.getItem("cont"));
    }//!null

//Con las dos lineas de abajo, tomo el datos del local storage
    if(this.localStorage.getItem("datos")!=null){
        datos = JSON.parse(this.localStorage.getItem("datos"));
    }//!null
//Con estas lineas guardo la tabla de contenido. Cada vez que refresque la pagina 
//o salga del navegador, los datos se guardarán.
    datos.forEach((r)=>{
        let row = `<tr>
                    <td>${r.cont}</td>
                    <td>${r.nombre}</td>
                    <td>${r.cantidad}</td>
                    <td>${r.precio}</td>
                </tr>`;
        cuerpoTabla.insertAdjacentHTML("beforeend", row)

    });

    precioTotal.innerText = "$ " + costoTotal.toFixed(2);
    contadorProductos.innerText = cont;
    productosTotal.innerText = totalEnProductos;

});//window load



