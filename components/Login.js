import { LitElement, html, css } from "lit";
import { getToken } from "../services/token.js";
import { getUsers } from "../services/getusers.js";

export class Login extends LitElement {
  static properties = {
    user: { type: String },
    pass: { type: String },
    token: { type: String },
    loggedUser: { type: Object },
    platos: { type: Array }
  };

  constructor() {
    super();
    this.user = "";
    this.pass = "";
    this.token = "";
    this.loggedUser = null;
    this.platos = [];
  }

  static styles = css`
    :host {
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f5f5f5;
      font-family: Arial, sans-serif;
    }
    main {
      display: flex;
      width: 80%;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    figure {
      flex: 1;
      margin: 0;
      position: relative;
    }
    img {
      width: 90%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    section {
      flex: 1;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .logo {
      height: 14rem;
    }
    h1 {
      color: #5c2018;
      margin-bottom: 2rem;
      text-align: center;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
    }
    input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #f47e2a;
    }
    button {
      padding: 0.8rem;
      background: #f47e2a;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 1rem;
    }
    button:hover {
      background: #e5671b;
    }
    @media (max-width: 768px) {
      main {
        width: 95%;
        height: 90%;
        flex-direction: column;
      }
      figure {
        display: none;
      }
      .logo {
        height: 10rem;
        margin-bottom: 5rem;
      }
    }
  `;

  render() {
    return html`
      <main>
        <figure>
          <img
            src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            alt="Imagen decorativa de login"
          />
        </figure>

        <section>
          <img class="logo" src="../assets/images/logo-restaurant.png" alt="Logo del restaurante" />
          <h1>Iniciar sesión</h1>
          <form @submit="${this.enviarFormulario}">
            <div>
              <label for="user">Usuario</label>
              <input
                type="text"
                id="user"
                name="user"
                .value="${this.user}"
                @input="${this.infoInput}"
                required
              />
            </div>
            <div>
              <label for="pass">Contraseña</label>
              <input
                type="password"
                id="pass"
                name="pass"
                .value="${this.pass}"
                @input="${this.infoInput}"
                required
              />
            </div>
            <button type="submit">Iniciar sesión</button>
          </form>
          ${this.token
            ? html`<p>El token es: ${this.token}</p>`
            : ''
          }
          ${this.loggedUser
            ? html`<p>Usuario: ${this.loggedUser.nombre} - Perfil: ${this.loggedUser.perfil}</p>`
            : ''
          }
          ${this.platos.length > 0
            ? html`
                <ul>
                  ${this.platos.map(plato => html`<li>${plato.nombre}</li>`)}
                </ul>
              `
            : ''
          }
        </section>
      </main>
    `;
  }

  infoInput(e) {
    this[e.target.name] = e.target.value;
  }

  async enviarFormulario(e) {
    e.preventDefault();

    await getToken(this.user, this.pass);
    
    const tokenObtenido = localStorage.getItem("jwt");
    this.token = tokenObtenido ? tokenObtenido : "";
    
    const datosGet = await getUsers();
    this.loggedUser = datosGet.usuario;
    this.platos = datosGet.platos;
    
   
    this.dispatchEvent(new CustomEvent("login-success", {
      detail: { token: this.token, usuario: this.loggedUser, platos: this.platos },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define("res-login", Login);

