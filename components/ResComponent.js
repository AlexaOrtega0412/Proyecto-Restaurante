import { LitElement, html, css } from 'lit';

export class ResComponent extends LitElement {
  static properties = {
    cartItems: { type: Array },
    desserts: { type: Array },
    token: { type:String },
    loggedUser: { type: Object}

  };

  constructor() {
    super();
    this.cartItems = [];
    this.desserts = [];
    this.token = localStorage.getItem("jwt") || "";
    this.loggedUser = null;
    
  }

  static styles = css`
    :host {
      display: block;
      font-family: 'Arial', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 30px;
      background: #fff9f7;
    }
    header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #5c2018;
    }
    h1 {
      color: #5c2018;
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      border-bottom: 2px solid #f3e0dc;
      padding-bottom: 10px;
    }
    
    .menu-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }
    
    .menu-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .menu-item:hover {
      transform: translateY(-5px);
    }
    
    .menu-image {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-bottom: 1px solid #f3e0dc;
    }
    
    .menu-content {
      padding: 20px;
    }
    
    .menu-item h3 {
      margin: 0 0 8px 0;
      color: #5c2018;
      font-size: 18px;
    }
    
    .menu-item p {
      margin: 0 0 12px 0;
      color: #7a5c50;
      font-size: 14px;
    }
    
    .price-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }
    
    .price {
      font-weight: bold;
      color: #c44536;
      font-size: 18px;
    }
    
   
    .btn-add {
      background: white;
      color: #c44536;
      border: 2px solid #c44536;
      padding: 8px 15px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-add:hover {
      background: #f3e0dc;
    }
    
    .btn-icon {
      width: 16px;
      height: 16px;
    }
    
    .counter {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #c44536;
      border-radius: 20px;
      padding: 2px 8px;
    }
    
    .counter-btn {
      background: white;
      border: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      cursor: pointer;
      font-weight: bold;
      color: #c44536;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    
    .counter-value {
      color: white;
      min-width: 20px;
      text-align: center;
    }
    
    
    .cart-container {
      margin-top: 50px;
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .cart-title {
      color: #5c2018;
      font-size: 22px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .title-icon {
      width: 20px;
      height: 20px;
    }
    
    .cart-items-list {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    
    .cart-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f3e0dc;
    }
    
    .remove-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: #e74c3c;
      font-weight: bold;
      font-size: 16px;
    }
    
    .confirm-btn {
      background: #27ae60;
      color: white;
      border: none;
      padding: 12px;
      width: 100%;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: background 0.3s;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    .confirm-btn:hover {
      background: #219955;
    }
    
    .confirm-icon {
      width: 16px;
      height: 16px;
    }
    
    .cart-empty {
      color: #b8a69b;
      text-align: center;
      padding: 30px;
      font-style: italic;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    const userData = localStorage.getItem("usuario");
    if (userData) {
      this.loggedUser = JSON.parse(userData);
    }

    window.addEventListener("login-success", this.handleLoginSuccess.bind(this));

    if (this.token) {
      this.fetchDesserts();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("login-success", this.handleLoginSuccess.bind(this));
  }

  async fetchDesserts() {
    try {
      const response = await fetch('http://localhost:4040/api.php', {
        headers: {
          "Authorization": `Bearer ${this.token}`
        }
      });

      const data = await response.json();
      
      if (data.platos) {
        this.desserts = data.platos;
      } else {
        console.error('Error al obtener los datos:', data.error);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  handleLoginSuccess(event) {
    this.token = event.detail.token;
    this.loggedUser = event.detail.usuario;
    this.desserts = event.detail.platos;
    this.requestUpdate();
  }


  getQuantity(productId) {
    const item = this.cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }

  
  addToCart(productId) {
    const item = this.cartItems.find(item => item.id === productId);
    
    if (item) {
      item.quantity += 1;
    } else {
      this.cartItems = [...this.cartItems, { 
        id: productId, 
        quantity: 1,
        ...this.desserts.find(d => d.id === productId)
      }];
    }
    this.requestUpdate();
  }

  
  adjustQuantity(productId, amount) {
    const item = this.cartItems.find(item => item.id === productId);
    if (!item) return;

    item.quantity += amount;
    
    if (item.quantity <= 0) {
      this.cartItems = this.cartItems.filter(i => i.id !== productId);
    }
    this.requestUpdate();
  }

  
  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
  }

  // Confirmar pedido (sin redirección aún)
  confirmOrder() {
    if (this.cartItems.length === 0) {
      alert("¡Tu carrito está vacío!");
      return;
    }
    
    // Se agrega la refencia al otro componente
    const modalCart = this.shadowRoot.querySelector('cart-component');
    modalCart.cartItems = this.cartItems;
    modalCart.isOpen = true;
    modalCart.requestUpdate();
  }

  limpiarCarrito() {
    this.cartItems = [];
    this.requestUpdate();
  }

  logOut() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("jwt");
    this.loggedUser = null;
    window.location.reload(); 
  }

  render() {
    if(!this.token) {
      return html`<p>Inicia sesión para ver los platos</p>`;
    }

    return html`
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

