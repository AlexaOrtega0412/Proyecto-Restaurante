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
    `;

    cerrarModal() {
        this.isOpen = false;
        this.requestUpdate();
    }

    render() {
        if(!this.isOpen) return html ``;

        return html`
        <section class="modal-overlay ${this.isOpen ? '' : 'hidden'}" @click=${this.cerrarModal}>
            <section class="modal-content" @click=${e => e.stopPropagation()}>
                <button class="close-btn" @click=${this.cerrarModal}>×</button>
                <h2>Detalles del pedido</h2>
                <section class="cart-items">
                    ${this.cartItems.map(item => html`
                        <div class="cart-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>    
                    `)}
                </section>
            </section>
        </section>
    `;
    }
}

customElements.define('cart-component', CartComponent);