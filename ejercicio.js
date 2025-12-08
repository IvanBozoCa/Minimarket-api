//Ejercicio 1
function saludar(name){
    return (`Hola ${name}, bienvenido a JavaScript`)
}
console.log(saludar("Ivan"))

//Ejercicio 2
function esPar(num){
    if(num % 2 === 0){
        return (`El numero ${num} es par`)
    }else{
        return (`El num ${num} es impar`)
    }
}
console.log(esPar(7))

//Ejercicio 3 
function maximoDeTres(a,b,c){
    const lista = [a,b,c]
    let mayor=-5;
    for(let i = 0; i <3;i++){
        if(mayor < lista[i]){
            mayor = lista[i]
        }else{
            continue
        }

    }
    return mayor
}
console.log(maximoDeTres(10, 5, 8));
console.log(maximoDeTres(3, 9, 9));
//
//function maximoDeTres(a, b, c) {
 // return Math.max(a, b, c);
//}

//Ejercicio 4 Convertir a mayúsculas: Obtener la longitud de cadenas: 
// Mapear objetos (propiedades):Sumar un valor constante a cada elemento:
const numeros = [3, 8, 2, 10, 5, 7];
const nombres = ["ana", "luis", "maria"];

const numerosDobles = numeros.map(numero => numero*2)
console.log(numerosDobles)
const aMayuscula = nombres.map(nombre => nombre.toUpperCase())
console.log(aMayuscula)
const longitud = nombres.map(nombre => nombre.length)
console.log(longitud)

const numerosPares = numeros.filter(numero => numero%2 ===0)
console.log(numerosPares)

const sumaTotal = numeros.reduce((acumulador , valorActual) => {
    return acumulador + valorActual
},0)
console.log(sumaTotal)


//Ejercicio 5
class Usuario {
    constructor(nombre,edad,activo){
        this.nombre=nombre;
        this.edad=edad;
        this.activo=activo;
    }
    presentarUsuario(Usuario){
        let cambio = ''
        if(Usuario.activo===true){
            cambio=''
        }else{
            cambio=' NO'
        }
        console.log(`El usuario ${Usuario.nombre} tiene ${Usuario.edad} anios y${cambio} esta activo`)
    }
}
const persona1 = new Usuario("Ivan",27,false)
persona1.presentarUsuario(persona1)

//Ejercicio 5 mejorado
class Usuario2 {
    constructor(nombre,edad,activo){
        this.nombre=nombre;
        this.edad=edad;
        this.activo=activo;
    }
    presentarUsuario2(){
        const estado = this.activo?"":" NO";
        return `El usuario ${this.nombre} tiene ${this.edad} anios y${estado} esta activo`
    }
}
const persona2 = new Usuario2("Ivan",27,false)
console.log(persona2.presentarUsuario2())