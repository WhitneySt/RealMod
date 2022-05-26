import Get from "./helpers/get";
import Post from "./helpers/post";
import Put from "./helpers/put";
import Delete from "./helpers/delete";
import './styles.css';

const url = "https://proyecto-sprint1.herokuapp.com";

const contenedor = document.getElementById("contenedor");
const btnCart = document.getElementById("btnCart");
const btnFavorites = document.getElementById("btnFavorites");
const btnsearch = document.getElementById("btnsearch");

async function cargarPropiedades(filter = {}) {
    const loggedUser = localStorage.getItem("loggedUser") ? JSON.parse(localStorage.getItem("loggedUser")) : null;
    contenedor.innerHTML = "";
    let propiedades = await Get(`${url}/propiedades`);

    if(filter.card) {
        propiedades = propiedades.filter(p => p[filter.card] === true);
    }

    if(filter.search) {
        const { categoria = "", filter: filterParam = "", term = "" } = filter.search;
        if(!filterParam) {
            propiedades = [];
        } else {
            propiedades = propiedades.filter(element => element.categoria.toLowerCase() === categoria.toLowerCase() && element[filterParam].toString().toLowerCase().includes(term.toLowerCase()))
        }
    }

    if(propiedades.length === 0) {
        contenedor.innerHTML = `<div><h1>Lo sentimos, no hemos encontrado datos...</h1></div>`;
        return;
    }

    propiedades.forEach(element => {
        const { id, imagen, nombre, precio, categoria, tipo, ubicacion, habitaciones, banos, area } = element;
        const buttons = loggedUser && loggedUser.isAdmin ? `
            <div class="d-flex mt-3">
                <button id="btnEditar" name="${id}"
                    style="background-color: #00C194; border: #00C194; font-size: 12px;"
                    class="btn btn-secondary" type="button">Edit</button>
                <button id="btnDetalle" name="${id}"
                    style="background-color: #00C194; border: #00C194; font-size: 12px; margin-left: 1rem;"
                    class="btn btn-secondary" type="button">...More</button>
            </div>
        ` : `
            <div class="d-flex mt-3">
                <button id="btnDetalle" name="${id}"
                    style="background-color: #00C194; border: #00C194; font-size: 12px; margin-left: 12rem;"
                    class="btn btn-secondary" type="button">...More</button>
            </div>
        `;

        const removeButton = loggedUser && loggedUser.isAdmin ? `<button id="btneliminar" name="${id}" type="button" class="btn-close" aria-label="Close"></button>`: "<div></div>";

        contenedor.innerHTML += `
            <div id="property-card" class="card" style="width: 18rem;">
                <img src="${imagen}" class="card-img-top" alt="${nombre}">
                <div id="proCard" class="card-body">
                    <span id="inmueble">For ${categoria}</span>
                    <span id="valor">$${precio ? precio.toLocaleString() : precio}/mo</span>
                    ${removeButton}
                    <h5>${tipo}</h5>
                    <h6>${nombre}</h6>
                    <div id="location"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                            <path
                                d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        </svg> <span>${ubicacion}</span></div>
                    <div id="detailPro">
                        <div><img src="https://i.ibb.co/NFr2DR0/bedtag.png" alt="bedtag"><span>Beds ${habitaciones}</span>
                        </div>
                        <div><img src="https://i.ibb.co/Q9wMyk5/bathtag.png" alt="bathtag"><span>Baths
                                ${banos}</span>
                        </div>
                        <div><img src="https://i.ibb.co/hWZGR2G/areatag.png" alt="areatag"><span>${area}
                                Sqft</span>
                        </div>
                    </div>
                    ${buttons}
            </div>
            `;
    });
}

async function obtenerPropiedadSeleccionada(id) {
    const propiedades = await Get(`${url}/propiedades`);
    const propiedadSeleccionada = propiedades.find(propiedad => propiedad.id === id);
    return propiedadSeleccionada;
}

function mostrarModalPropiedad() {
    document.getElementById("exampleModal4").style.display = "block"
    document.getElementById("exampleModal4").classList.add("show");
}

