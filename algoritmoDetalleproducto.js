const spaceId = '1i3j56vtsp8s';  // Reemplaza con tu Space ID
        const accessToken = 'sf2VQuRce-6ythMX4lQIJvPlyQB0vtx23D1IvYZhZ5o';  // Reemplaza con tu Access Token

        // Obtener el ID del producto desde la URL
        const params = new URLSearchParams(window.location.search);
        const productoId = params.get('id');  // ID del producto

        // Función para obtener detalles de un producto por su ID
        async function getProductDetails(productoId) {
            const url = `https://cdn.contentful.com/spaces/${spaceId}/entries/${productoId}?access_token=${accessToken}`;
            try {
                const response = await fetch(url);
                const productData = await response.json();
                
                // Obtener los datos del producto
                const nombre = productData.fields.nombre;
                const descripcion = productData.fields.descripcion;
                const precio = productData.fields.precio;
                const imageId = productData.fields.imagen.sys.id;
                const imageUrl = await getImageUrl(imageId);

                // Mostrar los detalles en la página
                const productDiv = document.getElementById('detalle-producto');
                productDiv.innerHTML = `
                    <img src="${imageUrl}" alt="${nombre}" />
                    <h1>${nombre}</h1>
                    <p>${descripcion}</p>
                    <p>Precio: ${precio}</p>
                `;
            } catch (error) {
                console.error('Error al obtener los detalles del producto:', error);
            }
        }

        // Función para obtener la URL de la imagen a partir de su ID
        async function getImageUrl(assetId) {
            const assetUrl = `https://cdn.contentful.com/spaces/${spaceId}/assets/${assetId}?access_token=${accessToken}`;
            const assetResponse = await fetch(assetUrl);
            const assetData = await assetResponse.json();
            return assetData.fields.file.url; // Devuelve la URL de la imagen
        }

        // Llamada para obtener los detalles del producto
        getProductDetails(productoId);