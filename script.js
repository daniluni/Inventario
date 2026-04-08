// Datos de ejemplo (simulando bienes)
let inventario = [
    {
      id: 1,
      nombre: "Laptop Pro",
      categoria: "Electrónica",
      cantidad: 12,
      precio: 899.99,
      imagen: "laptop.jpg"
    },
    {
      id: 2,
      nombre: "Silla ergonómica",
      categoria: "Muebles",
      cantidad: 5,
      precio: 245.50,
      imagen: "silla.jpg"
    },
    {
      id: 3,
      nombre: "Monitor 24\"",
      categoria: "Electrónica",
      cantidad: 8,
      precio: 179.00,
      imagen: "monitor.jpg"
    },
    {
      id: 4,
      nombre: "Taladro percutor",
      categoria: "Herramientas",
      cantidad: 3,
      precio: 89.90,
      imagen: "taladro.jpg"
    }
  ];
  
  let nextId = 5; // para nuevos registros
  let currentEditId = null;
  let filterText = "";
  
  // Elementos DOM
  const tbody = document.getElementById("tablaInventario");
  const totalProductosSpan = document.getElementById("totalProductos");
  const valorTotalSpan = document.getElementById("valorTotal");
  const totalCategoriasSpan = document.getElementById("totalCategorias");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const openAddModalBtn = document.getElementById("openAddModalBtn");
  const saveProductBtn = document.getElementById("saveProductBtn");
  const productModal = new bootstrap.Modal(document.getElementById("productModal"));
  const modalTitle = document.getElementById("modalTitle");
  const productIdInput = document.getElementById("productId");
  const nombreInput = document.getElementById("nombre");
  const categoriaSelect = document.getElementById("categoria");
  const cantidadInput = document.getElementById("cantidad");
  const precioInput = document.getElementById("precio");
  const imagenInput = document.getElementById("imagen");
  
  // Función para actualizar KPIs
  function actualizarKPIs() {
    const total = inventario.length;
    const totalValor = inventario.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const categoriasUnicas = new Set(inventario.map(item => item.categoria));
    totalProductosSpan.textContent = total;
    valorTotalSpan.textContent = totalValor.toFixed(2);
    totalCategoriasSpan.textContent = categoriasUnicas.size;
  }
  
  // Función para obtener la ruta completa de imagen
  function getImagenSrc(imagenNombre) {
    if (!imagenNombre) return "img/default-product.png";
    // Si ya contiene "img/" no la duplicamos
    if (imagenNombre.startsWith("img/")) return imagenNombre;
    return `img/${imagenNombre}`;
  }
  
  // Renderizar tabla aplicando filtro
  function renderizarTabla() {
    let filtrados = inventario.filter(item =>
      item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.categoria.toLowerCase().includes(filterText.toLowerCase())
    );
  
    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center">No se encontraron bienes</td></tr>`;
      actualizarKPIs();
      return;
    }
  
    let html = "";
    filtrados.forEach(item => {
      const valorItem = (item.cantidad * item.precio).toFixed(2);
      const imgSrc = getImagenSrc(item.imagen);
      html += `
        <tr>
          <td><img src="${imgSrc}" alt="${item.nombre}" class="product-img" onerror="this.src='https://via.placeholder.com/50?text=No+img'"></td>
          <td><strong>${escapeHTML(item.nombre)}</strong></td>
          <td>${escapeHTML(item.categoria)}</td>
          <td>${item.cantidad}</td>
          <td>${item.precio.toFixed(2)} €</td>
          <td>${valorItem} €</td>
          <td>
            <button class="btn btn-sm btn-warning edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
    actualizarKPIs();
  
    // Agregar eventos a botones dinámicos
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        editarProducto(id);
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.getAttribute('data-id'));
        eliminarProducto(id);
      });
    });
  }
  
  // Helper para escapar HTML (seguridad)
  function escapeHTML(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
  
  // Agregar producto
  function agregarProducto(producto) {
    const nuevoProducto = {
      id: nextId++,
      nombre: producto.nombre,
      categoria: producto.categoria,
      cantidad: parseInt(producto.cantidad),
      precio: parseFloat(producto.precio),
      imagen: producto.imagen || ""
    };
    inventario.push(nuevoProducto);
    renderizarTabla();
  }
  
  // Actualizar producto existente
  function actualizarProducto(id, productoActualizado) {
    const index = inventario.findIndex(p => p.id === id);
    if (index !== -1) {
      inventario[index] = {
        ...inventario[index],
        nombre: productoActualizado.nombre,
        categoria: productoActualizado.categoria,
        cantidad: parseInt(productoActualizado.cantidad),
        precio: parseFloat(productoActualizado.precio),
        imagen: productoActualizado.imagen || ""
      };
      renderizarTabla();
    }
  }
  
  // Eliminar producto
  function eliminarProducto(id) {
    if (confirm("¿Eliminar este bien del inventario?")) {
      inventario = inventario.filter(p => p.id !== id);
      renderizarTabla();
    }
  }
  
  // Abrir modal para editar
  function editarProducto(id) {
    const producto = inventario.find(p => p.id === id);
    if (producto) {
      currentEditId = id;
      modalTitle.textContent = "Editar bien";
      productIdInput.value = producto.id;
      nombreInput.value = producto.nombre;
      categoriaSelect.value = producto.categoria;
      cantidadInput.value = producto.cantidad;
      precioInput.value = producto.precio;
      imagenInput.value = producto.imagen || "";
      productModal.show();
    }
  }
  
  // Limpiar formulario para nuevo producto
  function resetFormulario() {
    productIdInput.value = "";
    nombreInput.value = "";
    categoriaSelect.value = "";
    cantidadInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    currentEditId = null;
    modalTitle.textContent = "Agregar bien";
  }
  
  // Guardar (desde modal)
  function guardarProducto() {
    // Validaciones básicas
    if (!nombreInput.value.trim() || !categoriaSelect.value || !cantidadInput.value || !precioInput.value) {
      alert("Por favor completa todos los campos obligatorios (*)");
      return;
    }
    if (parseInt(cantidadInput.value) < 0 || parseFloat(precioInput.value) < 0) {
      alert("Cantidad y precio deben ser valores positivos");
      return;
    }
  
    const productoData = {
      nombre: nombreInput.value.trim(),
      categoria: categoriaSelect.value,
      cantidad: cantidadInput.value,
      precio: precioInput.value,
      imagen: imagenInput.value.trim()
    };
  
    if (currentEditId !== null) {
      actualizarProducto(currentEditId, productoData);
    } else {
      agregarProducto(productoData);
    }
    productModal.hide();
    resetFormulario();
  }
  
  // Evento de búsqueda
  function aplicarFiltro() {
    filterText = searchInput.value.trim();
    renderizarTabla();
  }
  
  // Event listeners
  openAddModalBtn.addEventListener("click", () => {
    resetFormulario();
    productModal.show();
  });
  
  saveProductBtn.addEventListener("click", guardarProducto);
  searchBtn.addEventListener("click", aplicarFiltro);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") aplicarFiltro();
  });
  
  // Inicializar
  document.addEventListener("DOMContentLoaded", () => {
    renderizarTabla();
  });