function ocultarModalPropiedad() {
    document.getElementById("exampleModal4").style.display = "none"
    document.getElementById("exampleModal4").classList.remove("show");
}

function obtenerCardActiva(elementId, activeClassName) {
    const container = document.getElementById(elementId);
    const children = Object.values(container.children);
    const activo = children.find(child => child.classList.contains(activeClassName));
    return activo;
}

const findActiveElement = (elementId, activeClassName) => {
    const container = document.getElementById(elementId);
    const children = Object.values(container.children);

    if(children.length === 0) {
        return null;
    }

    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const grandChildren = Object.values(child.children);
        const activeElement = grandChildren.find(grandChild => grandChild.classList.contains(activeClassName));
        if(activeElement) {
            return activeElement;
        }
    }

    return null;
}

function configurarFiltros() {
    // Configurando filters in search
    ["Sell", "Buy", "Rent"].forEach(buttonName => {
        const btn = document.getElementById(buttonName);
        btn.addEventListener("click", async ({ target }) => {
            const containerClass = "sbrmenu";
            const activeClassName = "activo2";
            const activeElement = findActiveElement(containerClass, activeClassName);

            if(target.id === "Sell") {
                activeElement.classList.remove(activeClassName);
                target.classList.add(activeClassName);
            }

            if(target.id === "Buy") {
                activeElement.classList.remove(activeClassName);
                target.classList.add(activeClassName);
            }

            if(target.id === "Rent") {
                activeElement.classList.remove(activeClassName);
                target.classList.add(activeClassName);
            }
        });
    });

    // Configurando filter cards
    ["parking-area", "swimming-area", "security", "medical", "library", "beds", "smart", "playland"].forEach(buttonName => {
        const btn = document.getElementById(buttonName);
        btn.addEventListener("click", async ({ target }) => {
            const activeClassName = "activo3";
            const card = document.getElementById(`fc-${target.id}`);
            const activeCard = obtenerCardActiva("filterCardsContainer", activeClassName);

            if(target.id === "parking-area") {
                await cargarPropiedades({ card: "parqueadero"});
            }
            if(target.id === "swimming-area") {
                await cargarPropiedades({ card: "piscina"});
            }
            if(target.id === "security") {
                await cargarPropiedades({ card: "seguridad"});
            }
            if(target.id === "medical") {
                await cargarPropiedades({ card: "centroMedico"});
            }
            if(target.id === "library") {
                await cargarPropiedades({ card: "libreria"});
            }
            if(target.id === "beds") {
                await cargarPropiedades({ card: "camaKing"});
            }
            if(target.id === "smart") {
                await cargarPropiedades({ card: "inteligente"});
            }
            if(target.id === "playland") {
                await cargarPropiedades({ card: "juegos"});
            }

            activeCard.classList.remove(activeClassName);
            card.classList.add(activeClassName);
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await cargarPropiedades();
});

// Agregar carrito o favoritos y abrir o cerrar detalles de la propiedad
contenedor.addEventListener("click", async ({ target }) => {
    const id = parseInt(localStorage.getItem("idPropiedad"));

    if (target.id === "btnCarrito") {
        try {
            const propiedadSeleccionada = await obtenerPropiedadSeleccionada(id);
            // Buscar en el carrito a ver si ya existe un item con este id seleccionado
            await Post(`${url}/carrito`, propiedadSeleccionada);
            swal("Bien hecho!", "Agregado al carrito correctamente!", "success");
        } catch (error) {
            swal("Oh oh!", "Ocurrio un error al agregar al carrito, Por favor comuniquese con el administrador del sistema.", "error");
        }
    }

    if (target.id === "btnFavoritos") {
        try {
            const propiedadSeleccionada = await obtenerPropiedadSeleccionada(id);
            // Buscar en favoritos a ver si ya existe un item con este id seleccionado
            await Post(`${url}/favoritos`, propiedadSeleccionada);
            swal("Bien hecho!", "Agregado a favoritos correctamente!", "success");
        } catch (error) {
            swal("Oh oh!", "Ocurrio un error al agregar a favoritos, Por favor comuniquese con el administrador del sistema.", "error");
        }
    }

    if (target.id === "btnDetalle") {
        const idPropiedadSeleccionada = parseInt(target.name);
        const propiedad = await obtenerPropiedadSeleccionada(idPropiedadSeleccionada);
        const { id, imagen, nombre, precio, categoria, tipo, ubicacion, habitaciones, banos, area, inteligente, parqueadero, piscina, seguridad, centroMedico, libreria, juegos, camaKing } = propiedad;
        
        localStorage.setItem("idPropiedad", id);

        contenedor.innerHTML = `
        <div class="d-flex flex-column mb-3">
            <img class="img-fluid img-thumbnail mt-3"
                src="${imagen}" class="card-img-top"
                alt="propiedad">
            <h5 style="color: #00C194;" class="mt-2">${nombre}</h5>
            <h6 class="mt-3">${tipo}</h6>
            <div id="location"><svg xmlns="http://www.w3.org/2000/svg" width="16"
                    height="16" fill="currentColor" class="bi bi-geo-alt"
                    viewBox="0 0 16 16">
                    <path
                        d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                    <path
                        d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg> <span>${ubicacion}</span></div>
            <h5 style="color: #00C194;" class="mt-3">For ${categoria}</h5>
            <h6 class="mt-3">$${precio ? precio.toLocaleString(): precio }/mo</h6>
            <div id="detailPro">
                <div><img src="https://i.ibb.co/NFr2DR0/bedtag.png"
                        alt="bedtag"><span>Beds ${habitaciones}</span>
                </div>
                <div><img src="https://i.ibb.co/Q9wMyk5/bathtag.png"
                        alt="bathtag"><span>Baths
                        ${banos}</span>
                </div>
                <div><img src="https://i.ibb.co/hWZGR2G/areatag.png"
                        alt="areatag"><span>${area}
                        Sqft</span>
                </div>
            </div>
            <ul style="list-style: none;" class="mt-2 gap-2">
                <li>Is it a smart home?: <span style="color: #00C194;">${inteligente}</span></li>
                <li>Does it have parking space?: <span
                        style="color: #00C194;">${parqueadero ? "Yes" : "No"}</span></li>
                <li>Does it have swimming pool?: <span
                        style="color: #00C194;">${piscina ? "Yes" : "No"}</span></li>
                <li>Does it have privat security?: <span
                        style="color: #00C194;">${seguridad ? "Yes" : "No"}</span></li>
                <li>Does it have medical center?: <span
                        style="color: #00C194;">${centroMedico ? "Yes" : "No"}</span></li>
                <li>Does it have library area?: <span
                        style="color: #00C194;">${libreria ? "Yes" : "No"}</span></li>
                <li>Does it have kid's playlands?: <span
                        style="color: #00C194;">${juegos ? "Yes" : "No"}</span></li>
                        <li>Does it have king size beds?: <span
                        style="color: #00C194;">${camaKing ? "Yes" : "No"}</span></li>        
            </ul>
            <div class="d-flex mt-3 gap-3">
                <button id="btnFavoritos" style="background-color: #00C194; border: #00C194;" type="button"
                    class="btn btn-secondary align-self-end">Add to favorites</button>
                <button id="btnCarrito" style="background-color: #00C194; border: #00C194;" type="button"
                    class="btn btn-secondary align-self-end">Add to cart</button>
            </div>
            <button id="cerrarDetalle" style="background-color: #00C194; border: #00C194;" type="button"
                    class="btn btn-secondary align-self-end">Close</button>        
        </div>
        `;
    }

    if (target.id === "cerrarDetalle") {
        await cargarPropiedades();
    }

    if(target.id === "btnEditar") {
        const idPropiedadSeleccionada = parseInt(target.name);
        const propiedad = await obtenerPropiedadSeleccionada(idPropiedadSeleccionada);
        const { id, precio, imagen, nombre, categoria = "", tipo = "", ubicacion, habitaciones, banos, area, inteligente, parqueadero, piscina, seguridad, centroMedico, libreria, juegos, camaKing } = propiedad;

        localStorage.setItem("idPropiedad", id);
        document.getElementById("actionType").value = "editProperty";

        document.getElementById("propertyName").value = nombre;
        document.getElementById("url").value = imagen;
        document.getElementById("location").value = ubicacion;
        document.getElementById("bathrooms").value = banos;
        document.getElementById("rooms").value = habitaciones;
        document.getElementById("squareMeters").value = area;
        document.getElementById("price").value = precio;
        document.getElementById("propertyType").value = tipo;
        document.getElementById("category").value = categoria;
        document.getElementById("smartHome").checked = inteligente;
        document.getElementById("parkingSpace").checked = parqueadero;
        document.getElementById("swimmingPool").checked = piscina;
        document.getElementById("privateSecurity").checked = seguridad;
        document.getElementById("medicalCenter").checked = centroMedico;
        document.getElementById("libraryArea").checked = libreria;
        document.getElementById("kingSize").checked = camaKing;
        document.getElementById("kidsPlayland").checked = juegos;

        mostrarModalPropiedad();
    }

    if(target.id === "btneliminar"){
        swal({
            title: "Estas seguro de borrar esta propiedad?",
            text: "Una vez eliminada, no vas a poder recuperarla!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then(async (willDelete) => {
        if (willDelete) {
            await Delete(`${url}/propiedades/${target.name}`)
            swal("Bien hecho!", "Propiedad eliminada correctamente", "success");
            await cargarPropiedades();            
        } 
        }).catch(error => {
            swal("Oh oh!", "Ocurrio un error al eliminar la propiedad. Por favor comuniquese con el administrador del sistema.", "error");
        });
    }
});

const btnCloseModalPropiedad = document.getElementById("btnCloseModal4");
btnCloseModalPropiedad.addEventListener("click", () => {
    ocultarModalPropiedad();
});

const btnCloseModalPropiedad2 = document.getElementById("btnCloseModal4-2");
btnCloseModalPropiedad2.addEventListener("click", () => {
    ocultarModalPropiedad();
});

const textbtn = document.getElementById("textbtn");
textbtn.addEventListener("click", () => {
    document.getElementById("actionType").value = "addProperty";
    mostrarModalPropiedad();
});

btnCart.addEventListener("click", async () => {
    const contenidoCarrito = document.getElementById("contenidoCarrito");
    contenidoCarrito.innerHTML = "";

    const carrito = await Get(`${url}/carrito`);
    carrito.forEach(element => {
        const { id, imagen, nombre, precio } = element;
        contenidoCarrito.innerHTML += `
            <tr>
                <td><img class="img-fluid"
                        src="${imagen}"
                        class="card-img-top" alt="${nombre}"></td>
                <td style="font-size: 14px;">${nombre}</td>
                <td style="font-size: 13px;">$${precio ? precio.toLocaleString() : precio }</td>
                <td><button style="background-color: #01AC84; border: #01AC84;"
                        type="button"
                        class="btn btn-primary">Remove</button><button
                        style="background-color: #00C194; border: #00C194;"
                        type="button" class="btn btn-primary mt-1">Buy</button>
                </td>
            </tr>
        `;
    });
});

btnFavorites.addEventListener("click", async () => {
    const contenidoFavoritos = document.getElementById("contenidoFavoritos");
    contenidoFavoritos.innerHTML = "";

    const carrito = await Get(`${url}/favoritos`);
    carrito.forEach(element => {
        const { id, imagen, nombre, precio } = element;
        contenidoFavoritos.innerHTML += `
            <tr>
                <td><img class="img-fluid"
                        src="${imagen}"
                        class="card-img-top" alt="${nombre}"></td>
                <td>${nombre}</td>
                <td>$${precio ? precio.toLocaleString() : precio }</td>
                <td><button style="background-color: #00C194; border: #00C194;"
                        type="button" class="btn btn-primary">Remove</button>
                </td>
            </tr>
        `;
    });
});

btnsearch.addEventListener("click", async () => {
    const containerClass = "sbrmenu";
    const activeClassName = "activo2";
    const filtersSelect = document.getElementById('inputGroupSelect01');
    const searchInput = document.getElementById("searchInput").value;

    const selectedIndex = filtersSelect.selectedIndex;
    const filter = filtersSelect.options[selectedIndex].value;
    const activeElement = findActiveElement(containerClass, activeClassName);

    const params = {
        categoria: activeElement.id,
        filter,
        term: searchInput
    };

    await cargarPropiedades({ search: params});
});

const frmCreateUser = document.getElementById("frmCreateUser");
frmCreateUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('userPassword').value;
        const isAdmin = document.getElementById('isAdmin').checked;
    
        const infoUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password,
            isAdmin
        }

        await Post(`${url}/users`, infoUser);
        swal("Bien hecho!", "Usuario creado correctamente!", "success");    
    } catch (error) {
        swal("Oh oh!", "Ocurrio un error al crear el usuario, Por favor comuniquese con el administrador del sistema.", "error");
    }
});

