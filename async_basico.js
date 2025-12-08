//Simular una consulta a DB con Promise
const usuarios = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
  { id: 3, nombre: "María" },
];

/*Crea una función buscarUsuarioPorId(id) que:

Retorne una Promise.

Use setTimeout de 500 ms para simular que la DB se demora.

Si encuentra el usuario, resolve(usuario).

Si no lo encuentra, reject(new Error("Usuario no encontrado"))
*/
function buscarUsuarioPorId(id){
    return new Promise((resolve,reject)=>{
        for(let i =0;i<usuarios.length;i++){
            if(usuarios[i].id === id){
                return resolve(usuarios[i])
            }
        }
        reject(new Error("algo salió mal"))
    })
}
buscarUsuarioPorId(2)
  .then(u => console.log("Encontrado:", u))
  .catch(err => console.error("Error:", err.message));


//B Usar async/await sobre la funcion anterior

async function mostrarUsuario(id) {
    try{
        const usuario = await buscarUsuarioPorId(id)
        console.log("usuario: ",usuario.id,usuario.nombre)

    } catch (err){
        console.error("Error:",err.message)

    }
}
mostrarUsuario(1); // deberá mostrar usuario
mostrarUsuario(99); // deberá mostrar error
async function getUsuarioHandler(id) {
  try {
    const usuario = await buscarUsuarioPorId(id);
    return {
      status: 200,
      body: usuario,
    };
  } catch (err) {
    // aquí decides qué status devolver según el mensaje
    return {
      status: 404,
      body: { mensaje: err.message },
    };
  }
}
getUsuarioHandler(1).then(resp => console.log("handler 1:", resp));
getUsuarioHandler(99).then(resp => console.log("handler 99:", resp));
