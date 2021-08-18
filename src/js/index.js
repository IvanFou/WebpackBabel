
import '../SASS/styles.scss'

addEventListener('DOMContentLoaded',()=> {
    const btn_menu = document.querySelector('.btn_menu')
    if (btn_menu){
        btn_menu.addEventListener('click', ()=>{
            const seccionesNavBar = document.querySelector('secciones-navbar')
            seccionesNavBar.classList.toggle('show')
        })
    }
})

const buscarBar = document.getElementById('search_bar'),
    enviarBtn = document.getElementById('submit_btn'),
    randomBtn = document.getElementById('random_btn'),
    resultadoPlatillos = document.getElementById('platillos-encontrados'),
    avisoBusqueda = document.getElementById('mensaje-buscar'),
    detallesPlatillo = document.getElementById('platillo-seleccionado');


// Buscar Platillo API
const buscarPlatillo = event => {
    event.preventDefault();

    // Borra el contenido del platillo antes seleccionado
    detallesPlatillo.innerHTML = '';

    // Contenido de la barra de busqueda
    const busqueda = buscarBar.value;

    // Si no esta vacia la respues hace los div con la info de las comidas
    if (busqueda.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${busqueda}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                avisoBusqueda.innerHTML = '';
                avisoBusqueda.innerHTML = `<h3>Resultados para: '${busqueda}'</h3>`;

                if (data.meals === null) {
                    avisoBusqueda.innerHTML = `<p>No se encontraron resultados. Intente usando una sola palabra.<p>`;
                    resultadoPlatillos.innerHTML = '';
                } else {
                    resultadoPlatillos.innerHTML = data.meals
                        .map(meal => `
                    <div class="meal">
                     <div class="meal__images" >
                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" id-meal-img="${meal.idMeal}"/>
                      <div class="meal-info" >
                        <h5 id-meal-name="${meal.idMeal}">${meal.strMeal}</h5>
                      </div>
                    </div>
                    </div>
                  `).join('');
                }
            });
        // Limpia barra de busqueda
        buscarBar.value = '';
    } else {
        buscarBar.placeholder = 'Busca el platillo usando una palabra';
        avisoBusqueda.innerHTML = `<p>Utilice una palabra para iniciar la busqueda<p>`;
        setTimeout(() => {
            avisoBusqueda.innerHTML = '';
        }, 3000);
    }
};


// Trae la informacion de un platillo Random y lo agrega
const buscarPlatilloRandom = (e) => {
    resultadoPlatillos.innerHTML = '';
    avisoBusqueda.innerHTML = '';
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            agregarElemento(meal);
        });

};

// Trae la informacion del platillo dado su Id y lo agrega
const encontrarPlatilloPorId = idMeal => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];
            agregarElemento(meal);
        });
};

const extraerIngredientes = meal => {
    const ingredientes = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientes.push(`${meal[`strIngredient${i}`]}: <br> ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
}
// Agrega el elemento al DOM de la pagina
const agregarElemento = meal => {
    const ingredientesArray = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredientesArray.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    detallesPlatillo.innerHTML = `
        <div class="platillo-seleccionado-detalles">
         <h2>Receta</h2>
            <div class="platillo-container">
            <img class="platillo-img" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="platillo-seleccionado-cat-area">
                <h3>${meal.strMeal}</h3>
                    ${meal.strCategory ? `<p>Categoría - ${meal.strCategory}</p>` : ''}
                    ${meal.strArea ? `<p>Área - ${meal.strArea}</p>` : ''}
                </div>
            </div>
           
            <div class="platillo-seleccionado-instrucciones">
                <h2>Instrucciones:</h2>
                <p>${meal.strInstructions}</p>
                <h2>Ingredientes:</h2>
                <ul>
                    ${ingredientesArray.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;
};

// Event listeners
enviarBtn.addEventListener('submit', buscarPlatillo);

randomBtn.addEventListener('click', buscarPlatilloRandom);

resultadoPlatillos.addEventListener('click', event => {
    if (event.target.getAttribute('id-meal-name')) {
        const idMeal = event.target.getAttribute('id-meal-name');
        encontrarPlatilloPorId(idMeal);
    }
    if (event.target.getAttribute('id-meal-img')) {
        const idMeal = event.target.getAttribute('id-meal-img');
        encontrarPlatilloPorId(idMeal);
    }
});