    <header>
      <h3>${this.loggedUser ? this.loggedUser.nombre : 'Usuario'}</h3>
      <i class="material-icons" @click=${this.logOut}>exit_to_app</i>
    </header>
      <h1>Desserts</h1>
      
      <div class="menu-container">
        ${this.desserts.map(dessert => html`
          <div class="menu-item">
            <img class="menu-image" src="./assets/images/${dessert.url_imagen}" alt="${dessert.nombre}">
            <div class="menu-content">
              <h3>${dessert.nombre}</h3>
              <p>${dessert.tamano}</p>
              
              <div class="price-container">
                <div class="price">$${dessert.costo.toFixed(2)}</div>
                
                ${this.getQuantity(dessert.id) === 0
                  ? html`
                      <button class="btn-add" @click=${() => this.addToCart(dessert.id)}>
                        <img class="btn-icon" src="./assets/images/cart-icon.svg" alt="Cart">
                        Add to Cart
                      </button>
                    `
                  : html`
                      <div class="counter">
                        <button class="counter-btn" @click=${() => this.adjustQuantity(dessert.id, -1)}>
                          −
                        </button>
                        <span class="counter-value">${this.getQuantity(dessert.id)}</span>
                        <button class="counter-btn" @click=${() => this.adjustQuantity(dessert.id, 1)}>
                          +
                        </button>
                      </div>
                    `}
              </div>
            </div>
          </div>
        `)}
      </div>
      
      <div class="cart-container">
        <div class="cart-title">
          <img class="title-icon" src="./assets/images/cart-icon.svg" alt="Cart">
          Tu Carrito (${this.cartItems.reduce((total, item) => total + item.quantity, 0)})
        </div>
        
        ${this.cartItems.length === 0
          ? html`<div class="cart-empty">Agrega productos al carrito</div>`
          : html`
              <div class="cart-items-list">
                ${this.cartItems.map(item => {
                  const dessert = this.desserts.find(d => d.id === item.id);
                  return html`
                    <div class="cart-item">
                      <span>${dessert?.nombre} × ${item.quantity}</span>
                      <button class="remove-btn" @click=${() => this.removeFromCart(item.id)}>
                        ×
                      </button>
                    </div>
                  `;
                })}
              </div>
              
              <button class="confirm-btn" @click=${this.confirmOrder}>
                <img class="confirm-icon" src="./assets/images/confirm-icon.svg" alt="Confirmar">
                Confirmar Pedido
              </button>
            `}
      </div>

      <!-- Se agrega el modal del resumen del carrito -->
      <cart-component @limpiar-carrito=${this.limpiarCarrito}></cart-component>
    `;
  }
}

customElements.define('res-component', ResComponent);