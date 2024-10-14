const spaceId = '1i3j56vtsp8s';  // Reemplaza con tu Space ID
        const accessToken = 'sf2VQuRce-6ythMX4lQIJvPlyQB0vtx23D1IvYZhZ5o';  // Reemplaza con tu Access Token
        const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=producto`;

        let currentPage = 1; // Página actual
        const itemsPerPage = 6; // Número de productos por página
        let totalPages; // Número total de páginas

        // Función para obtener contenido de Contentful
        async function getContentfulData(page = 1) {
            try {
                const response = await fetch(url);
                const data = await response.json();

                const products = data.items;
                totalPages = Math.ceil(products.length / itemsPerPage); // Calcular el número total de páginas

                // Mostrar los productos de la página seleccionada
                displayProducts(products.slice((page - 1) * itemsPerPage, page * itemsPerPage));

                // Crear los botones de paginación
                createPaginationButtons();
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }

        // Función para mostrar los productos
        async function displayProducts(products) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Limpiar el contenido anterior

    for (const item of products) {
        const productoId = item.sys.id;  // Obtener el ID del producto
        const nombre = item.fields.nombre;
        const imageId = item.fields.imagen.sys.id;
        const imageUrl = await getImageUrl(imageId);

        // Crear un div para cada producto
        const productDiv = document.createElement('div');
        productDiv.classList.add('producto');

        // Agregar el contenido HTML
        productDiv.innerHTML = `
            <img src="${imageUrl}" alt="${nombre}" />
            <h2>${nombre}</h2>
            <button onclick="window.location.href='detalle-producto.html?id=${productoId}'">Ver más</button>
        `;
        contentDiv.appendChild(productDiv);
    }
}

        // Función para obtener la URL de la imagen a partir de su ID
        async function getImageUrl(assetId) {
            const assetUrl = `https://cdn.contentful.com/spaces/${spaceId}/assets/${assetId}?access_token=${accessToken}`;
            const assetResponse = await fetch(assetUrl);
            const assetData = await assetResponse.json();
            return assetData.fields.file.url; // Devuelve la URL de la imagen
        }

        // Función para crear los botones de paginación
        function createPaginationButtons() {
            const paginationDiv = document.getElementById('pagination');
            paginationDiv.innerHTML = ''; // Limpiar la paginación anterior

            // Botón de anterior
            const prevButton = document.createElement('button');
            prevButton.innerText = 'Anterior';
            prevButton.onclick = () => changePage(currentPage - 1);
            prevButton.disabled = currentPage === 1;
            paginationDiv.appendChild(prevButton);

            // Botones de número de página
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.innerText = i;
                pageButton.classList.toggle('active', currentPage === i);
                pageButton.onclick = () => changePage(i);
                paginationDiv.appendChild(pageButton);
            }

            // Botón de siguiente
            const nextButton = document.createElement('button');
            nextButton.innerText = 'Siguiente';
            nextButton.onclick = () => changePage(currentPage + 1);
            nextButton.disabled = currentPage === totalPages;
            paginationDiv.appendChild(nextButton);
        }

        // Función para cambiar de página
        function changePage(page) {
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            getContentfulData(currentPage);
        }

        // Llamada inicial
        getContentfulData(currentPage);