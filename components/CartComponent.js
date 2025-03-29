import { LitElement, html, css } from "lit";

export class CartComponent extends LitElement {
    constructor() {
        super();
        this.cartItems = [];
        this. isOpen = false;
    }

    static properties = {
        cartItems: {type: Array},
        isOpen:{type:Boolean}
    };

    static styles = css`
        .hidden {
            display: none;
        }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }

        .modal-content {
            background: white;
            padding: 30px;
            margin: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            width: 90%;
            position: relative;
        }

        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #c44536;
        }

        h2 {
            color: #5c2018;
            margin-bottom: 20px;
        }

        .cart-items {
            max-height: 300px;
            overflow-y: auto;
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3e0dc;
        }

        .total {
            font-size: 20px;
            font-weight: bold;
            color: #27ae60;
            margin: 20px 0;
            text-align: right;
        }

        .new-order-btn {
            background: #c44536;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: background 0.3s;
            display: block;
            width: 100%;
            text-align: center;
        }

        .new-order-btn:hover {
            background: #a33228;
        }
    `;

    cerrarModal() {
        this.isOpen = false;
        this.requestUpdate();
    }

    limpiarOrden() {
        this.isOpen = false;
        this.dispatchEvent(new CustomEvent('limpiar-carrito', {
            bubbles: true,
            composed: true
        }));
        this.requestUpdate();
    }

    obtenerTotal() {
        return this.cartItems.reduce((total, item) => total + (item.costo * item.quantity), 0).toFixed(2);
    }

    render() {
        if(!this.isOpen) return html ``;

        return html`
        <section class="modal-overlay ${this.isOpen ? '' : 'hidden'}" @click=${this.cerrarModal}>
            <section class="modal-content" @click=${e => e.stopPropagation()}>
                <button class="close-btn" @click=${this.cerrarModal}>×</button>
                <h2>Orden confirmada</h2>
                <p>¡Esperemos disfrutes tu comida!</p>

                <section class="cart-items">
                    ${this.cartItems.map(item => html`
                        <div class="cart-item">
                            <span>${item.nombre} x ${item.quantity}</span>
                            <span>$${(item.costo * item.quantity).toFixed(2)}</span>
                        </div>    
                    `)}
                </section>

                <section class="total">Total: $${this.obtenerTotal()}</section>

                <button class="new-order-btn" @click=${this.limpiarOrden}>Realizar nueva orden</button>
            </section>
        </section>
    `;
    }
}

customElements.define('cart-component', CartComponent);