const frmLogin = document.getElementById("frmLogin");
frmLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const users = await Get(`${url}/users`);

        if(users.length === 0) {
            swal("Mmmm!", "El usuario no existe, por favor registrese!", "info");    
            return;
        }

        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if(!user) {
            swal("Mmmm!", "El usuario no existe, por favor registrese!", "info");    
            return;
        }

        localStorage.setItem("loggedUser", JSON.stringify(user));
        await cargarPropiedades();
        swal("Bien hecho!", "Usuario logueado correctamente!", "success");
    } catch (error) {
        console.log(error);
        swal("Oh oh!", "Ocurrio un error al crear el usuario, Por favor comuniquese con el administrador del sistema.", "error");
    }
});

const frmPropiedad = document.getElementById("frmProperty");
frmPropiedad.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const addProperty = document.getElementById("actionType").value;
        const name = document.getElementById("propertyName").value;
        const imageUrl = document.getElementById("url").value;
        const location = document.getElementById("location").value;
        const bathrooms = document.getElementById("bathrooms").value;
        const rooms = document.getElementById("rooms").value;
        const squareMeters = document.getElementById("squareMeters").value;
        const price = document.getElementById("price").value;
        const propertyType = document.getElementById("propertyType").value;
        const category = document.getElementById("category").value;
        const smartHome = document.getElementById("smartHome").checked;
        const parkingSpace = document.getElementById("parkingSpace").checked;
        const swimmingPool = document.getElementById("swimmingPool").checked;
        const privateSecurity = document.getElementById("privateSecurity").checked;
        const medicalCenter = document.getElementById("medicalCenter").checked;
        const libraryArea = document.getElementById("libraryArea").checked;
        const kingSize = document.getElementById("kingSize").checked;
        const kidsPlayland = document.getElementById("kidsPlayland").checked;
        
        const propertyInfo = {
            nombre: name,
            imagen: imageUrl,
            ubicacion: location,
            banos: bathrooms,
            habitaciones: rooms,
            area: squareMeters,
            precio: price ? parseInt(price) : 0,
            tipo: propertyType,
            categoria: category,
            inteligente: smartHome,
            parqueadero: parkingSpace,
            piscina: swimmingPool,
            seguridad: privateSecurity,
            centroMedico: medicalCenter,
            libreria: libraryArea,
            camaKing: kingSize,
            juegos: kidsPlayland
        }

        let mensaje = "";
        if(addProperty === "addProperty") {
            await Post(`${url}/propiedades`, propertyInfo);
            mensaje = "Propiedad creada correctamente!";
        } else {
            const propertyId = localStorage.getItem("idPropiedad");
            await Put(`${url}/propiedades/${propertyId}`, propertyInfo);
            mensaje = "Propiedad modificada correctamente!";
        }

        await cargarPropiedades();
        swal("Bien hecho!", mensaje , "success");
    } catch (error) {
        console.log(error);
        swal("Oh oh!", "Ocurrio un error al modificar la propiedad. Por favor comuniquese con el administrador del sistema.", "error");
    }
});

configurarFiltros()