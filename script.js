const API_URL = "https://dummyjson.com/products/category/smartphones";
const phonesContainer = document.querySelector(".phones-container");
const modal = document.getElementById("modal");
const modalBody = document.querySelector(".modal-body");
const closeModal = document.querySelector(".close-modal");

// Función async para obtener teléfonos
async function fetchPhones() {
  try {
    phonesContainer.innerHTML = "<p class='loading'>Cargando teléfonos...</p>";
    const response = await fetch(API_URL);
    
    if (!response.ok) throw new Error("Error al cargar los teléfonos");
    
    const data = await response.json();
    renderPhones(data.products);
  } catch (error) {
    phonesContainer.innerHTML = `<p class='error'>${error.message}</p>`;
  }
}

// Renderizar tarjetas básicas
function renderPhones(phones) {
  if (phones.length === 0) {
    phonesContainer.innerHTML = "<p class='error'>No hay teléfonos disponibles</p>";
    return;
  }

  phonesContainer.innerHTML = phones.map(phone => `
    <div class="phone-card">
      <img src="${phone.thumbnail}" alt="${phone.title}">
      <div class="phone-info">
        <h3>${phone.title}</h3>
        <p class="price">$${phone.price.toFixed(3)}</p>
        <button class="btn-details" data-id="${phone.id}">Ver detalles</button>
      </div>
    </div>
  `).join("");

  // Evento para los botones
  document.querySelectorAll('.btn-details').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const phoneId = e.target.getAttribute('data-id');
      await showPhoneDetails(phoneId);
    });
  });
}

// Mostrar detalles en el modal
async function showPhoneDetails(id) {
  try {
    modalBody.innerHTML = "<p class='loading'>Cargando detalles...</p>";
    modal.style.display = "block";
    
    const response = await fetch(`https://dummyjson.com/products/${id}`);
    if (!response.ok) throw new Error("Error al cargar detalles");
    
    const phone = await response.json();
    
    modalBody.innerHTML = `
      <img src="${phone.thumbnail}" alt="${phone.title}">
      <h2>${phone.title}</h2>
      <p><strong>Precio:</strong> $${phone.price}</p>
      <p><strong>Marca:</strong> ${phone.brand}</p>
      <p><strong>Descripción:</strong> ${phone.description}</p>
      <p><strong>Rating:</strong> ${phone.rating}/5 ⭐</p>
    `;
  } catch (error) {
    modalBody.innerHTML = `<p class='error'>${error.message}</p>`;
  }
}

// Cerrar modal
closeModal.addEventListener('click', () => {
  modal.style.display = "none";
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Iniciar
document.addEventListener('DOMContentLoaded', fetchPhones);