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